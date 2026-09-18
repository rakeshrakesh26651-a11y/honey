/**
 * POST /api/create-order
 * Production-Grade Razorpay Order Creation Endpoint
 * - Strict server-side price calculation
 * - Customer contact & delivery address validation
 * - Key secret NEVER exposed to frontend
 */

import { calculateServerOrderTotal } from './_products.ts';
import {
  parseRequestBody,
  sendJsonResponse,
  validateCustomerDetails,
  getRazorpayClient,
} from './_razorpay.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJsonResponse(res, 405, {
      success: false,
      error: 'Method Not Allowed. Please use POST.',
    });
  }

  try {
    const body = await parseRequestBody(req);
    const { customer, items } = body;

    // 1. Validate Customer Information
    const customerValidation = validateCustomerDetails(customer);
    if (!customerValidation.valid || !customerValidation.customer) {
      return sendJsonResponse(res, 400, {
        success: false,
        error: customerValidation.error || 'Invalid customer details',
      });
    }

    const validatedCustomer = customerValidation.customer;

    // 2. Validate Cart and Calculate Price Server-Side (including state-based shipping)
    const calculation = calculateServerOrderTotal(items, validatedCustomer.state);
    if (!calculation.valid) {
      return sendJsonResponse(res, 400, {
        success: false,
        error: calculation.error || 'Cart validation failed',
      });
    }

    const { amountInPaise, total, subtotal, shipping, verifiedItems } = calculation;

    // 3. Obtain Razorpay Client
    const { client, keyId, isMock } = getRazorpayClient();

    // 4. Create Razorpay Order
    let orderId: string;

    if (isMock || !client) {
      // Mock / automated test simulation mode
      orderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    } else {
      const receiptId = `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          customer_name: validatedCustomer.name,
          customer_phone: validatedCustomer.phone,
          customer_email: validatedCustomer.email,
          delivery_address: `${validatedCustomer.address}, ${validatedCustomer.city}, ${validatedCustomer.state} - ${validatedCustomer.pincode}`,
          item_count: String(verifiedItems.reduce((acc, i) => acc + i.quantity, 0)),
          subtotal: String(subtotal),
          shipping: String(shipping),
          total: String(total),
        },
      };

      const razorpayOrder = await client.orders.create(options as any);
      orderId = razorpayOrder.id;
    }

    // 5. Return Safe Response to Frontend
    // ONLY public keyId, orderId, amount, currency, and verified breakdowns are returned
    return sendJsonResponse(res, 200, {
      success: true,
      orderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId,
      subtotal,
      shipping,
      total,
      customer: {
        name: validatedCustomer.name,
        email: validatedCustomer.email,
        phone: validatedCustomer.phone,
        state: validatedCustomer.state,
      },
    });
  } catch (error: any) {
    // Log internal error safely without exposing secret or stack trace
    console.error('[API create-order error]:', error?.message || 'Unknown error');
    return sendJsonResponse(res, 500, {
      success: false,
      error: 'Unable to initiate payment with bank. Please try again or contact support.',
    });
  }
}

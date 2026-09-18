/**
 * POST /api/webhook
 * Razorpay Asynchronous Webhook Receiver
 * - Listens for server-to-server events (order.paid, payment.captured, payment.failed)
 * - Verifies cryptographic HMAC-SHA256 signature against RAZORPAY_WEBHOOK_SECRET
 * - Prevents missed order fulfillment even if customer drops connection after payment
 */

import crypto from 'crypto';
import { parseRequestBody, sendJsonResponse } from './_razorpay.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJsonResponse(res, 405, { error: 'Method Not Allowed' });
  }

  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // If webhook secret is not configured, log warning and reject
    console.warn('[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET not set.');
    return sendJsonResponse(res, 500, { error: 'Webhook secret not configured on server' });
  }

  try {
    const rawBody = await parseRequestBody(req);
    const bodyString = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);

    // Cryptographic validation of webhook payload
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyString)
      .digest('hex');

    if (!signature) {
      return sendJsonResponse(res, 400, { error: 'Missing x-razorpay-signature header' });
    }

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(String(signature), 'utf-8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return sendJsonResponse(res, 400, { error: 'Invalid webhook signature' });
    }

    const isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      console.error('[Razorpay Webhook] Invalid webhook signature');
      return sendJsonResponse(res, 400, { error: 'Invalid webhook signature' });
    }

    const event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const eventType = event.event;

    console.log(`[Razorpay Webhook] Received verified event: ${eventType}`);

    switch (eventType) {
      case 'payment.captured':
      case 'order.paid': {
        const paymentEntity = event.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        const paymentId = paymentEntity?.id;
        const amount = paymentEntity?.amount;
        console.log(`[Razorpay Webhook] Order ${orderId} marked PAID with payment ${paymentId} for ₹${amount / 100}`);
        // Production order fulfillment / inventory decrement hook
        break;
      }
      case 'payment.failed': {
        const paymentEntity = event.payload?.payment?.entity;
        console.warn(`[Razorpay Webhook] Payment failed for order ${paymentEntity?.order_id}`);
        break;
      }
      default:
        console.log(`[Razorpay Webhook] Unhandled event: ${eventType}`);
        break;
    }

    return sendJsonResponse(res, 200, { status: 'ok', received: true });
  } catch (error: any) {
    console.error('[Razorpay Webhook Error]:', error?.message || error);
    return sendJsonResponse(res, 500, { error: 'Internal webhook processing error' });
  }
}

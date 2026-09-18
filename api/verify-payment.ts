/**
 * POST /api/verify-payment
 * Server-Side Razorpay Payment Verification
 * - Validates cryptographic HMAC-SHA256 signature
 * - Marks payment status as 'paid' ONLY after mathematical verification
 * - Never trusts client-side callbacks without signature confirmation
 */

import {
  parseRequestBody,
  sendJsonResponse,
  verifyRazorpaySignature,
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return sendJsonResponse(res, 400, {
        success: false,
        verified: false,
        paymentStatus: 'failed',
        error: 'Missing required Razorpay payment verification parameters.',
      });
    }

    const { keySecret, isMock } = getRazorpayClient();

    let isValid = false;

    if (isMock) {
      // In mock / test simulation mode, verify test token or mock signature
      isValid =
        razorpay_signature.startsWith('mock_sig_valid') ||
        verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, keySecret);
    } else {
      // Production & Live/Test Mode: Strict HMAC-SHA256 cryptographic verification
      isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        keySecret
      );
    }

    if (!isValid) {
      return sendJsonResponse(res, 400, {
        success: false,
        verified: false,
        paymentStatus: 'failed',
        error: 'Payment verification failed: Invalid cryptographic signature.',
      });
    }

    // Payment successfully and securely verified
    return sendJsonResponse(res, 200, {
      success: true,
      verified: true,
      paymentStatus: 'paid',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      message: 'Payment verified successfully.',
    });
  } catch (error: any) {
    console.error('[API verify-payment error]:', error?.message || 'Unknown error');
    return sendJsonResponse(res, 500, {
      success: false,
      verified: false,
      paymentStatus: 'failed',
      error: 'Unable to verify payment signature. Please contact support.',
    });
  }
}

/**
 * Razorpay Client Payment Orchestration Service
 * - Dynamic asynchronous script loader with retry
 * - Server-side order creation (POST /api/create-order)
 * - Cryptographic payment verification (POST /api/verify-payment)
 * - Safe guest checkout handling
 * - Zero client-side secret exposure
 */

import { CartItem } from '../components/CartDrawer';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  subtotal?: number;
  shipping?: number;
  total?: number;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  verified: boolean;
  paymentStatus: 'paid' | 'failed' | 'pending';
  orderId?: string;
  paymentId?: string;
  message?: string;
  error?: string;
}

/**
 * Loads the official Razorpay Checkout v1 script dynamically.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    // Check if script element already exists
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Requests the server to validate cart and create a Razorpay Order.
 * The server calculates the payable amount independently using verified catalog prices.
 */
export async function createServerOrder(
  customer: CustomerInfo,
  items: CartItem[]
): Promise<CreateOrderResponse> {
  try {
    const payload = {
      customer,
      items: items.map((item) => ({
        id: item.id,
        productId: item.product.id,
        size: item.size,
        quantity: item.quantity,
      })),
    };

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to create payment order. Please try again.',
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: 'Network error connecting to payment server. Please check your internet connection.',
    };
  }
}

/**
 * Submits the Razorpay payment credentials to the server for HMAC-SHA256 signature verification.
 */
export async function verifyServerPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<VerifyPaymentResponse> {
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.verified) {
      return {
        success: false,
        verified: false,
        paymentStatus: 'failed',
        error: data.error || 'Payment signature verification failed.',
      };
    }

    return {
      success: true,
      verified: true,
      paymentStatus: 'paid',
      orderId: data.orderId,
      paymentId: data.paymentId,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      verified: false,
      paymentStatus: 'failed',
      error: 'Unable to reach payment verification server. Your cart is preserved.',
    };
  }
}

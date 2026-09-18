/**
 * Razorpay Server-Side Utilities & Security Hardening
 * - HMAC SHA-256 Signature Verification using timingSafeEqual
 * - Safe HTTP Request Parsing (Vercel serverless & Vite dev middleware compatible)
 * - Strict Customer Input Validation
 * - Zero Client-Side Secret Leakage
 */

import crypto from 'crypto';
import Razorpay from 'razorpay';

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export function validateCustomerDetails(customer: unknown): { valid: boolean; error?: string; customer?: CustomerDetails } {
  if (!customer || typeof customer !== 'object') {
    return { valid: false, error: 'Customer information is required' };
  }

  const raw = customer as Record<string, unknown>;

  const name = String(raw.name || '').trim();
  const phone = String(raw.phone || '').trim().replace(/[\s\-+]/g, '');
  const email = String(raw.email || '').trim().toLowerCase();
  const address = String(raw.address || '').trim();
  const city = String(raw.city || '').trim();
  const state = String(raw.state || '').trim();
  const pincode = String(raw.pincode || '').trim().replace(/\s+/g, '');

  if (name.length < 2) {
    return { valid: false, error: 'Please enter your full name (minimum 2 characters).' };
  }

  // Indian mobile numbers typically 10 digits (or 91+10 digits)
  const phoneDigits = phone.startsWith('91') && phone.length === 12 ? phone.slice(2) : phone;
  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (address.length < 5) {
    return { valid: false, error: 'Please provide a complete delivery address (minimum 5 characters).' };
  }

  if (city.length < 2) {
    return { valid: false, error: 'Please enter a valid city name.' };
  }

  if (state.length < 2) {
    return { valid: false, error: 'Please enter a valid state.' };
  }

  if (!/^\d{6}$/.test(pincode)) {
    return { valid: false, error: 'Please enter a valid 6-digit PIN code.' };
  }

  return {
    valid: true,
    customer: {
      name,
      phone: phoneDigits,
      email,
      address,
      city,
      state,
      pincode,
    },
  };
}

export async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf-8');
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => {
      resolve({});
    });
  });
}

export function sendJsonResponse(res: any, statusCode: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(data));
}

/**
 * Initializes Razorpay instance using server-side keys
 */
export function getRazorpayClient(): {
  client: Razorpay | null;
  keyId: string;
  keySecret: string;
  isMock: boolean;
} {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

  // Test mode simulation when mock keys are used in automated test runs
  const isMock =
    !keyId ||
    !keySecret ||
    keyId.includes('placeholder') ||
    keyId.includes('mock') ||
    keySecret.includes('placeholder') ||
    keySecret.includes('mock');

  if (isMock) {
    return {
      client: null,
      keyId: keyId || 'rzp_test_mock_key_id',
      keySecret: keySecret || 'mock_key_secret',
      isMock: true,
    };
  }

  const client = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return { client, keyId, keySecret, isMock: false };
}

/**
 * Verifies Razorpay Signature using timing-safe HMAC-SHA256 comparison
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  receivedSignature: string,
  keySecret: string
): boolean {
  if (!orderId || !paymentId || !receivedSignature || !keySecret) {
    return false;
  }

  try {
    const payload = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const expectedBuffer = Buffer.from(generatedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(receivedSignature, 'utf-8');

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    return false;
  }
}

/**
 * Server-Side Product Catalog & Order Price Verification
 * Strict Source of Truth for Razorpay Order Creation
 * Prevents client-side price tampering or unverified variants
 */

export interface ProductCatalogEntry {
  id: string;
  name: string;
  variants: Record<string, number>; // variant size -> price in INR
}

export const SERVER_PRODUCT_CATALOG: Record<string, ProductCatalogEntry> = {
  'forest-honey': {
    id: 'forest-honey',
    name: 'Forest Honey',
    variants: {
      '400g': 399,
      '1kg': 699,
      '1000g': 699,
    },
  },
  'mountain-honey': {
    id: 'mountain-honey',
    name: 'Mountain Honey',
    variants: {
      '400g': 449,
      '1kg': 899,
      '1000g': 899,
    },
  },
  'kombu-honey': {
    id: 'kombu-honey',
    name: 'Kombu Honey',
    variants: {
      '400g': 499,
      '1kg': 999,
      '1000g': 999,
    },
  },
  'stingless-bee-honey': {
    id: 'stingless-bee-honey',
    name: 'Stingless Bee Honey',
    variants: {
      '400g': 749,
      '1kg': 1499,
      '1000g': 1499,
    },
  },
};

export interface OrderItemRequest {
  id?: string;
  productId: string;
  size: string;
  quantity: number;
}

export interface VerifiedOrderItem {
  productId: string;
  productName: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderCalculationResult {
  valid: boolean;
  error?: string;
  subtotal: number;
  shipping: number;
  total: number;
  amountInPaise: number;
  verifiedItems: VerifiedOrderItem[];
}

/**
 * Normalizes state name to detect Tamil Nadu safely.
 * Handles "Tamil Nadu", "tamil nadu", "TN", "tamilnadu"
 */
export function isTamilNadu(state?: string): boolean {
  if (!state) return false;
  const normalized = state.trim().toLowerCase().replace(/[^a-z]/g, '');
  return normalized === 'tamilnadu' || normalized === 'tn';
}

/**
 * Calculates delivery shipping fee based on subtotal and destination state.
 * Rule:
 * - Subtotal >= ₹1,000 -> FREE (0)
 * - Subtotal < ₹1,000:
 *   - Tamil Nadu -> ₹50
 *   - Any other state -> ₹100
 */
export function calculateShippingFee(subtotal: number, state?: string): number {
  if (subtotal >= 1000) {
    return 0;
  }
  return isTamilNadu(state) ? 50 : 100;
}

/**
 * Validates cart items and calculates exact server-verified total including state-based shipping.
 * NEVER trusts client-submitted unitPrice, shipping, or lineTotal.
 */
export function calculateServerOrderTotal(items: unknown, state?: string): OrderCalculationResult {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      valid: false,
      error: 'Cart is empty. Please select products before proceeding to payment.',
      subtotal: 0,
      shipping: 0,
      total: 0,
      amountInPaise: 0,
      verifiedItems: [],
    };
  }

  let subtotal = 0;
  const verifiedItems: VerifiedOrderItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    if (!raw || typeof raw !== 'object') {
      return {
        valid: false,
        error: `Invalid cart item at index ${i}`,
        subtotal: 0,
        shipping: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    // Support both raw.productId and raw.product.id for client flexibility
    const productId = String(
      (raw as any).productId || (raw as any).product?.id || (raw as any).id?.split('-')[0] || ''
    ).trim();

    const size = String(
      (raw as any).size || (raw as any).variant || '400g'
    ).trim();

    const quantity = Number((raw as any).quantity);

    if (!productId || !SERVER_PRODUCT_CATALOG[productId]) {
      return {
        valid: false,
        error: `Product not recognized: ${productId || 'unknown'}`,
        subtotal: 0,
        shipping: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    const catalogProduct = SERVER_PRODUCT_CATALOG[productId];
    const unitPrice = catalogProduct.variants[size];

    if (unitPrice === undefined) {
      return {
        valid: false,
        error: `Invalid variant '${size}' for product '${catalogProduct.name}'`,
        subtotal: 0,
        shipping: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      return {
        valid: false,
        error: `Invalid quantity '${quantity}' for '${catalogProduct.name}'. Must be between 1 and 100.`,
        subtotal: 0,
        shipping: 0,
        total: 0,
        amountInPaise: 0,
        verifiedItems: [],
      };
    }

    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    verifiedItems.push({
      productId,
      productName: catalogProduct.name,
      variant: size,
      quantity,
      unitPrice,
      lineTotal,
    });
  }

  // Calculate state-based shipping fee
  const shipping = calculateShippingFee(subtotal, state);
  const total = subtotal + shipping;

  // Convert INR to paise strictly using integer arithmetic
  const amountInPaise = Math.round(total * 100);

  return {
    valid: true,
    subtotal,
    shipping,
    total,
    amountInPaise,
    verifiedItems,
  };
}

/**
 * Himalayan Harvest Honey — Domain Models & Firestore Collection Schemas
 * Type-safe definitions for products, variants, inventory, orders, customers,
 * reviews, coupons, settings, and audit logs.
 */

import type { Timestamp } from 'firebase/firestore';

// =============================================================================
// 1. PRODUCT & VARIANT MODELS (/products/{productId})
// =============================================================================

export interface ProductVariant {
  /** Unique variant identifier e.g. 'forest-honey-400g' */
  id: string;
  /** Stock Keeping Unit e.g. 'HHH-FH-400G' */
  sku: string;
  /** Volume / weight label: e.g. '400g', '1kg', '1000g', '250ml', '500ml' */
  size: '400g' | '1kg' | '1000g' | '250ml' | '500ml' | string;
  /** Human-readable weight representation */
  weight: string;
  /** Normalized weight in grams (used for courier calculation) */
  weightInGrams: number;
  /** Authoritative selling price in INR */
  price: number;
  /** Strike-through compare-at price in INR */
  compareAtPrice?: number;
  /** Asset URL for this variant */
  image: string;
  /** Flag indicating dedicated photograph exists */
  hasDistinctAsset: boolean;
  /** Variant-specific availability toggle */
  available: boolean;
  /** Stock count for this variant */
  stock?: number;
}

export interface ProductCharacteristics {
  aroma: string;
  tasteNote: string;
  sweetness: string;
  texture: string;
}

export interface ProductAccordions {
  description: string[];
  productDetails: {
    ingredients?: string;
    packaging?: string;
    storage?: string;
    shelfLife?: string;
    [key: string]: string | undefined;
  };
  traditionalUse: string[];
  harvestingAndSource: string[];
  qualityLabReport?: {
    note?: string;
    reportNumber?: string;
    reportDate?: string;
    facility?: string;
    standard?: string;
    testedSampleNote?: string;
    highlights?: Array<{ parameter: string; result: string; requirement: string }>;
    [key: string]: any;
  };
  returnsAndExchange?: {
    summary: string;
    link: string;
  };
}

export interface ProductDocument {
  id: string;
  slug: string;
  name: string;
  category: 'Wild Mountain Flora' | 'High-Altitude Flora' | 'Small Bee Wild Comb' | 'Rare Mountain Comb' | string;
  subtitle?: string;
  description: string;
  badge?: 'BEST SELLER' | 'HARVEST SPECIAL' | 'RARE' | 'LIMITED HARVEST' | string;
  /** Master catalog availability toggle */
  available: boolean;
  /** Active status alias */
  active?: boolean;
  featured?: boolean;
  displayOrder?: number;
  image: string;
  alt?: string;
  galleryImages?: string[];
  basePrice?: number;
  compareAtPrice?: number;
  variants: ProductVariant[];
  characteristics: ProductCharacteristics;
  accordions: ProductAccordions;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string;
  updatedBy?: string;
}

// =============================================================================
// 2. INVENTORY MODEL (/inventory/{sku}) — Admin Private
// =============================================================================

export interface InventoryDocument {
  sku: string;
  productId: string;
  productName: string;
  variantSize: string;
  /** Total physical stock in warehouse */
  stockOnHand: number;
  /** Stock locked in active pending checkout sessions */
  stockReserved: number;
  /** Computed as (stockOnHand - stockReserved) */
  stockAvailable: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  lastRestockedAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

// =============================================================================
// 3. ORDER MODEL (/orders/{orderId})
// =============================================================================

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  variantId: string;
  sku: string;
  productName: string;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
}

export interface OrderPricing {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  amountInPaise: number;
}

export interface OrderCustomerDetails {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderFulfillment {
  courierPartner?: 'ST Courier' | 'Professional Couriers' | 'India Post' | 'Delhivery' | 'BlueDart' | string;
  trackingNumber?: string;
  trackingUrl?: string;
  dispatchedAt?: Timestamp;
  deliveredAt?: Timestamp;
  dispatchNotes?: string;
}

export interface OrderDocument {
  id: string;
  orderNumber: string; // e.g. 'HHH-001001'
  paymentGateway: 'razorpay' | 'whatsapp_direct' | 'manual';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  pricing: OrderPricing;
  customer: OrderCustomerDetails;
  fulfillment: OrderFulfillment;
  adminNotes?: string;
  customerNotes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================================================
// 4. CUSTOMER PROFILE MODEL (/users/{uid})
// =============================================================================

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CustomerMetrics {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Timestamp;
  firstOrderDate: Timestamp;
}

export interface CustomerDocument {
  uid: string;
  name: string;
  email: string;
  phone: string;
  savedAddresses?: SavedAddress[];
  /** Server-managed metrics (immutable by client SDK) */
  metrics?: CustomerMetrics;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================================================
// 5. REVIEW MODEL (/reviews/{reviewId})
// =============================================================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewDocument {
  id: string;
  userId: string;
  productId?: string;
  productName?: string;
  authorName: string;
  authorLocation: string;
  rating: number; // 1 to 5
  title: string;
  quote: string;
  mediaUrls?: string[];
  status: ReviewStatus; // Always starts as 'pending' on client creation
  verifiedPurchase: boolean;
  moderatedAt?: Timestamp;
  moderatedBy?: string;
  createdAt: Timestamp;
}

// =============================================================================
// 6. COUPON MODEL (/coupons/{couponCode}) — Admin Private
// =============================================================================

export type CouponDiscountType = 'percentage' | 'fixed';

export interface CouponDocument {
  code: string; // Uppercase key
  discountType: CouponDiscountType;
  discountValue: number; // e.g. 10 (10%) or 100 (₹100)
  minimumOrderAmount: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: Timestamp;
  expirationDate: Timestamp;
  active: boolean;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  updatedBy: string;
}

// =============================================================================
// 7. SETTINGS MODELS (/settings/shipping & /settings/general)
// =============================================================================

export interface ShippingSettingsDocument {
  id: 'shipping';
  freeShippingThreshold: number; // e.g. 1000
  tamilNaduFee: number; // e.g. 50
  otherStatesFee: number; // e.g. 100
  enabledStates: string[];
  estimatedDeliveryTN: string;
  estimatedDeliveryNational: string;
  updatedAt: Timestamp;
  updatedBy: string;
}

export interface GeneralSettingsDocument {
  id: 'general';
  brandName: string;
  contactPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  instagramHandle: string;
  announcementText: string;
  isStoreOnline: boolean;
  updatedAt: Timestamp;
  updatedBy: string;
}

// =============================================================================
// 8. AUDIT LOG MODEL (/audit_logs/{logId}) — Server Created Only
// =============================================================================

export type AuditLogAction =
  | 'PRODUCT_CREATED'
  | 'PRODUCT_UPDATED'
  | 'PRODUCT_DELETED'
  | 'ORDER_STATUS_CHANGED'
  | 'TRACKING_ADDED'
  | 'STOCK_ADJUSTED'
  | 'COUPON_CREATED'
  | 'SETTINGS_CHANGED'
  | 'REVIEW_MODERATED';

export interface AuditLogDocument {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: AuditLogAction;
  entityType: 'product' | 'order' | 'inventory' | 'coupon' | 'review' | 'settings';
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  timestamp: Timestamp;
}

// =============================================================================
// 9. MONOTONIC COUNTER (/counters/orders) — Server Transaction Only
// =============================================================================

export interface OrderCounterDocument {
  currentSequence: number;
  prefix: string;
  updatedAt: Timestamp;
}

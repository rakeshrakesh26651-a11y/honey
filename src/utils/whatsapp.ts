import { CartItem } from '../components/CartDrawer';
import { BRAND_CONFIG } from '../data/himalayanHarvest';

/**
 * Verified Business WhatsApp Number from Instagram: +91 81243 91725
 */
export const WHATSAPP_NUMBER = BRAND_CONFIG.whatsappNumber; // "918124391725"

/**
 * Formats a pre-filled WhatsApp order message according to the verified Himalayan Harvest requirements:
 *
 * Single Product:
 * Hello Himalayan Harvest Honey! 👋
 *
 * I would like to order:
 *
 * Product: [PRODUCT NAME]
 * Quantity: [QUANTITY]
 * Weight: [WEIGHT]
 * Price: ₹[PRICE]
 *
 * Please confirm availability and the total amount.
 *
 * Multiple Products:
 * Hello Himalayan Harvest Honey! 👋
 *
 * I would like to order:
 *
 * 1. [PRODUCT NAME] — [WEIGHT] — Qty: [QUANTITY] — ₹[PRICE]
 * 2. [PRODUCT NAME] — [WEIGHT] — Qty: [QUANTITY] — ₹[PRICE]
 *
 * Please confirm availability and the total amount.
 */
export function formatWhatsAppOrderMessage(items: CartItem[]): string {
  if (items.length === 0) {
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to inquire about your honey products.`;
  }

  if (items.length === 1) {
    const item = items[0];
    const weightText = item.product.weight || 'Standard';
    const priceText = item.quantity > 1 ? `₹${item.product.price} each` : `₹${item.product.price}`;
    return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\nProduct: ${item.product.name}\nQuantity: ${item.quantity}\nWeight: ${weightText}\nPrice: ${priceText}\n\nPlease confirm availability and the total amount.`;
  }

  const productList = items
    .map((item, index) => {
      const weightText = item.product.weight || 'Standard';
      const priceText = item.quantity > 1 ? `₹${item.product.price * item.quantity}` : `₹${item.product.price}`;
      return `${index + 1}. ${item.product.name} — ${weightText} — Qty: ${item.quantity} — ${priceText}`;
    })
    .join('\n');

  return `Hello Himalayan Harvest Honey! 👋\n\nI would like to order:\n\n${productList}\n\nPlease confirm availability and the total amount.`;
}

/**
 * Constructs the WhatsApp URL with the pre-filled, URL-encoded order message.
 * Structure: https://wa.me/918124391725?text=[ENCODED_MESSAGE]
 */
export function getWhatsAppOrderUrl(items: CartItem[]): string {
  const message = formatWhatsAppOrderMessage(items);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp with the order message in a new tab/window, preserving the cart state.
 */
export function openWhatsAppOrder(items: CartItem[]): void {
  const url = getWhatsAppOrderUrl(items);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * WhatsApp Wholesale Enquiry URL
 */
export function getWhatsAppWholesaleUrl(): string {
  const message = `Hello Himalayan Harvest Honey! 👋\n\nI am interested in a wholesale/bulk honey enquiry.\n\nPlease share your available products, quantities, pricing and delivery details.\n\nThank you.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp for Wholesale Enquiries
 */
export function openWhatsAppWholesale(): void {
  const url = getWhatsAppWholesaleUrl();
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

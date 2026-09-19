import React from 'react';
import { Product } from '../data/content';

export interface CartItem {
  id: string; // unique item id: e.g. `${product.id}-${size}`
  product: Product;
  size: string;
  unitPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
  onNavigate?: (path: string) => void;
}

/**
 * CartDrawer is disabled across all devices in favor of the dedicated /cart page.
 */
export const CartDrawer: React.FC<CartDrawerProps> = () => {
  return null;
};

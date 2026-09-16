import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, OilDropIcon } from './Icons';
import { Product } from '../data/content';
import { openWhatsAppOrder } from '../utils/whatsapp';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1e1a16]/40 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[440px] h-full bg-[#f7f2e7] shadow-2xl flex flex-col z-10 border-l border-[#1e1a16]/10"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#1e1a16]/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-[24px] font-semibold text-[#1e1a16]">
                  Your Cart
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#1e1a16]/5 text-[#1e1a16]">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#1e1a16] hover:opacity-60 transition-opacity rounded-full"
                aria-label="Close cart"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="px-6 py-3 bg-[#c88a2b]/10 border-b border-[#c88a2b]/20">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-[#1e1a16]">
                <span className="flex items-center gap-1.5">
                  <OilDropIcon size={12} color="#c88a2b" />
                  {freeShippingRemaining === 0 ? (
                    <span className="font-bold text-[#c88a2b]">You've unlocked free shipping!</span>
                  ) : (
                    <span>Add ₹{freeShippingRemaining.toFixed(0)} more for free shipping</span>
                  )}
                </span>
                <span>{freeShippingPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-[#1e1a16]/10 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#c88a2b] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${freeShippingPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items or Empty State */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 rounded-full bg-[#1e1a16]/5 flex items-center justify-center">
                    <OilDropIcon size={32} color="#657044" />
                  </div>
                  <h4 className="font-serif text-2xl text-[#1e1a16]">Your cart is empty</h4>
                  <p className="font-sans text-sm text-[#1e1a16]/70 max-w-[260px]">
                    Pure Himalayan honey is waiting. Discover our single-origin mountain harvests.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-3 rounded-full bg-[#657044] text-white font-sans text-sm font-medium hover:bg-[#525b37] transition-colors"
                  >
                    Explore The Collection
                  </button>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex space-x-4 pb-6 border-b border-[#1e1a16]/10 last:border-b-0"
                  >
                    <img
                      src={product.image}
                      alt={product.alt}
                      className="w-20 h-24 object-cover rounded-xl bg-[#1e1a16]/5 flex-shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-lg font-medium text-[#1e1a16] leading-tight">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(product.id)}
                            className="text-xs text-[#1e1a16]/40 hover:text-[#c88a2b] transition-colors ml-2"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="font-sans text-sm text-[#1e1a16]/70 mt-1">
                          ₹{product.price}
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-[#1e1a16]/20 rounded-full px-2 py-0.5 bg-white/50">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="px-2 text-sm text-[#1e1a16] hover:opacity-60 font-mono"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono font-medium">{quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="px-2 text-sm text-[#1e1a16] hover:opacity-60 font-mono"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-sans text-sm font-medium text-[#1e1a16] ml-auto">
                          ₹{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#1e1a16]/10 bg-[#f7f2e7] space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-sm text-[#1e1a16]/70">Subtotal</span>
                  <span className="font-serif text-2xl font-semibold text-[#1e1a16]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#1e1a16]/60">
                  Taxes and shipping calculated at checkout.
                </p>
                <button
                  onClick={() => (onCheckout ? onCheckout() : openWhatsAppOrder(items))}
                  className="w-full py-4 rounded-full bg-[#1e1a16] text-white font-sans text-base font-medium hover:bg-[#332c25] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, OilDropIcon } from './Icons';
import { Product } from '../data/content';
import { openWhatsAppOrder } from '../utils/whatsapp';
import {
  CustomerInfo,
  loadRazorpayScript,
  createServerOrder,
  verifyServerPayment,
} from '../utils/payment';

export interface CartItem {
  id: string; // unique item id: e.g. `${product.id}-${size}`
  product: Product;
  size: string;
  unitPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart?: () => void;
  onCheckout?: () => void;
}

type DrawerStep = 'cart' | 'checkout' | 'success' | 'failure';

const INDIAN_STATES = [
  'Tamil Nadu',
  'Karnataka',
  'Kerala',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Delhi',
  'Gujarat',
  'West Bengal',
  'Rajasthan',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Bihar',
  'Odisha',
  'Goa',
  'Assam',
  'Other',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [paymentResult, setPaymentResult] = useState<{
    orderId?: string;
    paymentId?: string;
    amount?: number;
    error?: string;
  }>({});

  const isTamilNadu = (stateName?: string): boolean => {
    if (!stateName) return false;
    const normalized = stateName.trim().toLowerCase().replace(/[^a-z]/g, '');
    return normalized === 'tamilnadu' || normalized === 'tn';
  };

  const getShippingFee = (orderSubtotal: number, stateName?: string): number => {
    if (orderSubtotal >= 1000) return 0;
    return isTamilNadu(stateName) ? 50 : 100;
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = 1000;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const shippingFee = getShippingFee(subtotal, customer.state);
  const finalPayableTotal = subtotal + shippingFee;

  // Reset step to 'cart' when drawer reopens, unless payment is successful
  useEffect(() => {
    if (isOpen) {
      if (step === 'success') {
        setStep('cart');
      }
      setErrorMessage('');
    }
  }, [isOpen]);

  // Handle ESC key to dismiss drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateFields = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customer.name.trim() || customer.name.trim().length < 2) {
      errors.name = 'Full Name is required (minimum 2 characters).';
    }

    const cleanPhone = customer.phone.trim().replace(/\D/g, '');
    const phoneTen = cleanPhone.startsWith('91') && cleanPhone.length === 12 ? cleanPhone.slice(2) : cleanPhone;
    if (!/^[6-9]\d{9}$/.test(phoneTen)) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!customer.address.trim() || customer.address.trim().length < 5) {
      errors.address = 'Please enter complete delivery address (min 5 characters).';
    }

    if (!customer.city.trim() || customer.city.trim().length < 2) {
      errors.city = 'City is required.';
    }

    if (!customer.state.trim()) {
      errors.state = 'State is required.';
    }

    if (!/^\d{6}$/.test(customer.pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit PIN code.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (items.length === 0) {
      setErrorMessage('Your cart is empty. Please select products first.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded && !(window as any).Razorpay) {
        setIsProcessing(false);
        setErrorMessage('Unable to load payment gateway. Please check your internet connection and retry.');
        return;
      }

      // 2. Request backend to validate cart and create Razorpay order
      const orderRes = await createServerOrder(customer, items);

      if (!orderRes.success || !orderRes.orderId) {
        setIsProcessing(false);
        setErrorMessage(orderRes.error || 'Failed to create order with payment server.');
        return;
      }

      // 3. Configure Razorpay Standard Checkout options
      const options: any = {
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency || 'INR',
        name: 'Himalayan Harvest Honey',
        description: 'Himalayan Harvest Honey — Order Payment',
        image: '/images/hero_honey_jar.jpg',
        order_id: orderRes.orderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          delivery_address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
          total_items: String(items.length),
        },
        theme: {
          color: '#242424',
        },
        modal: {
          ondismiss: () => {
            // Customer closed checkout modal without completing payment
            // Return safely to checkout view, keep all cart items intact
            setIsProcessing(false);
          },
        },
        handler: async (response: any) => {
          try {
            setIsProcessing(true);

            // 4. Server-Side Signature Verification
            const verifyRes = await verifyServerPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.verified && verifyRes.paymentStatus === 'paid') {
              // 5. Payment verified! Clear cart and show Success Screen
              if (onClearCart) {
                onClearCart();
              }
              setPaymentResult({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: Math.round((orderRes.amount || 0) / 100),
              });
              setStep('success');
            } else {
              setPaymentResult({
                error: verifyRes.error || 'Payment signature verification failed.',
              });
              setStep('failure');
            }
          } catch (err: any) {
            setPaymentResult({
              error: err?.message || 'Verification error encountered.',
            });
            setStep('failure');
          } finally {
            setIsProcessing(false);
          }
        },
      };

      // 5. Launch Razorpay Standard Checkout
      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (failRes: any) => {
        setIsProcessing(false);
        setPaymentResult({
          error: failRes?.error?.description || 'Your payment was declined by the bank.',
        });
        setStep('failure');
      });

      rzp.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err?.message || 'An unexpected error occurred. Your cart has been preserved.');
    }
  };

  const handleSuccessClose = () => {
    setStep('cart');
    onClose();
  };

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
            className="fixed inset-0 bg-[#242424]/50 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Your Cart"
            className="relative w-full max-w-[460px] h-full bg-[#FAF9F5] shadow-2xl flex flex-col z-10 border-l border-[#D9D7D0]"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#D9D7D0] flex items-center justify-between bg-white/80 backdrop-blur-xs">
              <div className="flex items-center space-x-2.5">
                {step === 'checkout' && (
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="mr-1 p-1 text-[#242424] hover:bg-[#242424]/10 rounded-full transition-colors cursor-pointer"
                    aria-label="Back to cart"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <h3 className="font-serif text-[20px] sm:text-[22px] font-semibold text-[#242424]">
                  {step === 'cart' && 'Your Cart'}
                  {step === 'checkout' && 'Checkout & Delivery'}
                  {step === 'success' && 'Order Confirmed'}
                  {step === 'failure' && 'Payment Notice'}
                </h3>
                {step === 'cart' && (
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#242424] text-[#FAF9F5] font-medium">
                    {totalItemCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#242424] hover:bg-[#242424]/5 rounded-full transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            {/* ======================================================= */}
            {/* STEP 1: CART ITEMS VIEW                                 */}
            {/* ======================================================= */}
            {step === 'cart' && (
              <>
                {/* Free Shipping Meter */}
                <div className="px-6 py-3 bg-[#C9892E]/10 border-b border-[#C9892E]/25">
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5 text-[#242424]">
                    <span className="flex items-center gap-1.5">
                      <OilDropIcon size={12} color="#C9892E" />
                      {subtotal >= 1000 ? (
                        <span className="font-bold text-[#C9892E]">FREE SHIPPING</span>
                      ) : (
                        <span>Add ₹{freeShippingRemaining.toFixed(0)} more for free shipping</span>
                      )}
                    </span>
                    <span className="font-semibold text-[#242424]">{freeShippingPercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#D9D7D0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C9892E] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>

                {/* Cart Items or Empty State */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                      <div className="w-16 h-16 rounded-full bg-[#242424]/5 flex items-center justify-center">
                        <OilDropIcon size={32} color="#242424" />
                      </div>
                      <h4 className="font-serif text-2xl text-[#242424]">Your cart is empty</h4>
                      <p className="font-sans text-sm text-[#686863] max-w-[260px]">
                        Pure Himalayan honey is waiting. Discover our single-origin mountain harvests.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-4 px-6 py-3 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-sm font-bold transition-colors cursor-pointer"
                      >
                        Explore The Collection
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-3.5 p-3.5 rounded-[12px] bg-white border border-[#D9D7D0] shadow-2xs"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.alt}
                          className="w-16 h-20 object-cover rounded-[8px] bg-[#F4F1EA] flex-shrink-0"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-serif text-[15px] sm:text-[16px] font-medium text-[#242424] leading-tight">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-xs text-[#242424]/40 hover:text-[#C9892E] transition-colors p-0.5 cursor-pointer"
                                aria-label={`Remove ${item.product.name} (${item.size})`}
                              >
                                Remove
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#F4F1EA] text-[#242424] font-semibold">
                                {item.size}
                              </span>
                              <span className="font-sans text-xs text-[#242424]/60">
                                ₹{item.unitPrice} each
                              </span>
                            </div>
                          </div>

                          {/* Quantity Selector & Line Total */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#D9D7D0]/40">
                            <div className="flex items-center border border-[#D9D7D0] rounded-full px-2 py-0.5 bg-[#FAF9F5]">
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-4 h-4 flex items-center justify-center text-xs text-[#242424] hover:opacity-60 font-mono cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="px-2 text-xs font-mono font-medium text-[#242424] select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-4 h-4 flex items-center justify-center text-xs text-[#242424] hover:opacity-60 font-mono cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-sans text-[15px] font-bold text-[#242424]">
                              ₹{item.unitPrice * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Drawer Footer */}
                {items.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-[#D9D7D0] bg-white/80 backdrop-blur-xs space-y-2.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-sans text-sm text-[#242424]/70">Subtotal</span>
                      <span className="font-serif text-2xl font-semibold text-[#242424]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#242424]/60">
                      {subtotal >= 1000
                        ? 'Free delivery applied. Direct payment via Razorpay.'
                        : 'Delivery by state calculated at checkout. Free over ₹1,000.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="w-full py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Checkout</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => openWhatsAppOrder(items)}
                        className="text-xs text-[#242424] hover:text-[#C9892E] font-sans font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Or Order via WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-xs text-[#242424]/60 hover:text-[#242424] font-sans transition-colors cursor-pointer"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ======================================================= */}
            {/* STEP 2: GUEST CHECKOUT DETAILS FORM                     */}
            {/* ======================================================= */}
            {step === 'checkout' && (
              <form onSubmit={handleProceedToPayment} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Order Summary Breakdown Card */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#D9D7D0] space-y-2 text-xs shadow-2xs">
                    <div className="flex justify-between items-center text-[#686863]">
                      <span>Order Subtotal</span>
                      <span className="font-mono font-medium text-[#242424]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#686863]">
                      <span>Shipping ({customer.state || 'Tamil Nadu'})</span>
                      {shippingFee === 0 ? (
                        <span className="font-mono font-bold text-[#242424] bg-[#C9892E]/20 px-2 py-0.5 rounded">
                          FREE
                        </span>
                      ) : (
                        <span className="font-mono font-semibold text-[#242424]">
                          ₹{shippingFee}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-[#D9D7D0]/60 pt-2 flex justify-between items-baseline">
                      <span className="font-sans font-semibold text-[#242424]">Total</span>
                      <span className="font-serif text-lg font-bold text-[#242424]">
                        ₹{finalPayableTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-serif text-[15px] font-semibold text-[#242424] flex items-center gap-1.5">
                      <span>Delivery Information</span>
                      <span className="text-[11px] font-sans font-normal text-[#686863]">(Guest Checkout)</span>
                    </h4>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#242424] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Kavitha Raman"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                          validationErrors.name ? 'border-red-500' : 'border-[#D9D7D0]'
                        }`}
                      />
                      {validationErrors.name && (
                        <span className="text-[11px] text-red-600 mt-0.5 block">{validationErrors.name}</span>
                      )}
                    </div>

                    {/* Mobile Number & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#242424] mb-1">
                          Mobile Number *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-[#686863] font-mono select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={customer.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="9876543210"
                            className={`w-full pl-10 pr-3 py-2.5 rounded-lg bg-white border text-sm text-[#242424] font-mono placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                              validationErrors.phone ? 'border-red-500' : 'border-[#D9D7D0]'
                            }`}
                          />
                        </div>
                        {validationErrors.phone && (
                          <span className="text-[11px] text-red-600 mt-0.5 block">{validationErrors.phone}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-[#242424] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={customer.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="name@domain.com"
                          className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                            validationErrors.email ? 'border-red-500' : 'border-[#D9D7D0]'
                          }`}
                        />
                        {validationErrors.email && (
                          <span className="text-[11px] text-red-600 mt-0.5 block">{validationErrors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#242424] mb-1">
                        Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={customer.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="House / Flat No., Building, Street Name, Area"
                        className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all resize-none ${
                          validationErrors.address ? 'border-red-500' : 'border-[#D9D7D0]'
                        }`}
                      />
                      {validationErrors.address && (
                        <span className="text-[11px] text-red-600 mt-0.5 block">{validationErrors.address}</span>
                      )}
                    </div>

                    {/* City, State & PIN Code */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <div>
                        <label className="block text-[11px] font-sans font-medium text-[#242424] mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={customer.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Chennai"
                          className={`w-full px-2.5 py-2.5 rounded-lg bg-white border text-xs sm:text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                            validationErrors.city ? 'border-red-500' : 'border-[#D9D7D0]'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans font-medium text-[#242424] mb-1">
                          State *
                        </label>
                        <select
                          value={customer.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className="w-full px-2 py-2.5 rounded-lg bg-white border border-[#D9D7D0] text-xs sm:text-sm text-[#242424] focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-sans font-medium text-[#242424] mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={customer.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          placeholder="600001"
                          className={`w-full px-2.5 py-2.5 rounded-lg bg-white border text-xs sm:text-sm text-[#242424] font-mono placeholder-[#686863]/50 focus:outline-none focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                            validationErrors.pincode ? 'border-red-500' : 'border-[#D9D7D0]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Protection Callout */}
                  <div className="p-3 bg-[#242424]/5 rounded-xl border border-[#242424]/10 flex items-start gap-2 text-[11px] text-[#242424]">
                    <svg className="w-4 h-4 text-[#C9892E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>
                      Official Razorpay Secure Checkout. Supports UPI (GPay, PhonePe, Paytm), NetBanking, Credit/Debit Cards.
                    </span>
                  </div>
                </div>

                {/* Checkout Footer Action */}
                <div className="p-4 sm:p-5 border-t border-[#D9D7D0] bg-white/80 backdrop-blur-xs space-y-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#242424]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connecting to Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <span>Proceed to Payment</span>
                        <span className="font-mono">₹{finalPayableTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-1 text-center text-xs font-sans text-[#242424]/60 hover:text-[#242424] transition-colors cursor-pointer"
                  >
                    ← Back to Cart
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================= */}
            {/* STEP 3: PAYMENT SUCCESS SCREEN (Exact Specification)    */}
            {/* ======================================================= */}
            {step === 'success' && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF9F5] text-center overflow-y-auto">
                <div className="my-auto py-8 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#242424] text-[#DDAA55] flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-xs text-[#C9892E] uppercase tracking-widest font-semibold block">
                      Himalayan Harvest Honey
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#242424] tracking-tight">
                      PAYMENT SUCCESSFUL
                    </h2>
                    <p className="font-sans text-sm text-[#242424]/80 max-w-[320px] mx-auto">
                      Thank you for your order with Himalayan Harvest Honey.
                    </p>
                    <p className="font-sans text-xs text-[#686863]">
                      Your payment has been received successfully.
                    </p>
                  </div>

                  {/* Order Details Receipt Box */}
                  <div className="p-4 rounded-xl bg-white border border-[#D9D7D0] text-left space-y-2 font-mono text-xs max-w-[340px] mx-auto shadow-xs">
                    <div className="flex justify-between border-b border-[#D9D7D0]/40 pb-2">
                      <span className="text-[#686863]">Order ID:</span>
                      <span className="font-semibold text-[#242424] break-all">{paymentResult.orderId || 'CONFIRMED'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#D9D7D0]/40 pb-2">
                      <span className="text-[#686863]">Payment ID:</span>
                      <span className="font-semibold text-[#242424] break-all">{paymentResult.paymentId || 'VERIFIED'}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-sans font-bold">
                      <span className="text-[#242424]">Amount Paid:</span>
                      <span className="text-[#242424]">₹{paymentResult.amount || finalPayableTotal}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#242424] font-medium">
                    Your order is now being processed.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9D7D0]">
                  <button
                    type="button"
                    onClick={handleSuccessClose}
                    className="w-full py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STEP 4: PAYMENT FAILURE SCREEN (Exact Specification)    */}
            {/* ======================================================= */}
            {step === 'failure' && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF9F5] text-center overflow-y-auto">
                <div className="my-auto py-8 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-xs text-[#C9892E] uppercase tracking-widest font-semibold block">
                      Himalayan Harvest Honey
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-red-800 tracking-tight">
                      PAYMENT NOT COMPLETED
                    </h2>
                    <p className="font-sans text-sm text-[#242424]/80 max-w-[300px] mx-auto">
                      Your payment could not be completed.
                    </p>
                    <p className="font-sans text-xs text-[#242424] font-medium bg-[#242424]/5 py-2 px-3 rounded-lg max-w-[320px] mx-auto">
                      Your cart has been preserved. You can try again.
                    </p>
                    {paymentResult.error && (
                      <p className="font-mono text-[11px] text-red-700 bg-red-50 p-2 rounded max-w-[320px] mx-auto border border-red-200">
                        {paymentResult.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D9D7D0] space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all shadow-sm cursor-pointer"
                  >
                    Try Payment Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-2.5 rounded-full border border-[#242424] text-[#242424] hover:bg-[#242424]/5 font-sans text-sm font-medium transition-all cursor-pointer"
                  >
                    Return to Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

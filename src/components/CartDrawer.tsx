import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  onNavigate?: (path: string) => void;
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
  onNavigate,
}) => {
  const [step, setStep] = useState<DrawerStep>('cart');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const shouldReduceMotion = useReducedMotion();

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
      // 1. Ensure Razorpay script is loaded
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

  const handleExploreShop = () => {
    onClose();
    if (onNavigate) {
      onNavigate('/shop');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop';
    }
  };

  const handleSuccessClose = () => {
    setStep('cart');
    onClose();
    if (onNavigate) {
      onNavigate('/shop');
    }
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
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-[#242424]/60 backdrop-blur-xs cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              duration: shouldReduceMotion ? 0.15 : 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Your Cart"
            className="relative w-full max-w-full sm:max-w-[460px] md:max-w-[480px] lg:max-w-[500px] h-full bg-[#F4F1EA] shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col z-10 border-l border-[#D9D7D0] overflow-hidden"
          >
            {/* ======================================================= */}
            {/* 1. HEADER                                               */}
            {/* ======================================================= */}
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-[#D9D7D0] bg-[#FAF9F5] flex items-center justify-between z-20">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2.5">
                  {step === 'checkout' && (
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="mr-1 p-1.5 text-[#242424] hover:bg-[#242424]/5 rounded-full transition-colors cursor-pointer"
                      aria-label="Back to cart review"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h2 className="font-serif text-[20px] sm:text-[23px] font-bold text-[#242424] uppercase tracking-[-0.01em]">
                    {step === 'cart' && 'YOUR CART'}
                    {step === 'checkout' && 'CHECKOUT'}
                    {step === 'success' && 'ORDER CONFIRMED'}
                    {step === 'failure' && 'PAYMENT NOTICE'}
                  </h2>
                  {step === 'cart' && totalItemCount > 0 && (
                    <span className="font-mono text-[11px] sm:text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#242424] text-[#FAF9F5]">
                      {totalItemCount}
                    </span>
                  )}
                </div>
                <p className="font-sans text-[12px] sm:text-[13px] text-[#686863]">
                  {step === 'cart' && 'Review your selection before checkout.'}
                  {step === 'checkout' && 'Enter your delivery details to complete payment.'}
                  {step === 'success' && 'Your order has been received and confirmed.'}
                  {step === 'failure' && 'Review details and retry payment.'}
                </p>
              </div>

              {/* Minimal Elegant Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9D7D0] bg-white hover:bg-[#FAF9F5] hover:border-[#242424]/40 flex items-center justify-center text-[#242424] transition-all cursor-pointer shadow-2xs"
                aria-label="Close cart"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* ======================================================= */}
            {/* STEP 1: CART VIEW                                       */}
            {/* ======================================================= */}
            {step === 'cart' && (
              <>
                {/* 2. SHIPPING PROGRESS */}
                {items.length > 0 && (
                  <div className="px-5 sm:px-6 py-3.5 bg-[#FAF9F5] border-b border-[#D9D7D0]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#C9892E]" />
                        <span className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-wider font-bold text-[#242424]">
                          FREE SHIPPING
                        </span>
                      </div>
                      <span className="font-sans text-[12px] font-medium text-[#686863]">
                        {subtotal >= freeShippingThreshold ? (
                          <span className="font-bold text-[#C9892E]">Free shipping applied!</span>
                        ) : (
                          <span>Add ₹{freeShippingRemaining.toFixed(0)} more for free shipping</span>
                        )}
                      </span>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-[#D9D7D0]/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#C9892E] transition-all duration-500 ease-out"
                        style={{ width: `${freeShippingPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 3 & 4. PRODUCT LIST OR EMPTY STATE */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-3.5">
                  {items.length === 0 ? (
                    /* 5. EMPTY CART STATE */
                    <div className="h-full flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 space-y-5">
                      <div className="w-16 h-16 rounded-full bg-[#C9892E]/10 border border-[#C9892E]/30 flex items-center justify-center text-[#C9892E] shadow-2xs">
                        <OilDropIcon size={30} color="#C9892E" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#242424] tracking-tight uppercase">
                          YOUR CART IS EMPTY
                        </h3>
                        <p className="font-sans text-[14px] text-[#686863] max-w-[280px] mx-auto leading-relaxed">
                          Discover pure honey from the Himalayas.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExploreShop}
                        className="mt-2 px-8 py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[13.5px] font-bold tracking-wider uppercase transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
                      >
                        EXPLORE HONEY
                      </button>
                    </div>
                  ) : (
                    /* 3. PRODUCT CARDS */
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout={!shouldReduceMotion}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-white rounded-[16px] border border-[#D9D7D0] p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(36,36,36,0.03)] hover:border-[#C9892E]/50 transition-colors"
                      >
                        <div className="flex gap-3.5 sm:gap-4 items-center">
                          {/* Product Image */}
                          <div className="w-[84px] h-[84px] sm:w-[94px] sm:h-[94px] rounded-[12px] bg-[#FAF9F5] border border-[#D9D7D0]/60 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img
                              src={item.product.image}
                              alt={item.product.alt || `${item.product.name} jar`}
                              className="w-full h-full object-contain select-none"
                              loading="lazy"
                            />
                          </div>

                          {/* Product Information */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-serif text-[16px] sm:text-[17px] font-semibold text-[#242424] truncate leading-tight">
                                  {item.product.name}
                                </h4>
                                <span className="font-sans text-[15px] sm:text-[16px] font-bold text-[#242424] whitespace-nowrap">
                                  ₹{item.unitPrice * item.quantity}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F4F1EA] text-[#242424] border border-[#D9D7D0]/60">
                                  {item.size}
                                </span>
                                <span className="font-sans text-[12px] text-[#686863]">
                                  ₹{item.unitPrice} each
                                </span>
                              </div>
                            </div>

                            {/* Quantity Control & Remove */}
                            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-[#D9D7D0]/50">
                              <div className="inline-flex items-center border border-[#D9D7D0] rounded-full bg-[#FAF9F5] px-1 py-0.5">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#242424] hover:bg-[#242424]/10 transition-colors font-mono text-xs cursor-pointer"
                                  aria-label={`Decrease quantity of ${item.product.name}`}
                                >
                                  −
                                </button>
                                <span className="px-2.5 font-mono text-[12px] sm:text-[13px] font-bold text-[#242424] select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#242424] hover:bg-[#242424]/10 transition-colors font-mono text-xs cursor-pointer"
                                  aria-label={`Increase quantity of ${item.product.name}`}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="font-sans text-[12px] text-[#686863] hover:text-red-700 hover:underline transition-colors p-1 cursor-pointer"
                                aria-label={`Remove ${item.product.name} (${item.size})`}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* 6. ORDER SUMMARY & ACTIONS */}
                {items.length > 0 && (
                  <div className="p-5 sm:p-6 border-t border-[#D9D7D0] bg-[#FAF9F5] space-y-4">
                    {/* Order Summary Table */}
                    <div className="space-y-2 text-[13.5px] sm:text-[14px]">
                      <div className="flex justify-between items-center text-[#686863]">
                        <span className="font-sans">Subtotal</span>
                        <span className="font-mono font-medium text-[#242424]">
                          ₹{subtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[#686863]">
                        <span className="font-sans">Shipping</span>
                        {subtotal >= freeShippingThreshold ? (
                          <span className="font-mono text-[11px] font-bold tracking-wider text-[#C9892E] bg-[#C9892E]/15 px-2 py-0.5 rounded-full uppercase">
                            FREE
                          </span>
                        ) : (
                          <span className="font-mono font-medium text-[#242424]">
                            ₹{shippingFee}
                          </span>
                        )}
                      </div>

                      <div className="border-t border-[#D9D7D0] pt-2.5 flex justify-between items-baseline">
                        <span className="font-serif text-[16px] sm:text-[17px] font-bold text-[#242424] uppercase tracking-wide">
                          TOTAL
                        </span>
                        <span className="font-serif text-[22px] sm:text-[24px] font-bold text-[#242424]">
                          ₹{finalPayableTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* 7. PRIMARY CTA */}
                    <button
                      type="button"
                      onClick={() => setStep('checkout')}
                      className="w-full py-4 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide uppercase transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <span>→</span>
                    </button>

                    {/* 8. WHATSAPP OPTION */}
                    <button
                      type="button"
                      onClick={() => openWhatsAppOrder(items)}
                      className="w-full py-3 rounded-full border border-[#D9D7D0] bg-white hover:bg-[#FAF9F5] hover:border-[#C9892E] text-[#242424] font-sans text-[13px] sm:text-[13.5px] font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                      <span>OR ORDER VIA WHATSAPP</span>
                    </button>

                    {/* 9. CONTINUE SHOPPING */}
                    <button
                      type="button"
                      onClick={handleExploreShop}
                      className="w-full text-center text-xs font-mono uppercase tracking-wider text-[#686863] hover:text-[#242424] transition-colors pt-1 cursor-pointer"
                    >
                      ← CONTINUE SHOPPING
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ======================================================= */}
            {/* STEP 2: GUEST CHECKOUT DETAILS FORM                     */}
            {/* ======================================================= */}
            {step === 'checkout' && (
              <form onSubmit={handleProceedToPayment} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
                  {/* Order Summary Breakdown Card */}
                  <div className="p-4 bg-white rounded-[16px] border border-[#D9D7D0] space-y-2 text-xs shadow-2xs">
                    <div className="flex justify-between items-center text-[#686863]">
                      <span className="font-sans">Order Subtotal</span>
                      <span className="font-mono font-medium text-[#242424]">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#686863]">
                      <span className="font-sans">Shipping ({customer.state || 'Tamil Nadu'})</span>
                      {shippingFee === 0 ? (
                        <span className="font-mono font-bold text-[#C9892E] bg-[#C9892E]/15 px-2 py-0.5 rounded-full uppercase">
                          FREE
                        </span>
                      ) : (
                        <span className="font-mono font-semibold text-[#242424]">
                          ₹{shippingFee}
                        </span>
                      )}
                    </div>
                    <div className="border-t border-[#D9D7D0] pt-2 flex justify-between items-baseline">
                      <span className="font-serif font-bold text-[14px] text-[#242424] uppercase tracking-wide">Total</span>
                      <span className="font-serif text-[19px] font-bold text-[#242424]">
                        ₹{finalPayableTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-[12px] bg-red-50 border border-red-200 text-xs text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div className="space-y-3 pt-1">
                    <h4 className="font-serif text-[16px] font-semibold text-[#242424] flex items-center gap-1.5">
                      <span>Delivery Information</span>
                      <span className="text-[11.5px] font-sans font-normal text-[#686863]">(Guest Checkout)</span>
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
                        className={`w-full px-3.5 py-2.5 rounded-[10px] bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
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
                            className={`w-full pl-10 pr-3 py-2.5 rounded-[10px] bg-white border text-sm text-[#242424] font-mono placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
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
                          className={`w-full px-3.5 py-2.5 rounded-[10px] bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
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
                        className={`w-full px-3.5 py-2.5 rounded-[10px] bg-white border text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all resize-none ${
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
                          className={`w-full px-2.5 py-2.5 rounded-[10px] bg-white border text-xs sm:text-sm text-[#242424] placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
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
                          className="w-full px-2 py-2.5 rounded-[10px] bg-white border border-[#D9D7D0] text-xs sm:text-sm text-[#242424] focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all cursor-pointer"
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
                          className={`w-full px-2.5 py-2.5 rounded-[10px] bg-white border text-xs sm:text-sm text-[#242424] font-mono placeholder-[#686863]/50 focus:outline-hidden focus:ring-2 focus:ring-[#C9892E]/40 transition-all ${
                            validationErrors.pincode ? 'border-red-500' : 'border-[#D9D7D0]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Protection Callout */}
                  <div className="p-3 bg-white rounded-[12px] border border-[#D9D7D0] flex items-start gap-2.5 text-[11px] text-[#242424]">
                    <svg className="w-4 h-4 text-[#C9892E] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="leading-snug">
                      Official Razorpay Secure Checkout. Supports UPI (Google Pay, PhonePe, Paytm), NetBanking, and all major Credit/Debit Cards.
                    </span>
                  </div>
                </div>

                {/* Checkout Footer Action */}
                <div className="p-5 sm:p-6 border-t border-[#D9D7D0] bg-[#FAF9F5] space-y-3">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#242424]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>CONNECTING TO RAZORPAY...</span>
                      </>
                    ) : (
                      <>
                        <span>PROCEED TO PAYMENT</span>
                        <span className="font-mono">₹{finalPayableTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full text-center text-xs font-mono uppercase tracking-wider text-[#686863] hover:text-[#242424] transition-colors cursor-pointer"
                  >
                    ← BACK TO CART
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================= */}
            {/* STEP 3: PAYMENT SUCCESS SCREEN                          */}
            {/* ======================================================= */}
            {step === 'success' && (
              <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-[#FAF9F5] text-center overflow-y-auto">
                <div className="my-auto py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#242424] text-[#DDAA55] flex items-center justify-center mx-auto shadow-md">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] text-[#C9892E] uppercase tracking-widest font-bold block">
                      HIMALAYAN HARVEST HONEY
                    </span>
                    <h3 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#242424] tracking-tight uppercase">
                      PAYMENT SUCCESSFUL
                    </h3>
                    <p className="font-sans text-sm text-[#242424]/80 max-w-[320px] mx-auto">
                      Thank you for your order with Himalayan Harvest Honey.
                    </p>
                    <p className="font-sans text-xs text-[#686863]">
                      Your payment has been received successfully.
                    </p>
                  </div>

                  {/* Order Details Receipt Box */}
                  <div className="p-4 rounded-[16px] bg-white border border-[#D9D7D0] text-left space-y-2.5 font-mono text-xs max-w-[340px] mx-auto shadow-xs">
                    <div className="flex justify-between border-b border-[#D9D7D0]/60 pb-2">
                      <span className="text-[#686863]">Order ID:</span>
                      <span className="font-semibold text-[#242424] break-all">{paymentResult.orderId || 'CONFIRMED'}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#D9D7D0]/60 pb-2">
                      <span className="text-[#686863]">Payment ID:</span>
                      <span className="font-semibold text-[#242424] break-all">{paymentResult.paymentId || 'VERIFIED'}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-sans font-bold">
                      <span className="text-[#242424]">Amount Paid:</span>
                      <span className="text-[#242424]">₹{paymentResult.amount || finalPayableTotal}</span>
                    </div>
                  </div>

                  <p className="font-sans text-xs text-[#242424] font-medium">
                    Your harvest is now being prepared for dispatch.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D9D7D0]">
                  <button
                    type="button"
                    onClick={handleSuccessClose}
                    className="w-full py-4 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================= */}
            {/* STEP 4: PAYMENT FAILURE SCREEN                          */}
            {/* ======================================================= */}
            {step === 'failure' && (
              <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-[#FAF9F5] text-center overflow-y-auto">
                <div className="my-auto py-8 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-xs">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[11px] text-[#C9892E] uppercase tracking-widest font-bold block">
                      HIMALAYAN HARVEST HONEY
                    </span>
                    <h3 className="font-serif text-[24px] sm:text-[26px] font-bold text-red-800 tracking-tight uppercase">
                      PAYMENT NOT COMPLETED
                    </h3>
                    <p className="font-sans text-sm text-[#242424]/80 max-w-[300px] mx-auto">
                      Your payment could not be completed.
                    </p>
                    <p className="font-sans text-xs text-[#242424] font-medium bg-[#242424]/5 py-2 px-3 rounded-lg max-w-[320px] mx-auto">
                      Your cart has been preserved. You can try again.
                    </p>
                    {paymentResult.error && (
                      <p className="font-mono text-[11px] text-red-700 bg-red-50 p-2.5 rounded-[10px] max-w-[320px] mx-auto border border-red-200">
                        {paymentResult.error}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D9D7D0] space-y-3">
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-4 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    TRY PAYMENT AGAIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-full py-3 rounded-full border border-[#242424] text-[#242424] hover:bg-[#242424]/5 font-sans text-[13px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                  >
                    RETURN TO CART
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

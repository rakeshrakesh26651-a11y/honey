import React, { useState, useEffect } from 'react';
import { Product } from '../data/content';
import { openWhatsAppOrder } from '../utils/whatsapp';
import {
  CustomerInfo,
  loadRazorpayScript,
  createServerOrder,
  verifyServerPayment,
} from '../utils/payment';
import { useShippingSettings } from '../hooks/useShippingSettings';

export interface CartItem {
  id: string; // unique item id: e.g. `${product.id}-${size}`
  product: Product;
  size: string;
  unitPrice: number;
  quantity: number;
}

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart?: () => void;
  onNavigate: (path: string) => void;
}

type CheckoutStep = 'cart' | 'checkout' | 'success' | 'failure';

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

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigate,
}) => {
  const [step, setStep] = useState<CheckoutStep>(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/checkout') {
      return 'checkout';
    }
    return 'cart';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/checkout' && items.length > 0) {
      setStep('checkout');
    }
  }, [items.length]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
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

  const { settings: shippingSettings, calculateShippingFee } = useShippingSettings();

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingThreshold = shippingSettings.freeShippingThreshold;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = freeShippingThreshold > 0
    ? Math.min(100, (subtotal / freeShippingThreshold) * 100)
    : 100;

  const shippingFee = calculateShippingFee(subtotal, customer.state);
  const discountAmount = Math.round(subtotal * (couponDiscount / 100));
  const finalPayableTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponMessage({ text: 'Please enter a coupon code.', isError: true });
      return;
    }
    if (clean === 'WELCOME10' || clean === 'PUREHONEY10' || clean === 'HONEY10') {
      setCouponDiscount(10);
      setCouponMessage({ text: `Coupon "${clean}" applied! 10% discount added.`, isError: false });
    } else {
      setCouponMessage({ text: `Invalid coupon code "${clean}".`, isError: true });
      setCouponDiscount(0);
    }
  };

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
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded && !(window as any).Razorpay) {
        setIsProcessing(false);
        setErrorMessage('Unable to load payment gateway. Please check your internet connection and retry.');
        return;
      }

      const orderRes = await createServerOrder(customer, items);

      if (!orderRes.success || !orderRes.orderId) {
        setIsProcessing(false);
        setErrorMessage(orderRes.error || 'Failed to create order with payment server.');
        return;
      }

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
          shipping_address: customer.address,
          shipping_city: customer.city,
          shipping_state: customer.state,
          shipping_pincode: customer.pincode,
          items_summary: items.map((i) => `${i.product.name} (${i.size}) x${i.quantity}`).join(', '),
        },
        theme: {
          color: '#C9892E',
        },
        handler: async (response: any) => {
          setIsProcessing(true);
          try {
            const verifyRes = await verifyServerPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setPaymentResult({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount: finalPayableTotal,
              });
              if (onClearCart) onClearCart();
              setStep('success');
            } else {
              setPaymentResult({
                orderId: response.razorpay_order_id,
                error: verifyRes.error || 'Payment verification failed on server.',
              });
              setStep('failure');
            }
          } catch (verErr: any) {
            setPaymentResult({
              orderId: response.razorpay_order_id,
              error: verErr.message || 'Payment verification failed.',
            });
            setStep('failure');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', (failResponse: any) => {
        setIsProcessing(false);
        setPaymentResult({
          orderId: orderRes.orderId,
          paymentId: failResponse.error?.metadata?.payment_id,
          error: failResponse.error?.description || 'Payment was declined or cancelled.',
        });
        setStep('failure');
      });

      razorpayInstance.open();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'An unexpected error occurred while starting checkout.');
    }
  };

  // ---------------------------------------------------------------------------
  // EMPTY CART STATE
  // ---------------------------------------------------------------------------
  if (items.length === 0 && step !== 'success') {
    return (
      <div className="w-full bg-[#F4F1EA] py-10 sm:py-24 px-3.5 sm:px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C9892E]" />
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#686863] font-semibold">
              YOUR CART
            </span>
          </div>

          <h1 className="font-serif text-[32px] sm:text-[54px] lg:text-[64px] text-[#242424] font-normal tracking-[-0.02em] mb-3">
            Your selection is ready.
          </h1>

          <p className="font-sans text-[15px] sm:text-[17px] text-[#686863] max-w-[500px] mx-auto mb-8">
            Review your selection before checkout.
          </p>

          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-6 sm:p-12 max-w-[560px] mx-auto shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#F4F1EA] border border-[#D9D7D0] flex items-center justify-center text-[#C9892E] mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>

            <h3 className="font-serif text-[24px] font-medium text-[#242424] mb-2">
              YOUR CART IS EMPTY
            </h3>

            <p className="font-sans text-[15px] text-[#686863] mb-8">
              Discover pure honey from the Himalayas.
            </p>

            <button
              onClick={() => onNavigate('/shop')}
              className="inline-flex items-center justify-center h-[50px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all transform hover:-translate-y-0.5 shadow-sm cursor-pointer"
            >
              EXPLORE HONEY →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // PAYMENT SUCCESS STATE
  // ---------------------------------------------------------------------------
  if (step === 'success') {
    return (
      <div className="w-full bg-[#F4F1EA] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-[620px] mx-auto bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-8 sm:p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#C9892E]/15 border border-[#C9892E]/30 flex items-center justify-center mx-auto mb-6 text-[#C9892E]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2 className="font-serif text-[32px] text-[#242424] font-normal tracking-[-0.01em] mb-2">
            Order Confirmed!
          </h2>
          <p className="font-sans text-[16px] text-[#686863] mb-6">
            Thank you for ordering with Himalayan Harvest Honey. We are preparing your pure harvest jars with care.
          </p>

          <div className="bg-white border border-[#D9D7D0] rounded-xl p-5 mb-8 text-left space-y-2 font-mono text-[13px] text-[#242424]">
            {paymentResult.orderId && (
              <div className="flex justify-between">
                <span className="text-[#686863]">Order ID:</span>
                <span className="font-semibold">{paymentResult.orderId}</span>
              </div>
            )}
            {paymentResult.paymentId && (
              <div className="flex justify-between">
                <span className="text-[#686863]">Payment ID:</span>
                <span className="font-semibold">{paymentResult.paymentId}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-[#D9D7D0]">
              <span className="text-[#686863]">Total Paid:</span>
              <span className="font-semibold text-[#C9892E]">₹{paymentResult.amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setStep('cart');
              onNavigate('/shop');
            }}
            className="inline-flex items-center justify-center h-[50px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            CONTINUE SHOPPING →
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // PAYMENT FAILURE STATE
  // ---------------------------------------------------------------------------
  if (step === 'failure') {
    return (
      <div className="w-full bg-[#F4F1EA] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-[620px] mx-auto bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-8 sm:p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-300 flex items-center justify-center mx-auto mb-6 text-red-600">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h2 className="font-serif text-[32px] text-[#242424] font-normal tracking-[-0.01em] mb-2">
            Payment Incomplete
          </h2>
          <p className="font-sans text-[15px] text-[#686863] mb-6">
            {paymentResult.error || 'The payment was interrupted or declined by your bank. Your items remain saved in your cart.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setStep('checkout')}
              className="w-full sm:w-auto inline-flex items-center justify-center h-[48px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all shadow-sm cursor-pointer"
            >
              RETRY PAYMENT
            </button>
            <button
              onClick={() => openWhatsAppOrder(items)}
              className="w-full sm:w-auto inline-flex items-center justify-center h-[48px] px-7 rounded-full border border-[#D9D7D0] bg-white hover:bg-[#F4F1EA] text-[#242424] font-sans text-[15px] font-medium transition-all cursor-pointer"
            >
              ORDER VIA WHATSAPP
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN CART PAGE VIEW (MATCHING DRIBBLE REFERENCE LAYOUT & STRUCTURE)
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full bg-[#F4F1EA] text-[#242424] py-8 sm:py-14 lg:py-16">
      <div className="max-w-[1320px] mx-auto px-3.5 sm:px-6 lg:px-8">

        {/* ===================================================================
            1. CART PAGE HERO / INTRO (EDITORIAL HEADLINE AREA)
            =================================================================== */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#C9892E]" />
            <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#686863] font-semibold">
              YOUR CART ({totalItemCount})
            </span>
          </div>

          <h1 className="font-serif text-[32px] sm:text-[48px] lg:text-[56px] text-[#242424] font-normal tracking-[-0.02em] leading-[1.1] mb-2">
            Your selection is ready.
          </h1>

          <p className="font-sans text-[15px] sm:text-[17px] text-[#686863]">
            Review your selection before checkout.
          </p>
        </div>

        {/* ===================================================================
            2. MAIN TWO-COLUMN LAYOUT: PRODUCTS TABLE (LEFT) & SUMMARY (RIGHT)
            =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* -----------------------------------------------------------------
              LEFT COLUMN: CART TABLE + COUPON AREA (~65% WIDTH)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* CHECKOUT STEP 2 FORM (WHEN CHECKOUT IS ACTIVE) */}
            {step === 'checkout' ? (
              <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[16px] p-4 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D9D7D0]">
                  <div>
                    <h2 className="font-serif text-[24px] sm:text-[28px] font-medium text-[#242424]">
                      Shipping & Delivery Details
                    </h2>
                    <p className="font-sans text-[14px] text-[#686863] mt-1">
                      Enter your address to calculate final delivery and complete payment.
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('cart')}
                    className="text-[13px] font-mono uppercase tracking-wider text-[#C9892E] hover:underline cursor-pointer"
                  >
                    ← EDIT CART
                  </button>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[14px]">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full h-[46px] px-4 rounded-xl bg-white border ${
                          validationErrors.name ? 'border-red-500' : 'border-[#D9D7D0]'
                        } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]`}
                      />
                      {validationErrors.name && (
                        <p className="text-red-600 text-[12px] mt-1">{validationErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="10-digit mobile number"
                        className={`w-full h-[46px] px-4 rounded-xl bg-white border ${
                          validationErrors.phone ? 'border-red-500' : 'border-[#D9D7D0]'
                        } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]`}
                      />
                      {validationErrors.phone && (
                        <p className="text-red-600 text-[12px] mt-1">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full h-[46px] px-4 rounded-xl bg-white border ${
                        validationErrors.email ? 'border-red-500' : 'border-[#D9D7D0]'
                      } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]`}
                    />
                    {validationErrors.email && (
                      <p className="text-red-600 text-[12px] mt-1">{validationErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                      Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      value={customer.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House/Flat No., Street, Landmark"
                      className={`w-full p-3.5 rounded-xl bg-white border ${
                        validationErrors.address ? 'border-red-500' : 'border-[#D9D7D0]'
                      } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E] resize-none`}
                    />
                    {validationErrors.address && (
                      <p className="text-red-600 text-[12px] mt-1">{validationErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        className={`w-full h-[46px] px-4 rounded-xl bg-white border ${
                          validationErrors.city ? 'border-red-500' : 'border-[#D9D7D0]'
                        } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]`}
                      />
                      {validationErrors.city && (
                        <p className="text-red-600 text-[12px] mt-1">{validationErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                        State *
                      </label>
                      <select
                        value={customer.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full h-[46px] px-3.5 rounded-xl bg-white border border-[#D9D7D0] text-[#242424] text-[14px] focus:outline-none focus:border-[#C9892E]"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-[13px] font-medium text-[#242424] mb-1.5">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={customer.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                        placeholder="6-digit PIN"
                        className={`w-full h-[46px] px-4 rounded-xl bg-white border ${
                          validationErrors.pincode ? 'border-red-500' : 'border-[#D9D7D0]'
                        } text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]`}
                      />
                      {validationErrors.pincode && (
                        <p className="text-red-600 text-[12px] mt-1">{validationErrors.pincode}</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full h-[52px] mt-2 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[16px] font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? 'Connecting to Razorpay...' : `PAY ₹${finalPayableTotal.toLocaleString('en-IN')} VIA RAZORPAY →`}
                  </button>
                </form>
              </div>
            ) : (
              /* CART PRODUCT TABLE CARD (MATCHING REFERENCE TABLE DESIGN) */
              <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[16px] p-4 sm:p-6 lg:p-8 shadow-sm">
                
                {/* TABLE HEADER (HIDDEN ON VERY SMALL MOBILE, VISIBLE ON SM+) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-[#D9D7D0] font-sans text-[12px] uppercase tracking-wider text-[#686863] font-semibold">
                  <div className="col-span-6 pl-2">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right pr-2">Subtotal</div>
                </div>

                {/* TABLE PRODUCT ROWS */}
                <div className="divide-y divide-[#D9D7D0]/60">
                  {items.map((item) => {
                    const imageSrc =
                      item.product.variants?.find((v) => v.size === item.size)?.image ||
                      item.product.image ||
                      '/images/hero_honey_jar.jpg';

                    return (
                      <div
                        key={item.id}
                        className="py-4 sm:py-5 flex flex-col sm:grid sm:grid-cols-12 gap-3 sm:gap-4 items-start sm:items-center"
                      >
                        {/* COLUMN 1: DELETE ICON + IMAGE + PRODUCT DETAILS */}
                        <div className="w-full sm:col-span-6 flex items-center gap-3">
                          {/* Understated Remove Action (×) */}
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#686863] hover:text-[#242424] hover:bg-[#ECEAE3] transition-colors cursor-pointer flex-shrink-0"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <span className="text-[18px] leading-none select-none">×</span>
                          </button>

                          {/* Product Thumbnail (Clean, rounded, contained) */}
                          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-white border border-[#D9D7D0] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img
                              src={imageSrc}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <h3 className="font-serif text-[15px] sm:text-[17px] font-medium text-[#242424] truncate">
                              {item.product.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-mono text-[11px] uppercase tracking-wider text-[#686863] bg-[#F4F1EA] px-2 py-0.5 rounded-full border border-[#D9D7D0]">
                                {item.size}
                              </span>
                              <span className="text-[12px] text-[#686863] sm:hidden">
                                ₹{item.unitPrice} each
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* COLUMN 2: UNIT PRICE */}
                        <div className="hidden sm:block sm:col-span-2 text-center font-sans text-[15px] text-[#242424] font-medium">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </div>

                        {/* COLUMN 3: QUANTITY CONTROLS */}
                        <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-center">
                          <span className="sm:hidden font-sans text-[13px] text-[#686863]">Quantity:</span>
                          <div className="inline-flex items-center rounded-lg border border-[#D9D7D0] bg-white overflow-hidden shadow-2xs">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#242424] hover:bg-[#F4F1EA] transition-colors cursor-pointer select-none"
                              aria-label={`Decrease quantity of ${item.product.name}`}
                            >
                              −
                            </button>
                            <span className="w-8 sm:w-9 text-center font-mono font-bold text-[14px] text-[#242424] select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#242424] hover:bg-[#F4F1EA] transition-colors cursor-pointer select-none"
                              aria-label={`Increase quantity of ${item.product.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* COLUMN 4: LINE SUBTOTAL */}
                        <div className="w-full sm:w-auto sm:col-span-2 flex items-center justify-between sm:justify-end pr-2 font-sans font-bold text-[15px] sm:text-[16px] text-[#242424]">
                          <span className="sm:hidden font-sans text-[13px] text-[#686863] font-normal">Line Total:</span>
                          <span>₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* BOTTOM OF TABLE CARD: ACTIONS */}
                <div className="pt-5 mt-4 border-t border-[#D9D7D0] flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => onNavigate('/shop')}
                    className="font-sans text-[14px] text-[#686863] hover:text-[#242424] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>←</span>
                    <span>Continue Shopping</span>
                  </button>

                  {onClearCart && (
                    <button
                      onClick={onClearCart}
                      className="font-mono text-[12px] uppercase tracking-wider text-[#686863] hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* COUPON SECTION CARD (DIRECTLY BELOW TABLE LIKE REFERENCE) */}
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[16px] p-4 sm:p-6 lg:p-7 shadow-sm">
              <form
                onSubmit={handleApplyCoupon}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full h-[48px] px-4 rounded-xl bg-white border border-[#D9D7D0] text-[#242424] placeholder-[#686863]/60 text-[14px] focus:outline-none focus:border-[#C9892E]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-[48px] px-7 rounded-xl border border-[#242424] bg-white hover:bg-[#242424] hover:text-[#FAF9F5] text-[#242424] font-sans text-[14px] font-medium transition-all cursor-pointer whitespace-nowrap"
                >
                  Apply coupon
                </button>
              </form>

              {couponMessage && (
                <p
                  className={`mt-3 text-[13px] ${
                    couponMessage.isError ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

          </div>

          {/* -----------------------------------------------------------------
              RIGHT COLUMN: ORDER SUMMARY / CART TOTALS (~35% WIDTH)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[16px] p-4 sm:p-6 lg:p-8 shadow-sm">
              
              {/* CARD TITLE (EXACT REFERENCE: "Cart Totals") */}
              <h2 className="font-serif text-[22px] font-medium text-[#242424] pb-4 mb-5 border-b border-[#D9D7D0]">
                Cart Totals
              </h2>

              {/* FREE SHIPPING PROGRESS METER */}
              <div className="mb-6 pb-5 border-b border-[#D9D7D0]/60">
                <div className="flex items-center justify-between text-[12px] font-mono uppercase tracking-wider mb-2">
                  <span className="font-semibold text-[#242424] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                    FREE SHIPPING
                  </span>
                  <span className="text-[#686863]">
                    {freeShippingRemaining === 0
                      ? 'Free shipping applied!'
                      : `Add ₹${freeShippingRemaining} more`}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#D9D7D0]/50 overflow-hidden">
                  <div
                    className="h-full bg-[#C9892E] transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingPercent}%` }}
                  />
                </div>
              </div>

              {/* ORDER BREAKDOWN */}
              <div className="space-y-3.5 text-[15px] font-sans mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-[#686863]">Subtotal</span>
                  <span className="font-medium text-[#242424]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Coupon Discount (10%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[#686863]">Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="inline-block bg-[#C9892E]/15 text-[#C9892E] font-mono text-[11px] font-bold uppercase px-2 py-0.5 rounded-full">
                        FREE
                      </span>
                    ) : (
                      <span className="font-medium text-[#242424]">₹{shippingFee}</span>
                    )}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#D9D7D0] flex items-baseline justify-between">
                  <span className="font-serif text-[18px] font-semibold text-[#242424]">
                    Total
                  </span>
                  <span className="font-serif text-[24px] font-bold text-[#242424]">
                    ₹{finalPayableTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* PRIMARY CTA: PROCEED TO CHECKOUT */}
              {step === 'cart' ? (
                <button
                  onClick={() => setStep('checkout')}
                  className="w-full h-[52px] rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer mb-3"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <span>→</span>
                </button>
              ) : (
                <button
                  onClick={handleProceedToPayment}
                  disabled={isProcessing}
                  className="w-full h-[52px] rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 cursor-pointer mb-3 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : `COMPLETE ORDER →`}
                </button>
              )}

              {/* SECONDARY WHATSAPP ACTION */}
              <button
                onClick={() => openWhatsAppOrder(items)}
                className="w-full h-[46px] rounded-full border border-[#D9D7D0] bg-white hover:bg-[#F4F1EA] text-[#242424] font-sans text-[14px] font-medium transition-all flex items-center justify-center gap-2 cursor-pointer mb-5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>OR ORDER VIA WHATSAPP</span>
              </button>

              {/* TRUST BADGES IN SUMMARY CARD */}
              <div className="pt-4 border-t border-[#D9D7D0]/60 space-y-2 text-[12px] font-mono text-[#686863]">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Secure 256-Bit SSL Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌿</span>
                  <span>100% Pure & Lab Certified IS 4941</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PRODUCTS, Product, WHATSAPP_NUMBER } from '../data/himalayanHarvest';
import { PageTransition } from '../components/motion/PageTransition';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow?: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onAddToCart,
  onBuyNow,
  onNavigate,
}) => {
  const allProducts: Product[] = PRODUCTS;
  const product = allProducts.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];

  // Selected size state: '400g' | '1kg'
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : '400g'
  );

  // Active gallery image
  const [activeImage, setActiveImage] = useState<string>(() => {
    const variant = product.variants?.find((v) => v.size === selectedSize);
    return variant?.image || product.image;
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<{
    checked: boolean;
    valid: boolean;
    message: string;
  } | null>(null);

  // Toast notification for Add to Cart
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: true,
    nutritionalInfo: false,
    productDetails: false,
    traditionalUse: false,
    harvestingAndSource: false,
    returnsAndExchange: false,
  });

  // When product or selected variant changes, keep active image synchronized
  useEffect(() => {
    const variant = product.variants?.find((v) => v.size === selectedSize);
    setActiveImage(variant?.image || product.image);
  }, [product, selectedSize]);

  // Derive current variant and price
  const currentVariant =
    product.variants?.find((v) => v.size === selectedSize) || product.variants?.[0];
  const unitPrice = currentVariant ? currentVariant.price : product.price;
  const lineTotal = unitPrice * quantity;

  // Build list of all gallery images for this product
  const galleryList = Array.from(
    new Set([
      currentVariant?.image || product.image,
      ...(product.galleryImages || []),
      product.image,
    ])
  ).filter(Boolean);

  const toggleAccordion = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    const isValidFormat = /^[1-9][0-9]{5}$/.test(cleanPin);

    if (!isValidFormat) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian pincode.',
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: true,
        message: 'Standard delivery available. Free shipping on orders above ₹1,000.',
      });
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setToastMessage(`Added ${product.name} (${selectedSize}) to cart`);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedSize, quantity);
    } else {
      onAddToCart(product, selectedSize, quantity);
      onNavigate('/checkout');
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello Himalayan Harvest Honey! 👋\n\nI would like to place an order:\n\nProduct: ${product.name}\nSize: ${selectedSize}\nQuantity: ${quantity}\nPrice: ₹${unitPrice}\nTotal: ₹${lineTotal}\n\nPlease confirm availability and dispatch details.\n\nThank you.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Other authentic products for "MORE FROM OUR HARVEST"
  const otherProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-6 sm:py-10 md:py-14">
        {/* Subtle Floating Cart Confirmation Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.aside
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              aria-label="Cart Notification"
              className="fixed top-20 right-4 sm:right-8 z-50 bg-[#242424] text-[#FAF9F5] px-5 py-3.5 rounded-[16px] shadow-xl border border-[#C9892E]/40 flex items-center gap-4 text-[13px] font-sans"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#C9892E]" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/cart')}
                className="font-mono text-[11px] text-[#C9892E] hover:text-[#DDAA55] font-bold uppercase tracking-wider underline cursor-pointer"
              >
                VIEW CART →
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6 md:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 mb-6 sm:mb-8 text-[12px] sm:text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('/shop')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              SHOP
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold uppercase">{product.name}</span>
          </nav>

          {/* Product Detail Two-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-5 sm:p-8 md:p-10 mb-16 shadow-[0_4px_24px_rgba(36,36,36,0.03)]">
            {/* LEFT COLUMN: Gallery with large main image & thumbnails */}
            <div className="lg:col-span-6 flex flex-col items-center">
              {/* Main Product Showcase Box */}
              <div className="relative w-full aspect-square max-h-[460px] sm:max-h-[520px] rounded-[18px] bg-white border border-[#D9D7D0] p-4 sm:p-8 flex items-center justify-center overflow-hidden shadow-xs">
                {product.badge && (
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#242424] text-[#FAF9F5] font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-xs">
                      {product.badge}
                    </span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={product.alt || `${product.name} raw harvest jar`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="max-h-full max-w-full w-auto h-auto object-contain select-none drop-shadow-[0_16px_32px_rgba(36,36,36,0.12)]"
                  />
                </AnimatePresence>
              </div>

              {/* Thumbnails Strip */}
              {galleryList.length > 1 && (
                <div className="flex items-center gap-2.5 sm:gap-3 mt-4 overflow-x-auto max-w-full pb-1">
                  {galleryList.map((imgSrc, idx) => {
                    const isCurrent = activeImage === imgSrc;
                    return (
                      <button
                        key={`${imgSrc}-${idx}`}
                        type="button"
                        onClick={() => setActiveImage(imgSrc)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] p-1.5 bg-white border transition-all cursor-pointer flex-shrink-0 flex items-center justify-center ${
                          isCurrent
                            ? 'border-[#C9892E] ring-2 ring-[#C9892E]/30 shadow-xs'
                            : 'border-[#D9D7D0] opacity-70 hover:opacity-100'
                        }`}
                        aria-label={`Show view ${idx + 1}`}
                      >
                        <img
                          src={imgSrc}
                          alt={`${product.name} thumb ${idx + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Sourcing & Trust Strip */}
              <div className="w-full mt-6 pt-5 border-t border-[#D9D7D0] grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-[10px] bg-[#F4F1EA]/80 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[9px] sm:text-[10px] text-[#686863] uppercase tracking-wider">
                    ORIGIN
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#242424] truncate block">
                    Himalayas
                  </span>
                </div>
                <div className="p-2.5 rounded-[10px] bg-[#F4F1EA]/80 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[9px] sm:text-[10px] text-[#686863] uppercase tracking-wider">
                    HARVEST
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#242424] truncate block">
                    100% Raw
                  </span>
                </div>
                <div className="p-2.5 rounded-[10px] bg-[#F4F1EA]/80 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[9px] sm:text-[10px] text-[#686863] uppercase tracking-wider">
                    PROCESS
                  </span>
                  <span className="font-serif text-[12px] sm:text-[13px] font-semibold text-[#242424] truncate block">
                    Unheated
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details & Controls */}
            <div className="lg:col-span-6 flex flex-col justify-between text-left">
              <div>
                {/* Category Eyebrow */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-[1.5px] bg-[#C9892E]" />
                  <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#C9892E] font-semibold">
                    {product.category} • HIMALAYAN HARVEST
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-[28px] sm:text-[38px] md:text-[42px] font-semibold text-[#242424] leading-[1.1] mb-2">
                  {product.name}
                </h1>

                {/* Subtitle */}
                {product.subtitle && (
                  <p className="font-sans text-[13px] sm:text-[14px] text-[#686863] font-medium mb-3.5">
                    {product.subtitle}
                  </p>
                )}

                {/* Selling Price */}
                <div className="py-3 border-y border-[#D9D7D0] flex items-baseline gap-3 mb-5">
                  <span className="font-sans font-bold text-[28px] sm:text-[34px] text-[#242424] leading-none">
                    ₹{unitPrice}
                  </span>
                  <span className="font-mono text-[11px] text-[#686863] tracking-wide uppercase">
                    Tax inclusive • Selected size: {selectedSize}
                  </span>
                </div>

                {/* Short Verified Description */}
                <p className="font-sans text-[14px] sm:text-[15px] text-[#242424]/85 leading-[1.6] mb-6">
                  {product.description}
                </p>

                {/* 1. VARIANT SELECTOR (Interactive Cards for 400g & 1kg) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between font-mono text-[12px] mb-2.5">
                    <span className="text-[#686863] uppercase tracking-wider font-semibold">
                      Select Size:
                    </span>
                    <span className="text-[#242424] font-bold">{selectedSize} jar</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((variant) => {
                      const isSelected = selectedSize === variant.size;
                      return (
                        <button
                          key={variant.size}
                          type="button"
                          onClick={() => setSelectedSize(variant.size)}
                          className={`p-3 sm:p-3.5 rounded-[14px] text-left transition-all duration-200 cursor-pointer relative flex items-center justify-between border ${
                            isSelected
                              ? 'bg-[#242424] text-[#FAF9F5] border-[#242424] shadow-sm'
                              : 'bg-white text-[#242424] border-[#D9D7D0] hover:border-[#242424]/60'
                          }`}
                        >
                          <div>
                            <span className="block font-mono text-[14px] sm:text-[15px] font-bold">
                              {variant.size}
                            </span>
                            <span
                              className={`block font-sans text-[13px] font-semibold mt-0.5 ${
                                isSelected ? 'text-[#DDAA55]' : 'text-[#686863]'
                              }`}
                            >
                              ₹{variant.price}
                            </span>
                          </div>

                          <div className="w-9 h-9 rounded-[8px] bg-[#F4F1EA]/60 p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={variant.image || product.image}
                              alt={variant.size}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. QUANTITY SELECTOR */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-mono text-[12px] text-[#686863] uppercase tracking-wider font-semibold">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-[#D9D7D0] rounded-full px-3 py-1 bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 flex items-center justify-center text-sm font-mono text-[#242424] hover:bg-[#F4F1EA] rounded-full transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="px-4 text-sm font-mono font-bold text-[#242424] select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-7 h-7 flex items-center justify-center text-sm font-mono text-[#242424] hover:bg-[#F4F1EA] rounded-full transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-mono text-[13px] text-[#242424] font-bold">
                    Subtotal: ₹{lineTotal}
                  </span>
                </div>

                {/* 3. PRIMARY ACTION BUTTONS: ADD TO CART & BUY NOW */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] sm:text-[15px] font-bold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    <span>ADD TO CART • ₹{lineTotal}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#242424] hover:bg-[#383838] text-[#FAF9F5] font-sans text-[14px] sm:text-[15px] font-bold tracking-wide transition-all shadow-sm hover:shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>BUY IT NOW</span>
                  </button>
                </div>

                {/* Secondary: Direct WhatsApp Order Option */}
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#F4F1EA] text-[#242424] border border-[#D9D7D0] font-sans text-[13px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Order directly via WhatsApp Desk</span>
                  </button>
                </div>

                {/* 4. DELIVERY & PINCODE CHECKER */}
                <div className="p-4 rounded-[16px] bg-white border border-[#D9D7D0] mb-6">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#686863] font-bold block mb-2">
                    Delivery & Shipping
                  </span>

                  <form onSubmit={handlePincodeSubmit} className="flex gap-2 mb-2.5">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit Indian Pincode"
                      className="flex-1 px-3.5 py-2 rounded-[10px] border border-[#D9D7D0] bg-[#FAF9F5] font-mono text-[13px] text-[#242424] focus:outline-none focus:border-[#C9892E]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-[10px] bg-[#242424] hover:bg-[#383838] text-[#FAF9F5] font-mono text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Check
                    </button>
                  </form>

                  {pincodeStatus && (
                    <p
                      className={`text-[12px] font-sans mb-2 ${
                        pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-600'
                      }`}
                    >
                      {pincodeStatus.message}
                    </p>
                  )}

                  <div className="text-[11.5px] font-mono text-[#686863] space-y-0.5">
                    <p>• Orders ₹1,000 and above: <strong className="text-[#242424]">FREE SHIPPING</strong></p>
                    <p>• Orders under ₹1,000: Tamil Nadu ₹50 • Other Indian States ₹100</p>
                    <p className="pt-1 text-[11px] text-[#686863]">
                      Dispatched within 24-48 hours. Live courier tracking details sent via SMS & WhatsApp.
                    </p>
                  </div>
                </div>

                {/* 5. PRODUCT CHARACTERISTICS 4-BOX GRID */}
                {product.characteristics && (
                  <div className="mb-6">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#686863] font-bold block mb-2.5">
                      Honey Characteristics
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {product.characteristics.aroma && (
                        <div className="p-3 rounded-[12px] bg-white border border-[#D9D7D0]">
                          <span className="block font-mono text-[10px] text-[#C9892E] font-bold uppercase tracking-wider">
                            AROMA
                          </span>
                          <span className="font-sans text-[12.5px] text-[#242424] font-medium leading-snug mt-0.5 block">
                            {product.characteristics.aroma}
                          </span>
                        </div>
                      )}

                      {product.characteristics.tasteNote && (
                        <div className="p-3 rounded-[12px] bg-white border border-[#D9D7D0]">
                          <span className="block font-mono text-[10px] text-[#C9892E] font-bold uppercase tracking-wider">
                            TASTE NOTE
                          </span>
                          <span className="font-sans text-[12.5px] text-[#242424] font-medium leading-snug mt-0.5 block">
                            {product.characteristics.tasteNote}
                          </span>
                        </div>
                      )}

                      {product.characteristics.sweetness && (
                        <div className="p-3 rounded-[12px] bg-white border border-[#D9D7D0]">
                          <span className="block font-mono text-[10px] text-[#C9892E] font-bold uppercase tracking-wider">
                            SWEETNESS
                          </span>
                          <span className="font-sans text-[12.5px] text-[#242424] font-medium leading-snug mt-0.5 block">
                            {product.characteristics.sweetness}
                          </span>
                        </div>
                      )}

                      {product.characteristics.texture && (
                        <div className="p-3 rounded-[12px] bg-white border border-[#D9D7D0]">
                          <span className="block font-mono text-[10px] text-[#C9892E] font-bold uppercase tracking-wider">
                            TEXTURE
                          </span>
                          <span className="font-sans text-[12.5px] text-[#242424] font-medium leading-snug mt-0.5 block">
                            {product.characteristics.texture}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 6. EXPANDABLE ACCORDIONS SECTION */}
          {product.accordions && (
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-6 sm:p-8 md:p-10 mb-16 shadow-[0_4px_24px_rgba(36,36,36,0.03)]">
              <h2 className="font-serif text-[22px] sm:text-[26px] font-semibold text-[#242424] mb-6">
                Product Information
              </h2>

              <div className="divide-y divide-[#D9D7D0]">
                {/* 1. DESCRIPTION ACCORDION */}
                {product.accordions.description && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('description')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>DESCRIPTION</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.description ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.description && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 space-y-2 font-sans text-[14px] sm:text-[15px] text-[#242424]/85 leading-[1.65]"
                        >
                          {product.accordions.description.map((para, i) => (
                            <p key={i}>{para}</p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. PRODUCT DETAILS */}
                {product.accordions.productDetails && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('productDetails')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>PRODUCT DETAILS</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.productDetails ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.productDetails && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 font-sans text-[14px] sm:text-[15px] text-[#242424]/85 space-y-1.5"
                        >
                          <p>
                            <strong>Ingredients:</strong> {product.accordions.productDetails.ingredients}
                          </p>
                          <p>
                            <strong>Packaging:</strong> {product.accordions.productDetails.packaging}
                          </p>
                          <p>
                            <strong>Storage:</strong> {product.accordions.productDetails.storage}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 3. TRADITIONAL USE */}
                {product.accordions.traditionalUse && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('traditionalUse')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>TRADITIONAL USE & ENJOYMENT</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.traditionalUse ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.traditionalUse && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 space-y-2 font-sans text-[14px] sm:text-[15px] text-[#242424]/85 leading-[1.65]"
                        >
                          {product.accordions.traditionalUse.map((use, i) => (
                            <p key={i}>{use}</p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 4. HARVESTING & SOURCE */}
                {product.accordions.harvestingAndSource && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('harvestingAndSource')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>HARVESTING & SOURCE</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.harvestingAndSource ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.harvestingAndSource && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 space-y-2 font-sans text-[14px] sm:text-[15px] text-[#242424]/85 leading-[1.65]"
                        >
                          {product.accordions.harvestingAndSource.map((src, i) => (
                            <p key={i}>{src}</p>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 5. QUALITY / LAB REPORT */}
                {product.accordions.qualityLabReport && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('nutritionalInfo')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>LABORATORY ANALYSIS (TESTED SAMPLE)</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.nutritionalInfo ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.nutritionalInfo && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 font-sans text-[14px] text-[#242424]/85 space-y-3"
                        >
                          <p className="text-[13px] text-[#686863]">
                            {product.accordions.qualityLabReport.testedSampleNote}
                          </p>

                          <div className="p-3.5 rounded-[12px] bg-white border border-[#D9D7D0] font-mono text-[12px] space-y-1">
                            <p><strong>Testing Facility:</strong> {product.accordions.qualityLabReport.facility}</p>
                            <p><strong>Report Reference:</strong> {product.accordions.qualityLabReport.reportNumber} ({product.accordions.qualityLabReport.reportDate})</p>
                            <p><strong>Referenced Standard:</strong> {product.accordions.qualityLabReport.standard}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[12px]">
                            {product.accordions.qualityLabReport.highlights.map((param, i) => (
                              <div key={i} className="p-2.5 rounded-[8px] bg-white border border-[#D9D7D0] flex items-center justify-between">
                                <span className="text-[#686863]">{param.parameter}:</span>
                                <span className="font-bold text-[#242424]">{param.result}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => onNavigate('/lab-reports')}
                              className="font-mono text-[12px] text-[#242424] font-bold underline hover:text-[#C9892E] cursor-pointer"
                            >
                              VIEW COMPLETE TEST REPORT PAGE →
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 6. RETURNS & EXCHANGE */}
                {product.accordions.returnsAndExchange && (
                  <div className="py-4">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('returnsAndExchange')}
                      className="w-full flex items-center justify-between text-left font-mono text-[13px] sm:text-[14px] uppercase tracking-wider font-semibold text-[#242424] cursor-pointer"
                    >
                      <span>RETURNS & EXCHANGE</span>
                      <span className="text-[18px] text-[#C9892E] font-sans">
                        {openSections.returnsAndExchange ? '−' : '+'}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openSections.returnsAndExchange && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pt-3 font-sans text-[14px] text-[#242424]/85 space-y-2.5 leading-[1.6]"
                        >
                          <p>{product.accordions.returnsAndExchange.summary}</p>
                          <button
                            type="button"
                            onClick={() => onNavigate(product.accordions?.returnsAndExchange?.link || '/refund-policy')}
                            className="font-mono text-[12px] text-[#242424] font-bold underline hover:text-[#C9892E] cursor-pointer inline-block"
                          >
                            READ FULL REFUND & RETURN POLICY →
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. MORE FROM OUR HARVEST (Related Products) */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[24px] sm:text-[30px] font-semibold text-[#242424]">
                MORE FROM OUR HARVEST
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('/shop')}
                className="font-mono text-[12px] text-[#242424] font-bold hover:text-[#C9892E] cursor-pointer"
              >
                VIEW FULL COLLECTION →
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-7">
              {otherProducts.slice(0, 3).map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

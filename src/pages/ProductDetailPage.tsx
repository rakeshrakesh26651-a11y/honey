import React, { useState } from 'react';
import { PRODUCTS, Product, WHATSAPP_NUMBER } from '../data/himalayanHarvest';
import { PageTransition } from '../components/motion/PageTransition';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  slug: string;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onAddToCart,
  onNavigate,
}) => {
  const allProducts: Product[] = PRODUCTS;
  const product = allProducts.find((p) => p.slug === slug || p.id === slug) || PRODUCTS[0];

  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : '400g'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'testing' | 'shipping'>('details');

  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const unitPrice = currentVariant ? currentVariant.price : product.price;
  const lineTotal = unitPrice * quantity;

  // Format WhatsApp message strictly per requirement:
  // Hello Himalayan Harvest Honey! 👋
  //
  // I would like to place an order:
  //
  // Product: [PRODUCT NAME]
  // Size: [SELECTED SIZE]
  // Quantity: [QUANTITY]
  // Price: ₹[UNIT PRICE]
  // Total: ₹[LINE TOTAL]
  //
  // Please confirm availability and order details.
  //
  // Thank you.
  const handleWhatsAppOrder = () => {
    const message = `Hello Himalayan Harvest Honey! 👋\n\nI would like to place an order:\n\nProduct: ${product.name}\nSize: ${selectedSize}\nQuantity: ${quantity}\nPrice: ₹${unitPrice}\nTotal: ₹${lineTotal}\n\nPlease confirm availability and order details.\n\nThank you.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, selectedSize, quantity);
  };

  // Other products for recommendations
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-8 md:py-14">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
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

          {/* Product Showcase Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-6 sm:p-8 md:p-12 mb-16 shadow-[0_4px_24px_rgba(36, 36, 36,0.04)]">
            {/* Left: Product Image */}
            <div className="lg:col-span-6">
              <div className="relative aspect-square w-full rounded-[18px] overflow-hidden bg-white border border-[#D9D7D0] shadow-sm flex items-center justify-center p-6 sm:p-8 md:p-10">
                <img
                  src={product.image}
                  alt={product.alt}
                  className="w-full h-full object-contain object-center drop-shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                />

                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#C9892E] text-[#242424] font-mono text-[11px] font-bold uppercase tracking-wider shadow-xs">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Quality Badges */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#D9D7D0]">
                <div className="text-center p-3 rounded-[12px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[10px] text-[#686863] uppercase tracking-wider">
                    PURITY
                  </span>
                  <span className="font-serif text-[13px] font-semibold text-[#242424]">
                    100% Raw
                  </span>
                </div>
                <div className="text-center p-3 rounded-[12px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[10px] text-[#686863] uppercase tracking-wider">
                    STANDARD
                  </span>
                  <span className="font-serif text-[13px] font-semibold text-[#242424]">
                    IS 4941 Tested
                  </span>
                </div>
                <div className="text-center p-3 rounded-[12px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/60">
                  <span className="block font-mono text-[10px] text-[#686863] uppercase tracking-wider">
                    PACKAGING
                  </span>
                  <span className="font-serif text-[13px] font-semibold text-[#242424]">
                    Food-Safe Glass
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Heritage Tag */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3.5 h-[1.5px] bg-[#C9892E] inline-block" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#C9892E] font-semibold">
                    {product.category} • HIMALAYAN HARVEST
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-[32px] sm:text-[40px] md:text-[46px] font-semibold text-[#242424] leading-[1.1] mb-2">
                  {product.name}
                </h1>

                {/* Subtitle */}
                {product.subtitle && (
                  <p className="font-sans text-[15px] font-medium text-[#686863] mb-4">
                    {product.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="font-sans text-[15px] sm:text-[16px] text-[#242424]/85 leading-[1.6] mb-6">
                  {product.description}
                </p>

                {/* Dynamic Price Display */}
                <div className="py-4 border-y border-[#D9D7D0] flex items-baseline gap-4 mb-6">
                  <span className="font-sans font-bold text-[28px] sm:text-[34px] text-[#242424] leading-none">
                    ₹{unitPrice}
                  </span>
                  <span className="font-mono text-[12px] text-[#686863] tracking-wider uppercase">
                    Tax inclusive • Selected size: {selectedSize}
                  </span>
                </div>

                {/* 1. Size Selector (400g / 1000g) */}
                <div className="space-y-2.5 mb-6">
                  <div className="flex items-center justify-between font-mono text-[12px]">
                    <span className="text-[#686863] uppercase tracking-wider font-medium">Select Size:</span>
                    <span className="text-[#242424] font-bold">{selectedSize} jar</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((v) => {
                      const isSelected = selectedSize === v.size;
                      return (
                        <button
                          key={v.size}
                          type="button"
                          onClick={() => setSelectedSize(v.size)}
                          className={`py-3 px-3 rounded-[12px] text-center transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-[#242424] text-[#FAF9F5] font-bold shadow-sm border-2 border-[#242424]'
                              : 'bg-[#F4F1EA] text-[#242424] border border-[#D9D7D0] hover:border-[#242424]/60'
                          }`}
                        >
                          <span className="block font-mono text-[13px]">{v.size}</span>
                          <span className={`block font-sans text-[12px] mt-0.5 ${isSelected ? 'text-[#DDAA55]' : 'text-[#686863]'}`}>
                            ₹{v.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Quantity Selector */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-mono text-[12px] text-[#686863] uppercase tracking-wider font-medium">
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
                    <span className="px-4 text-sm font-mono font-semibold text-[#242424] select-none">
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
                  <span className="font-mono text-[13px] text-[#242424] font-semibold">
                    Total: ₹{lineTotal}
                  </span>
                </div>

                {/* 3. Action Buttons: Add to Cart & WhatsApp Order */}
                <div className="flex flex-col sm:flex-row items-center gap-3.5">
                  <button
                    type="button"
                    onClick={handleAddToCartClick}
                    className="w-full sm:flex-1 py-4 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold tracking-wide transition-all duration-200 shadow-md transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
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
                    onClick={handleWhatsAppOrder}
                    className="w-full sm:flex-1 py-4 px-6 rounded-full bg-[#FAF9F5] hover:bg-[#F4F1EA] text-[#242424] border-2 border-[#242424] font-sans text-[14px] font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>ORDER ON WHATSAPP</span>
                  </button>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="p-3.5 rounded-[12px] bg-[#F4F1EA] border border-[#D9D7D0] text-[12px] font-mono text-[#686863] flex items-center justify-between">
                <span>⚡ Shipping: TN ₹50 • Other states ₹100</span>
                <span className="text-[#242424] font-bold">FREE on ₹1,000+</span>
              </div>
            </div>
          </div>

          {/* Product Information Accordion / Tabs */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-6 sm:p-8 md:p-10 mb-16">
            <div className="flex border-b border-[#D9D7D0] gap-6 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-3 font-mono text-[13px] uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-colors ${
                  activeTab === 'details'
                    ? 'border-[#C9892E] text-[#242424]'
                    : 'border-transparent text-[#686863] hover:text-[#242424]'
                }`}
              >
                Harvesting & Origin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('testing')}
                className={`pb-3 font-mono text-[13px] uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-colors ${
                  activeTab === 'testing'
                    ? 'border-[#C9892E] text-[#242424]'
                    : 'border-transparent text-[#686863] hover:text-[#242424]'
                }`}
              >
                Laboratory Analysis
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 font-mono text-[13px] uppercase tracking-wider font-semibold cursor-pointer border-b-2 transition-colors ${
                  activeTab === 'shipping'
                    ? 'border-[#C9892E] text-[#242424]'
                    : 'border-transparent text-[#686863] hover:text-[#242424]'
                }`}
              >
                Delivery & Returns
              </button>
            </div>

            {activeTab === 'details' && (
              <div className="space-y-4 font-sans text-[15px] text-[#242424]/85 leading-[1.65]">
                <p>
                  Our {product.name} is harvested directly by 4th-generation honey harvesters from native wild mountain flora. Unlike commercial blends, it is collected without industrial heat extraction, micro-filtration, or synthetic blending.
                </p>
                <p>
                  Every jar preserves the living bee pollen, trace high-altitude minerals, and active enzymes that give authentic mountain honey its distinct therapeutic complexity and aroma.
                </p>
              </div>
            )}

            {activeTab === 'testing' && (
              <div className="space-y-4 font-sans text-[15px] text-[#242424]/85 leading-[1.65]">
                <p>
                  Tested and verified by <strong>Tamilnadu Test House Private Limited</strong> under reference standard <strong>IS 4941:1994</strong> (Report: TNTH/M-0366/2026-27).
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[14px]">
                  <li>Specific Gravity: 1.41 (Requirement: Min 1.37) — COMPLIANT</li>
                  <li>Moisture Content: 18.79% (Requirement: Max 20%) — COMPLIANT</li>
                  <li>Total Reducing Sugars: 69.84% (Requirement: Min 65%) — COMPLIANT</li>
                  <li>Invert Sugar / Adulteration Test: Negative / No added sugars detected</li>
                </ul>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('/lab-reports')}
                    className="font-mono text-[12px] text-[#242424] font-bold underline hover:text-[#C9892E] cursor-pointer"
                  >
                    VIEW COMPLETE 11-PARAMETER CERTIFICATE →
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 font-sans text-[15px] text-[#242424]/85 leading-[1.65]">
                <p>
                  Orders are dispatched within 24 to 48 hours using secure bubble packaging and shatter-proof corrugated boxes.
                </p>
                <p>
                  <strong>Shipping Rates:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[14px]">
                  <li>Orders ₹1,000 and above: <strong>FREE DELIVERY</strong> nationwide.</li>
                  <li>Orders below ₹1,000: ₹50 in Tamil Nadu, ₹100 for all other states.</li>
                </ul>
                <p className="text-[13px] text-[#686863] pt-1">
                  Returns accepted within 24 hours of delivery for damaged or defective seals.
                </p>
              </div>
            )}
          </div>

          {/* Related Products Recommendation */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-[26px] sm:text-[32px] font-semibold text-[#242424]">
                More from Our Harvest
              </h2>
              <button
                onClick={() => onNavigate('/shop')}
                className="font-mono text-[12px] text-[#242424] font-bold hover:text-[#C9892E] cursor-pointer"
              >
                VIEW FULL COLLECTION →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

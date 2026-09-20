import React, { useState } from 'react';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onNavigate?: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onNavigate }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : (product.weight || '400g')
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Derive current price based on selected size variant
  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const currentPrice = currentVariant ? currentVariant.price : product.price;

  const handleProductClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(`/product/${product.slug}`);
    }
  };

  const handleDecreaseQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.available === false) return;
    onAddToCart(product, selectedSize, quantity);
  };

  // Badge text matching BeeFresh pill style (e.g. Natural Harvest, Raw Reserve, etc.)
  const badgeText = product.badge || 'Pure Raw Honey';

  return (
    <div className="group flex flex-col justify-between w-full h-full bg-[#FAF9F5] rounded-[24px] sm:rounded-[28px] border border-[#D9D7D0] p-5 sm:p-6 shadow-[0_4px_24px_rgba(36, 36, 36,0.03)] hover:shadow-[0_12px_36px_rgba(36, 36, 36,0.07)] hover:border-[#C9892E]/40 transition-all duration-300">
      {/* Top Half: Tag, Isolated Jar Image, Product Title, Subtitle, Description, Size Selector */}
      <div className="flex flex-col">
        {/* Top Header Pill Badge */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#242424] text-[#FAF9F5] text-[11px] font-medium tracking-wide shadow-xs">
            {badgeText}
          </span>
          {product.category && (
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#686863]">
              {product.category}
            </span>
          )}
        </div>

        {/* Spacious Product Image Area — Centered Isolated Jar with transparent background */}
        <a
          href={`/product/${product.slug}`}
          onClick={handleProductClick}
          aria-label={`View details of ${product.name}`}
          className="relative w-full h-56 sm:h-64 flex items-center justify-center p-2 mb-3 cursor-pointer group-hover:scale-[1.02] transition-transform duration-300 ease-out overflow-visible"
        >
          <img
            src={product.image}
            alt={product.alt || `${product.name} pure harvest jar`}
            className="max-h-full w-auto max-w-[85%] object-contain drop-shadow-[0_16px_28px_rgba(36, 36, 36,0.14)] select-none transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </a>

        {/* Product Title and Header Price Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <a
            href={`/product/${product.slug}`}
            onClick={handleProductClick}
            className="cursor-pointer text-left flex-1"
          >
            <h3 className="font-serif text-[20px] sm:text-[22px] font-semibold text-[#242424] group-hover:text-[#C9892E] transition-colors leading-tight">
              {product.name}
            </h3>
          </a>
          <div className="text-right whitespace-nowrap pt-0.5">
            <span className="text-[13px] font-medium text-[#242424] align-top mr-0.5">₹</span>
            <span className="font-sans font-bold text-[19px] sm:text-[21px] text-[#242424] tracking-tight">
              {currentPrice}
            </span>
          </div>
        </div>

        {/* Short Subtitle / Category */}
        <p className="font-sans text-[12.5px] sm:text-[13px] text-[#C9892E] font-medium tracking-wide mb-2 text-left leading-snug">
          {product.subtitle || '100% Pure Natural Harvest'}
        </p>

        {/* Individual Product Description */}
        <p className="font-sans text-[12.5px] sm:text-[13px] text-[#686863] leading-[1.55] min-h-[56px] line-clamp-3 mb-4 text-left">
          {product.description}
        </p>

        {/* SELECT SIZE Section with Rounded Pills */}
        <div className="mb-3 text-left">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#686863] uppercase tracking-wider mb-2">
            <span className="font-semibold">Select Size</span>
            <span className="text-[#242424] font-bold">{selectedSize}</span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {(product.variants && product.variants.length > 0
              ? product.variants
              : [
                  { size: '400g', price: product.price },
                  { size: '1000g', price: Math.round(product.price * 1.8) },
                ]
            ).map((variant) => {
              const isSelected = selectedSize === variant.size;
              return (
                <button
                  key={variant.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(variant.size);
                  }}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-mono transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#242424] text-[#FAF9F5] font-bold shadow-xs scale-[1.02]'
                      : 'bg-white/90 text-[#242424] border border-[#D9D7D0] hover:border-[#242424]/60 hover:bg-white'
                  }`}
                  aria-label={`Select ${variant.size} for ${product.name}`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Price & Quantity Controls + Add to Cart Button */}
      <div className="pt-3 border-t border-[#D9D7D0] mt-2">
        {/* Price & Quantity Row — Visually aligned */}
        <div className="flex items-center justify-between mb-3.5">
          {/* Price display with total / unit calculation */}
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-1">
              <span className="font-sans font-extrabold text-[20px] sm:text-[22px] text-[#242424] leading-none">
                ₹{currentPrice * quantity}
              </span>
              {quantity > 1 && (
                <span className="font-sans text-[11px] text-[#686863] leading-none">
                  (₹{currentPrice} × {quantity})
                </span>
              )}
            </div>
            <span className="font-mono text-[10px] text-[#686863] uppercase tracking-wider mt-1">
              {selectedSize} Pack
            </span>
          </div>

          {/* Quantity Controls [ −  1  + ] */}
          <div className="flex items-center bg-white border border-[#D9D7D0] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleDecreaseQty}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#242424] hover:bg-[#F4F1EA] text-sm font-bold transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-mono font-bold text-[#242424] select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncreaseQty}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#242424] hover:bg-[#F4F1EA] text-sm font-bold transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button — Honey Gold pill */}
        {product.available !== false ? (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} (${selectedSize}) to cart`}
            className="w-full py-3.5 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] active:scale-[0.98] text-[#242424] font-sans text-[14px] sm:text-[15px] font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer"
          >
            <span>Add to Cart</span>
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3.5 px-6 rounded-full bg-[#D9D7D0]/60 text-[#686863] font-sans text-[14px] sm:text-[15px] font-semibold cursor-not-allowed flex items-center justify-center"
          >
            Out of stock
          </button>
        )}
      </div>
    </div>
  );
};

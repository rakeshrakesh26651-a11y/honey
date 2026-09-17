import React, { useState } from 'react';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : '400g'
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Derive current price based on selected size variant
  const currentVariant = product.variants?.find((v) => v.size === selectedSize);
  const currentPrice = currentVariant ? currentVariant.price : product.price;

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
    onAddToCart(product, selectedSize, quantity);
  };

  return (
    <div className="group flex flex-col justify-between w-full h-full bg-white rounded-[14px] md:rounded-[16px] border border-[#1e1a16]/[0.08] p-3 sm:p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-[#1e1a16]/[0.18] transition-all duration-300">
      {/* Top Half: Image & Badges */}
      <div>
        <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[10px] md:rounded-[12px] overflow-hidden bg-[#f5efe4] mb-3">
          <img
            src={product.image}
            alt={product.alt}
            className="w-full h-full object-cover rounded-[10px] md:rounded-[12px] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />

          {/* Badges matching reference placement */}
          {product.badge === 'BEST SELLER' && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] md:rounded-[6px] bg-[#f5b82e] text-[#1e1a16] font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-xs">
                BEST SELLER
              </span>
            </div>
          )}

          {product.badge === 'RARE' && (
            <div className="absolute top-2 right-2 z-10">
              <span className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] md:rounded-[6px] bg-[#1e1a16] text-white font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-xs">
                RARE
              </span>
            </div>
          )}

          {product.badge && product.badge !== 'BEST SELLER' && product.badge !== 'RARE' && (
            <div className="absolute top-2 left-2 z-10">
              <span className="inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-[4px] md:rounded-[6px] bg-[#1e1a16]/85 text-white font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {product.badge}
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col text-left px-0.5">
          <h4 className="font-serif text-[15px] sm:text-[16px] md:text-[17px] font-semibold text-[#1e1a16] leading-[1.25] mb-1 group-hover:text-[#657044] transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="font-sans text-[11px] sm:text-[11.5px] md:text-[12px] text-[#1e1a16]/60 leading-tight mb-2.5 line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Size Selector: 400g / 700g / 1000g */}
        <div className="my-2.5 px-0.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#1e1a16]/70 mb-1.5">
            <span className="font-medium uppercase tracking-wider">Select Size</span>
            <span className="font-semibold text-[#1e1a16]">{selectedSize}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(product.variants || [
              { size: '400g', price: product.price },
              { size: '700g', price: Math.round(product.price * 1.4) },
              { size: '1000g', price: Math.round(product.price * 1.8) },
            ]).map((variant) => {
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
                  className={`py-1 px-1 rounded-md text-[11px] font-mono transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e1a16] text-white font-bold shadow-xs'
                      : 'bg-[#1e1a16]/[0.04] text-[#1e1a16]/80 hover:bg-[#1e1a16]/[0.09] border border-[#1e1a16]/[0.08]'
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

      {/* Bottom Section: Quantity & Price / Add to Cart Row */}
      <div className="pt-2 border-t border-[#1e1a16]/[0.06] mt-2 px-0.5 space-y-2.5">
        {/* Quantity and Price Row */}
        <div className="flex items-center justify-between">
          {/* Price display */}
          <div className="flex flex-col text-left">
            <span className="font-sans font-bold text-[16px] sm:text-[17px] text-[#1e1a16] leading-none">
              ₹{currentPrice * quantity}
            </span>
            {quantity > 1 && (
              <span className="font-sans text-[10px] text-[#1e1a16]/45 leading-none mt-1">
                ₹{currentPrice} each
              </span>
            )}
          </div>

          {/* Quantity Selector: − 1 + */}
          <div className="flex items-center border border-[#1e1a16]/15 rounded-full px-1.5 py-0.5 bg-[#f7f2e7]/60">
            <button
              type="button"
              onClick={handleDecreaseQty}
              aria-label={`Decrease quantity of ${product.name}`}
              className="w-5 h-5 flex items-center justify-center text-xs font-mono text-[#1e1a16] hover:bg-white rounded-full transition-colors cursor-pointer"
            >
              −
            </button>
            <span className="px-2 text-xs font-mono font-medium text-[#1e1a16] select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncreaseQty}
              aria-label={`Increase quantity of ${product.name}`}
              className="w-5 h-5 flex items-center justify-center text-xs font-mono text-[#1e1a16] hover:bg-white rounded-full transition-colors cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} (${selectedSize}) to cart`}
          className="w-full py-2.5 rounded-full bg-[#1e1a16] hover:bg-[#383129] active:scale-[0.98] text-white flex items-center justify-center gap-2 font-sans text-[13px] font-medium transition-all duration-200 shadow-sm cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

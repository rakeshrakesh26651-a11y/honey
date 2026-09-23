import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../data/himalayanHarvest';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
  onNavigate?: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart: _onAddToCart, onNavigate }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants && product.variants.length > 0 ? product.variants[0].size : '400g'
  );

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      if (!product.variants.some((v) => v.size === selectedSize)) {
        setSelectedSize(product.variants[0].size);
      }
    }
  }, [product, selectedSize]);

  const currentVariant = product.variants?.find((v) => v.size === selectedSize) || product.variants?.[0];
  const currentPrice = currentVariant ? currentVariant.price : product.price;
  const currentImage = currentVariant?.image || product.image;

  const isVariantOutOfStock = currentVariant
    ? currentVariant.available === false || (currentVariant.stock !== undefined && currentVariant.stock <= 0)
    : false;
  const isAllOutOfStock =
    product.available === false ||
    (product.variants &&
      product.variants.length > 0 &&
      product.variants.every((v) => v.available === false || (v.stock !== undefined && v.stock <= 0)));

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `/shop/${product.slug}`;
    if (onNavigate) {
      onNavigate(targetUrl);
    } else if (typeof window !== 'undefined') {
      window.location.href = targetUrl;
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col justify-between w-full h-full bg-[#FAF9F5] rounded-[20px] sm:rounded-[24px] border border-[#D9D7D0] p-4 sm:p-5 md:p-6 shadow-[0_4px_20px_rgba(36,36,36,0.03)] hover:shadow-[0_12px_32px_rgba(36,36,36,0.08)] hover:border-[#C9892E]/50 transition-all duration-300 relative overflow-hidden"
    >
      {/* Top Header: Badge if present */}
      <div className="flex items-center justify-between gap-2 mb-2">
        {isAllOutOfStock ? (
          <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#8C8075]/15 text-[#5A4F46] border border-[#8C8075]/30 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">
            OUT OF STOCK
          </span>
        ) : product.badge ? (
          <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#242424] text-[#FAF9F5] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">
            {product.badge}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#686863] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
            RAW HONEY
          </span>
        )}

        <span className="text-[10px] sm:text-[11px] font-mono text-[#686863] uppercase tracking-wider truncate">
          {product.category}
        </span>
      </div>

      {/* Large Product Bottle Image */}
      <a
        href={`/shop/${product.slug}`}
        onClick={handleCardClick}
        aria-label={`View details of ${product.name}`}
        className="relative w-full aspect-square max-h-[220px] sm:max-h-[260px] md:max-h-[280px] flex items-center justify-center p-2 sm:p-4 my-2 sm:my-3 cursor-pointer overflow-hidden rounded-[14px] bg-white/60 border border-[#D9D7D0]/40 group-hover:bg-white transition-colors"
      >
        <motion.img
          key={currentImage}
          src={currentImage}
          alt={product.alt || `${product.name} bottle`}
          className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-[0_12px_24px_rgba(36,36,36,0.12)] select-none group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </a>

      {/* Product Information */}
      <div className="flex flex-col flex-1 text-left mt-1">
        <a
          href={`/shop/${product.slug}`}
          onClick={handleCardClick}
          className="cursor-pointer group-hover:text-[#C9892E] transition-colors"
        >
          <h2 className="font-serif text-[18px] sm:text-[21px] md:text-[22px] font-semibold text-[#242424] leading-tight">
            {product.name}
          </h2>
        </a>

        {product.subtitle && (
          <p className="font-sans text-[11px] sm:text-[12px] text-[#C9892E] font-medium tracking-wide mt-1 line-clamp-1">
            {product.subtitle}
          </p>
        )}

        <p className="font-sans text-[12px] sm:text-[13px] text-[#686863] leading-[1.5] line-clamp-2 my-2.5">
          {product.description}
        </p>

        {/* Available Sizes Selector */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] sm:text-[11px] font-mono text-[#686863]">Sizes:</span>
          <div className="flex items-center gap-1.5">
            {product.variants.map((v) => {
              const isSelected = selectedSize === v.size;
              const isOut = v.available === false || (v.stock !== undefined && v.stock <= 0);
              return (
                <button
                  key={v.size}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(v.size);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? isOut
                        ? 'bg-[#5A4F46] text-[#FAF9F5]'
                        : 'bg-[#242424] text-[#FAF9F5]'
                      : isOut
                      ? 'bg-[#F4F1EA] text-[#8C8075] border border-[#D9D7D0] line-through'
                      : 'bg-white text-[#686863] border border-[#D9D7D0] hover:border-[#242424]'
                  }`}
                  title={isOut ? `${v.size} is out of stock` : `${v.size} available`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Footer: Actual Selling Price & VIEW PRODUCT Button */}
      <div className="pt-3 border-t border-[#D9D7D0] flex flex-col gap-2.5 mt-auto">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#686863]">
            Price
          </span>
          <div className="text-right">
            <span className="font-sans font-bold text-[19px] sm:text-[22px] text-[#242424] tracking-tight">
              ₹{currentPrice}
            </span>
            <span className="font-mono text-[10px] text-[#686863] ml-1">
              ({selectedSize})
            </span>
            {isVariantOutOfStock && (
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#9B3C2A] font-semibold">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <a
          href={`/shop/${product.slug}`}
          onClick={handleCardClick}
          className="w-full py-2.5 sm:py-3 px-4 rounded-full bg-[#242424] hover:bg-[#C9892E] text-[#FAF9F5] font-sans text-[13px] sm:text-[14px] font-bold tracking-wide transition-colors duration-200 text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>{isAllOutOfStock ? 'OUT OF STOCK • VIEW' : isVariantOutOfStock ? 'SIZE OUT OF STOCK • VIEW' : 'VIEW PRODUCT'}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </motion.article>
  );
};

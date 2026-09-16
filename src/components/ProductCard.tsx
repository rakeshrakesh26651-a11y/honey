import React from 'react';
import { Product } from '../data/content';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group flex flex-col w-full text-left">
      {/* Product Image Wrapper */}
      <div className="relative w-full aspect-[352/469] rounded-[16px] overflow-hidden bg-[#e8e2d5]/30">
        <img
          src={product.image}
          alt={product.alt}
          className="w-full h-full object-cover rounded-[16px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Butter Yellow Best Seller Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#f2c94c] text-[#1e1a16] font-mono text-[11px] font-normal uppercase tracking-[0.06em] shadow-2xs">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full py-3 rounded-full bg-[#1e1a16] text-white font-sans text-sm font-medium hover:bg-[#332c25] shadow-lg transition-all transform active:scale-98"
          >
            Add to Cart — ₹{product.price}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 flex flex-col space-y-1">
        <h4 className="font-serif text-[22px] font-medium text-[#1e1a16] leading-[1.3]">
          {product.name}
        </h4>
        <p className="font-sans text-[14px] font-normal text-[#1e1a16]/70">
          {product.subtitle}
        </p>
        <p className="font-sans text-[16px] font-medium text-[#1e1a16]">
          ₹{product.price}{product.weight ? ` • ${product.weight}` : ''}
        </p>
      </div>
    </div>
  );
};

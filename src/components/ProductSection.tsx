import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS, Product } from '../data/content';

interface ProductSectionProps {
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onAddToCart }) => {
  return (
    <section id="lineup" className="w-full py-16 md:py-24 bg-[#f7f2e7] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 pb-2"
        >
          {/* Left: Eyebrow + Editorial Heading */}
          <div className="space-y-1.5 md:space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#657044] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-[#657044] font-medium">
                OUR HONEY COLLECTION
              </span>
            </div>
            <h2 className="font-serif text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-semibold text-[#1e1a16] leading-[1.15] tracking-[-0.01em]">
              Find Your Perfect Honey
            </h2>
          </div>

          {/* Right: Tagline + View All Action */}
          <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 pt-2 md:pt-0">
            <span className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-[#1e1a16]/65 font-normal tracking-wide">
              Pure. Rare. Powerful.
            </span>
            <a
              href="#lineup"
              className="group inline-flex items-center gap-1.5 font-sans text-[13px] sm:text-[14px] font-medium text-[#1e1a16] hover:text-[#657044] transition-colors"
            >
              <span>View All</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* 5-Product Card Presentation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-4.5 lg:gap-4 xl:gap-5"
        >
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

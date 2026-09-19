import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS, Product } from '../data/content';
import { AnimatedHeading } from './motion/AnimatedHeading';

interface ProductSectionProps {
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onNavigate?: (path: string) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onAddToCart, onNavigate }) => {
  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/shop');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop';
    }
  };

  return (
    <section id="lineup" className="w-full py-16 md:py-24 bg-[#F4F1EA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14 pb-2"
        >
          {/* Left: Eyebrow + Editorial Heading */}
          <div className="space-y-1.5 md:space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#242424] font-semibold">
                PURE HIGH-ALTITUDE HARVESTS
              </span>
            </div>
            <AnimatedHeading
              text="EXPLORE OUR HONEY COLLECTION"
              as="h2"
              className="font-serif text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-semibold text-[#242424] leading-[1.15] tracking-[-0.01em]"
            />
          </div>

          {/* Right: Tagline + View All Action */}
          <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 pt-2 md:pt-0">
            <span className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-[#686863] font-normal tracking-wide hidden sm:inline">
              100% pure, unpasteurized, and laboratory certified.
            </span>
            <a
              href="/shop"
              onClick={handleViewAll}
              className="group inline-flex items-center gap-1.5 font-sans text-[13px] sm:text-[14px] font-semibold text-[#242424] hover:text-[#C9892E] transition-colors cursor-pointer"
            >
              <span>View Full Catalogue</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* 6-Product Presentation Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8"
        >
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onNavigate={onNavigate}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

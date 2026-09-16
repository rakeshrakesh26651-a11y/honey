import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCTS, Product } from '../data/content';

interface ProductSectionProps {
  onAddToCart: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({ onAddToCart }) => {
  return (
    <section id="lineup" className="w-full py-20 lg:py-32 bg-[#f7f2e7]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-[640px] mx-auto mb-14 md:mb-16 space-y-4"
        >
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#657044] font-normal block leading-[18.2px]">
            THE HONEY COLLECTION
          </span>
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.1] tracking-[-0.01em]">
            THE HONEY COLLECTION
          </h2>
          <p className="font-sans text-[17px] md:text-[20px] font-normal text-[#1e1a16] leading-[1.5]">
            Discover a selection of honey and natural products from Himalayan Harvest Honey.
          </p>
        </motion.div>

        {/* 5-Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1160px] mx-auto"
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

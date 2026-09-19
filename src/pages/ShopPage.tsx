import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, Product } from '../data/himalayanHarvest';
import { ProductCard } from '../components/ProductCard';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { PageTransition } from '../components/motion/PageTransition';

interface ShopPageProps {
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Full catalogue with all 6 products
  const allProducts: Product[] = PRODUCTS;

  const categories = ['All', 'Honey', 'Ghee'];

  const filteredProducts = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb / Category indicator */}
          <div className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold">OUR HONEY COLLECTION</span>
          </div>

          {/* Editorial Banner */}
          <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#242424] font-semibold">
                AUTHENTIC HIGH-ALTITUDE HARVESTS
              </span>
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="OUR HONEY COLLECTION"
              as="h1"
              className="font-serif text-[36px] sm:text-[48px] md:text-[56px] font-semibold text-[#242424] leading-[1.08] tracking-[-0.015em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-[16px] sm:text-[18px] md:text-[19px] text-[#686863] leading-[1.55]"
            >
              Pure, unpasteurized high-altitude wild honeys and traditional cultured ghee crafted with the dedication of four generations of harvesting.
            </motion.p>

            {/* Category Filter Pills */}
            <div className="pt-4 flex items-center justify-center gap-2.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full font-mono text-[12px] sm:text-[13px] uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#242424] text-[#FAF9F5] shadow-sm font-semibold'
                      : 'bg-[#FAF9F5] text-[#242424] border border-[#D9D7D0] hover:border-[#242424]'
                  }`}
                >
                  {cat === 'All' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-20 max-w-[1360px] mx-auto">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-8 md:p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9D7D0]">
              <div className="space-y-2 px-4 pt-4 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  FREE SHIPPING
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#242424]">
                  On All Orders Above ₹1,000
                </h3>
                <p className="font-sans text-[13px] text-[#686863]">
                  Subsidized ₹50 shipping in Tamil Nadu, ₹100 elsewhere in India for orders under ₹1,000.
                </p>
              </div>

              <div className="space-y-2 px-4 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  100% UNADULTERATED
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#242424]">
                  Tested Under IS 4941 Standards
                </h3>
                <p className="font-sans text-[13px] text-[#686863]">
                  Verified for zero added invert sugar, high specific gravity, and pure enzymatic integrity.
                </p>
              </div>

              <div className="space-y-2 px-4 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  DIRECT ASSISTANCE
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#242424]">
                  WhatsApp Customer Desk
                </h3>
                <p className="font-sans text-[13px] text-[#686863]">
                  Chat with our team directly for custom gift packages, inquiries, or bulk orders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

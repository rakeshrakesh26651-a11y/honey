import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, MOUNTAIN_HONEY_PRODUCT, Product } from '../data/himalayanHarvest';
import { ProductCard } from '../components/ProductCard';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { PageTransition } from '../components/motion/PageTransition';

interface ShopPageProps {
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Include mountain honey in full catalogue
  const allProducts: Product[] = [...PRODUCTS, MOUNTAIN_HONEY_PRODUCT];

  const categories = ['All', 'Honey', 'Ghee'];

  const filteredProducts = activeCategory === 'All'
    ? allProducts
    : allProducts.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <PageTransition>
      <div className="w-full bg-[#F5F1E6] min-h-screen py-10 md:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb / Category indicator */}
          <div className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#607568]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#123C2D] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#123C2D] font-semibold">OUR HONEY COLLECTION</span>
          </div>

          {/* Editorial Banner */}
          <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#123C2D] font-semibold">
                AUTHENTIC HIGH-ALTITUDE HARVESTS
              </span>
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="OUR HONEY COLLECTION"
              as="h1"
              className="font-serif text-[36px] sm:text-[48px] md:text-[56px] font-semibold text-[#123C2D] leading-[1.08] tracking-[-0.015em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans text-[16px] sm:text-[18px] md:text-[19px] text-[#2A2118]/80 leading-[1.55]"
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
                      ? 'bg-[#123C2D] text-[#FAF8F0] shadow-sm font-semibold'
                      : 'bg-[#FAF8F0] text-[#123C2D] border border-[#D9D5C8] hover:border-[#123C2D]'
                  }`}
                >
                  {cat === 'All' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6 md:gap-7 mb-20 max-w-[1180px] mx-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} className="min-h-[460px]">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onNavigate={onNavigate}
                />
              </div>
            ))}
          </div>

          {/* Trust Guarantees */}
          <div className="bg-[#FAF8F0] border border-[#D9D5C8] rounded-[20px] p-8 md:p-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9D5C8]">
              <div className="space-y-2 px-4 pt-4 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#D6A83A] font-bold block">
                  FREE SHIPPING
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#123C2D]">
                  On All Orders Above ₹1,000
                </h3>
                <p className="font-sans text-[13px] text-[#607568]">
                  Subsidized ₹50 shipping in Tamil Nadu, ₹100 elsewhere in India for orders under ₹1,000.
                </p>
              </div>

              <div className="space-y-2 px-4 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#D6A83A] font-bold block">
                  100% UNADULTERATED
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#123C2D]">
                  Tested Under IS 4941 Standards
                </h3>
                <p className="font-sans text-[13px] text-[#607568]">
                  Verified for zero added invert sugar, high specific gravity, and pure enzymatic integrity.
                </p>
              </div>

              <div className="space-y-2 px-4 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#D6A83A] font-bold block">
                  DIRECT ASSISTANCE
                </span>
                <h3 className="font-serif text-[19px] font-semibold text-[#123C2D]">
                  WhatsApp Customer Desk
                </h3>
                <p className="font-sans text-[13px] text-[#607568]">
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

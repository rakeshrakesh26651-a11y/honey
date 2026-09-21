import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, Product } from '../data/himalayanHarvest';
import { ProductCard } from '../components/ProductCard';
import { PageTransition } from '../components/motion/PageTransition';

interface ShopPageProps {
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart, onNavigate }) => {
  // Exactly the 4 verified Himalayan Harvest Honey products
  const products: Product[] = PRODUCTS;

  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-[1360px] mx-auto px-3.5 sm:px-6 md:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 mb-6 sm:mb-8 text-[12px] sm:text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold">SHOP</span>
          </nav>

          {/* Editorial Catalogue Header */}
          <div className="text-center max-w-[760px] mx-auto mb-10 sm:mb-14 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2.5 mb-3"
            >
              <span className="w-3.5 h-[1.5px] bg-[#C9892E]" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-semibold">
                SHOP HIMALAYAN HONEY
              </span>
              <span className="w-3.5 h-[1.5px] bg-[#C9892E]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-[32px] sm:text-[44px] md:text-[54px] font-semibold text-[#242424] leading-[1.08] tracking-[-0.015em] mb-4"
            >
              CHOOSE YOUR HONEY
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-[15px] sm:text-[17px] md:text-[18px] text-[#686863] leading-[1.6]"
            >
              Explore our collection of naturally harvested Himalayan honey.
            </motion.p>
          </div>

          {/* Product Grid:
              Mobile: 2 columns
              Tablet: 2 columns
              Desktop: 4 columns
              No horizontal overflow, generous padding
          */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 md:gap-7 mb-16 sm:mb-20">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onNavigate={onNavigate}
              />
            ))}
          </div>

          {/* Heritage Trust Badges */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[20px] p-6 sm:p-8 md:p-10 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#D9D7D0]">
              <div className="space-y-1.5 px-3 pt-3 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  FREE SHIPPING
                </span>
                <h3 className="font-serif text-[17px] sm:text-[19px] font-semibold text-[#242424]">
                  Orders Above ₹1,000
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#686863]">
                  TN: ₹50 • Other states: ₹100 for orders under ₹1,000.
                </p>
              </div>

              <div className="space-y-1.5 px-3 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  HERITAGE TRADITION
                </span>
                <h3 className="font-serif text-[17px] sm:text-[19px] font-semibold text-[#242424]">
                  4th-Generation Harvesters
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#686863]">
                  Naturally harvested from wild mountain flora, raw and unheated.
                </p>
              </div>

              <div className="space-y-1.5 px-3 pt-6 md:pt-0">
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  DIRECT DESK
                </span>
                <h3 className="font-serif text-[17px] sm:text-[19px] font-semibold text-[#242424]">
                  WhatsApp Assistance
                </h3>
                <p className="font-sans text-[12.5px] sm:text-[13px] text-[#686863]">
                  Connect directly with our team for bulk orders or assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

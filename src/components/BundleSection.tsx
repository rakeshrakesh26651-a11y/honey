import React from 'react';
import { motion } from 'framer-motion';
import { Product, PROMO_OFFER_PRODUCT } from '../data/content';

interface BundleSectionProps {
  onAddToCart: (product: Product) => void;
}

export const BundleSection: React.FC<BundleSectionProps> = ({ onAddToCart }) => {
  return (
    <section id="offers" className="w-full bg-[#c88a2b] text-white py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-[1120px] mx-auto">
          {/* Left Copy Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-[528px] flex flex-col items-start space-y-6"
          >
            {/* Special Offer Pill */}
            <span className="inline-block px-3 py-1 rounded-full bg-[#f2c94c] text-[#1e1a16] font-mono text-[11px] font-normal uppercase tracking-[0.06em]">
              SPECIAL PROMOTION
            </span>

            <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-white leading-[1.1] tracking-[-0.01em]">
              BUY 1 GET 1
            </h2>

            <p className="font-sans text-[17px] md:text-[20px] font-normal text-white/95 leading-[1.5]">
              Limited-time promotional offer on select Himalayan Harvest Honey. Naturally sourced sweetness carried through four generations of harvesting tradition.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onAddToCart(PROMO_OFFER_PRODUCT)}
                className="inline-flex items-center justify-center h-[48px] px-8 rounded-full bg-white text-[#1e1a16] font-sans text-[16px] font-medium transition-all duration-200 hover:bg-[#f7f2e7] transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                CLAIM OFFER — ORDER ON WHATSAPP
              </button>
            </div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:max-w-[528px] flex-shrink-0"
          >
            <div className="relative w-full aspect-[528/586] rounded-[16px] overflow-hidden bg-white/10 shadow-lg group">
              <img
                src="/images/bundle_set.jpg"
                alt="The Himalayan Harvest Honey Tasting Set with wooden dipper"
                className="w-full h-full object-cover rounded-[16px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

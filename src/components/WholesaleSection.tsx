import React from 'react';
import { motion } from 'framer-motion';
import { openWhatsAppWholesale } from '../utils/whatsapp';

export const WholesaleSection: React.FC = () => {
  return (
    <section id="wholesale" className="w-full py-16 lg:py-20 bg-[#f7f2e7] border-t border-[#1e1a16]/[0.08]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#657044] font-normal block leading-[18.2px]">
            FOOD WHOLESALER & BULK ORDERS
          </span>

          <h2 className="font-serif text-[32px] md:text-[44px] font-semibold text-[#1e1a16] leading-[1.1] tracking-[-0.01em]">
            LOOKING FOR HONEY IN BULK?
          </h2>

          <p className="font-sans text-[16px] md:text-[18px] font-normal text-[#1e1a16]/80 leading-[1.6] max-w-[500px] mx-auto">
            For wholesale and bulk enquiries, contact Himalayan Harvest Honey directly.
          </p>

          <div className="pt-3">
            <button
              onClick={openWhatsAppWholesale}
              className="inline-flex items-center justify-center h-[48px] px-8 rounded-full bg-[#1e1a16] hover:bg-[#332c25] text-white font-sans text-[15px] font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
            >
              WHOLESALE ENQUIRY
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

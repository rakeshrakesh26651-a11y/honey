import React from 'react';
import { motion } from 'framer-motion';
import { openWhatsAppWholesale } from '../utils/whatsapp';

export const WholesaleSection: React.FC = () => {
  return (
    <section id="wholesale" className="w-full py-16 lg:py-24 bg-[#08291F] border-t border-[#123C2D]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[640px] mx-auto space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#D6A83A] font-semibold block leading-[18.2px]">
              FOOD WHOLESALER & BULK ORDERS
            </span>
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
          </div>

          <h2 className="font-serif text-[32px] md:text-[46px] font-semibold text-[#FAF8F0] leading-[1.1] tracking-[-0.01em]">
            LOOKING FOR HONEY IN BULK?
          </h2>

          <p className="font-sans text-[16px] md:text-[18px] font-normal text-[#F5F1E6]/85 leading-[1.6] max-w-[500px] mx-auto">
            For wholesale and bulk enquiries, contact Himalayan Harvest Honey directly.
          </p>

          <div className="pt-3">
            <button
              onClick={openWhatsAppWholesale}
              className="inline-flex items-center justify-center h-[50px] px-9 rounded-full bg-[#D6A83A] hover:bg-[#C99528] text-[#08291F] font-sans text-[15px] font-semibold tracking-wider transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
            >
              WHOLESALE ENQUIRY
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

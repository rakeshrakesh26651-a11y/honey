import React from 'react';
import { motion } from 'framer-motion';
import { UGC_IMAGES } from '../data/content';

export const SocialGallery: React.FC = () => {
  return (
    <section id="wild" className="w-full py-16 md:py-24 bg-[#F5F1E6]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header Block */}
        <div className="text-center max-w-[640px] mx-auto mb-10 md:mb-12 space-y-3.5">
          <div className="flex items-center justify-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-[#123C2D] font-medium block leading-[18.2px]">
              @himalayanharvesthoney • 9,592 FOLLOWERS
            </span>
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
          </div>
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#123C2D] leading-[1.1] tracking-[-0.01em]">
            FROM OUR COMMUNITY
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] font-normal text-[#2A2118]/80 leading-[1.5]">
            Follow Himalayan Harvest Honey for product updates, customer experiences and special offers.
          </p>
          <div className="pt-2">
            <a
              href="https://www.instagram.com/himalayanharvesthoney/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[46px] px-8 rounded-full bg-[#123C2D] hover:bg-[#08291F] text-white font-sans text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
            >
              FOLLOW US ON INSTAGRAM
            </a>
          </div>
        </div>

        {/* 6-Photo Grid with 16px gap matching original */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-[1120px] mx-auto"
        >
          {UGC_IMAGES.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-[16px] overflow-hidden bg-white border border-[#D9D5C8] group shadow-2xs"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover rounded-[16px] transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

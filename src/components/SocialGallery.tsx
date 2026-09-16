import React from 'react';
import { motion } from 'framer-motion';
import { UGC_IMAGES } from '../data/content';

export const SocialGallery: React.FC = () => {
  return (
    <section id="wild" className="w-full pb-20 lg:pb-32 bg-[#f7f2e7]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header Block */}
        <div className="text-center max-w-[640px] mx-auto mb-10 md:mb-12 space-y-4">
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#657044] font-normal block leading-[18.2px]">
            @himalayanharvesthoney • 9,592 FOLLOWERS
          </span>
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.1] tracking-[-0.01em]">
            FROM OUR COMMUNITY
          </h2>
          <p className="font-sans text-[16px] md:text-[18px] font-normal text-[#1e1a16]/80 leading-[1.5]">
            Follow Himalayan Harvest Honey for product updates, customer experiences and special offers.
          </p>
          <div className="pt-2">
            <a
              href="https://www.instagram.com/himalayanharvesthoney/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[44px] px-7 rounded-full bg-[#1e1a16] hover:bg-[#332c25] text-white font-sans text-sm font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm"
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
              className="relative aspect-square rounded-[16px] overflow-hidden bg-[#e8e2d5]/40 group"
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

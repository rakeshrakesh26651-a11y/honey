import React from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon } from './Icons';
import { TESTIMONIALS } from '../data/content';

export const Testimonials: React.FC = () => {
  return (
    <section id="reviews" className="w-full py-20 lg:py-32 bg-[#f7f2e7]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-[640px] mx-auto mb-14 md:mb-16 space-y-4"
        >
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#657044] font-normal block leading-[18.2px]">
            CUSTOMER REVIEWS
          </span>
          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.1] tracking-[-0.01em]">
            REAL HONEY.<br className="hidden sm:inline" /> REAL EXPERIENCES.
          </h2>
          <p className="font-sans text-[17px] md:text-[20px] font-normal text-[#1e1a16] leading-[1.5]">
            Genuine customer experiences shared by honey lovers across Tamil Nadu and beyond.
          </p>
        </motion.div>

        {/* Testimonial Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1120px] mx-auto"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between p-[32px] sm:p-[40px_32px] rounded-[16px] bg-white shadow-2xs hover:shadow-xs transition-shadow duration-300 min-h-[246px]"
            >
              <div className="space-y-4">
                <QuoteIcon size={32} color="#657044" />
                <p className="font-sans text-[18px] lg:text-[20px] font-normal text-[#1e1a16] leading-[1.5]">
                  {t.quote}
                </p>
              </div>

              <div className="pt-6 flex items-center justify-between">
                <span className="font-sans text-[16px] font-semibold text-[#1e1a16]">
                  {t.author}
                </span>
                <span className="font-mono text-[13px] font-normal tracking-[0.06em] text-[#1e1a16]/60 uppercase">
                  {t.role}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

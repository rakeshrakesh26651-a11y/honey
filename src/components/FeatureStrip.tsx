import React from 'react';
import { motion } from 'framer-motion';
import { OilDropIcon, SingleOriginIcon, LeafIcon, RecyclableIcon } from './Icons';

export const FeatureStrip: React.FC = () => {
  const features = [
    { id: 'altitudes', label: 'SOURCED FROM HIGH ALTITUDES', line1: 'SOURCED FROM', line2: 'HIGH ALTITUDES', icon: SingleOriginIcon },
    { id: 'pure', label: '100% PURE & NATURAL', line1: '100% PURE &', line2: 'NATURAL', icon: OilDropIcon },
    { id: 'harvested', label: 'NATURALLY HARVESTED', line1: 'NATURALLY', line2: 'HARVESTED', icon: LeafIcon },
    { id: 'additives', label: 'NO ARTIFICIAL ADDITIVES', line1: 'NO ARTIFICIAL', line2: 'ADDITIVES', icon: RecyclableIcon },
  ];

  return (
    <section className="w-full border-t border-b border-[#242424] py-4 sm:py-6 md:py-8 bg-[#242424] overflow-hidden select-none">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10">
        
        {/* Mobile: Compact Horizontal Swipe Carousel */}
        <div className="flex md:hidden overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3 py-1 px-1 -mx-1 scroll-smooth">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex-shrink-0 w-[240px] xs:w-[260px] snap-center flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08]"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 border border-[#DDAA55]/30 flex items-center justify-center flex-shrink-0">
                  <IconComponent size={18} color="#DDAA55" />
                </div>
                <span className="font-sans text-[14px] xs:text-[14.5px] uppercase text-[#F4F1EA] font-medium leading-[1.25] tracking-normal">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: 4-Column Benefit Row */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center space-y-2.5"
              >
                {/* Icon in Circular Badge without numbers */}
                <div className="relative w-11 h-11 rounded-full bg-white/10 border border-[#DDAA55]/30 flex items-center justify-center shadow-xs">
                  <IconComponent size={20} color="#DDAA55" />
                </div>
                {/* Feature Label (14-16px with normal letter spacing) */}
                <div className="flex flex-col items-center">
                  <span className="font-sans text-[14px] lg:text-[15px] uppercase text-[#F4F1EA] font-medium leading-[1.3] tracking-normal">
                    {item.line1}<br />{item.line2}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};


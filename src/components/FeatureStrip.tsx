import React from 'react';
import { motion } from 'framer-motion';
import { OilDropIcon, SingleOriginIcon, LeafIcon, RecyclableIcon } from './Icons';

export const FeatureStrip: React.FC = () => {
  const features = [
    { num: '01', line1: 'SOURCED FROM', line2: 'HIGH ALTITUDES', icon: SingleOriginIcon },
    { num: '02', line1: '100% PURE &', line2: 'NATURAL', icon: OilDropIcon },
    { num: '03', line1: 'NATURALLY', line2: 'HARVESTED', icon: LeafIcon },
    { num: '04', line1: 'NO ARTIFICIAL', line2: 'ADDITIVES', icon: RecyclableIcon },
  ];

  return (
    <section className="w-full border-t border-b border-[#08291F]/40 py-8 md:py-10 bg-[#123C2D]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          {features.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center text-center space-y-2.5"
              >
                {/* Icon in Circular Badge with step number */}
                <div className="relative w-12 h-12 rounded-full bg-white/10 border border-[#D6A83A]/30 flex items-center justify-center shadow-xs">
                  <IconComponent size={22} color="#D6A83A" />
                </div>
                {/* Feature Number & Label */}
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[11px] text-[#D6A83A] tracking-[0.1em] font-semibold mb-0.5">
                    {item.num}
                  </span>
                  <span className="font-mono text-[12px] sm:text-[13px] tracking-[0.06em] uppercase text-[#FAF8F0] font-medium leading-[1.35]">
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

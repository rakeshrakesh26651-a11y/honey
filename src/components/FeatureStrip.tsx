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
    <section className="w-full border-t border-b border-[#1e1a16]/[0.08] py-8 md:py-10 bg-[#f7f2e7]">
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
                <div className="relative w-12 h-12 rounded-full bg-white/80 border border-[#1e1a16]/[0.08] flex items-center justify-center shadow-2xs">
                  <IconComponent size={22} color="#657044" />
                </div>
                {/* Feature Number & Label */}
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[11px] text-[#657044] tracking-[0.08em] font-medium mb-0.5">
                    {item.num}
                  </span>
                  <span className="font-mono text-[13px] tracking-[0.06em] uppercase text-[#1e1a16] font-normal leading-[1.3]">
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

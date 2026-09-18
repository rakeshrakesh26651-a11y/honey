import React from 'react';
import { motion } from 'framer-motion';
import { OilDropIcon } from './Icons';

export const AnnouncementBar: React.FC = () => {
  const itemText = "HIMALAYAN HARVEST HONEY • 100% PURE & NATURAL • NATURALLY HARVESTED • 4TH GENERATION HARVESTERS • WHATSAPP: +91 81243 91725";
  
  // Create an array of 8 repetitions for seamless infinite looping
  const items = Array.from({ length: 8 });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="region"
      aria-label="Announcement"
      className="bg-[#08291F] text-[#FAF8F0] py-2 overflow-hidden select-none border-b border-[#123C2D]"
      style={{ height: '34px', display: 'flex', alignItems: 'center' }}
    >
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {items.map((_, i) => (
          <div key={i} className="flex items-center space-x-6 mx-4">
            <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-wider leading-none font-medium text-[#FAF8F0]">
              {itemText}
            </span>
            <OilDropIcon size={13} color="#D6A83A" className="inline-block opacity-95" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

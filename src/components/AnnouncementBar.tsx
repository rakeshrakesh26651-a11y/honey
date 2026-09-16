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
      className="bg-[#c88a2b] text-white py-2 overflow-hidden select-none border-b border-[#c88a2b]"
      style={{ height: '34px', display: 'flex', alignItems: 'center' }}
    >
      <div className="animate-marquee flex items-center whitespace-nowrap">
        {items.map((_, i) => (
          <div key={i} className="flex items-center space-x-6 mx-4">
            <span className="font-mono text-[13px] uppercase tracking-wide leading-none font-normal text-white">
              {itemText}
            </span>
            <OilDropIcon size={14} color="#ffffff" className="inline-block opacity-90" />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

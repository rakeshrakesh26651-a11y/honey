import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { OilDropIcon } from './Icons';

export const AnnouncementBar: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const itemText = "PURE HIMALAYAN RAW HONEY • FREE DELIVERY OVER ₹1000 • 100% RAW & NATURAL • WHATSAPP: +91 81243 91725";
  
  // Repetitions for seamless infinite looping
  const items = Array.from({ length: 6 });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      role="region"
      aria-label="Announcement"
      className="bg-[#C9892E] text-[#FFFFFF] overflow-hidden select-none border-b border-[#B87B28] h-[28px] sm:h-[32px] flex items-center justify-center px-3"
    >
      {/* Mobile view: Clean static centered announcement line to prevent clipping and jitter */}
      <div className="flex sm:hidden items-center justify-center w-full text-center">
        <span className="font-mono text-[10px] xs:text-[10.5px] uppercase tracking-[0.08em] font-medium text-white truncate">
          FREE DELIVERY OVER ₹1000 • 100% PURE &amp; RAW HONEY
        </span>
      </div>

      {/* Desktop/Tablet view: Smooth non-clipped marquee */}
      <div className="hidden sm:flex items-center w-full overflow-hidden">
        {shouldReduceMotion ? (
          <div className="flex items-center justify-center w-full text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] font-medium text-white">
              {itemText}
            </span>
          </div>
        ) : (
          <div className="animate-marquee flex items-center whitespace-nowrap">
            {items.map((_, i) => (
              <div key={i} className="flex items-center space-x-6 mx-5">
                <span className="font-mono text-[11px] sm:text-[11.5px] uppercase tracking-[0.12em] leading-none font-medium text-[#FFFFFF]">
                  {itemText}
                </span>
                <OilDropIcon size={11} color="#FFFFFF" className="inline-block opacity-90" />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};


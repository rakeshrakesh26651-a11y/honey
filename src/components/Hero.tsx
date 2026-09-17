import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onShopClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Subtle scroll-linked movement: image y = 0 -> -40
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Easing curve: expo.out / power3.out
  const transitionEase = [0.16, 1, 0.3, 1];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#08291F] text-[#FAF8F0] overflow-hidden py-14 sm:py-16 md:py-20 lg:py-24 border-b border-[#123C2D]"
    >
      {/* Subtle organic ambient glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#D6A83A]/[0.08] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 rounded-full bg-[#123C2D]/40 blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left: Copy Column */}
          <div className="w-full lg:max-w-[540px] flex flex-col items-start space-y-6">
            {/* 3. Hero eyebrow reveals */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: transitionEase }}
              className="flex items-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
              <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-[#D6A83A] font-medium leading-[18.2px]">
                FROM THE HIMALAYAS
              </span>
            </motion.div>

            {/* 4. Hero heading reveals line-by-line with mask / clip reveal */}
            <h1 className="font-serif text-[42px] sm:text-[54px] lg:text-[70px] font-semibold text-[#FAF8F0] leading-[1.05] tracking-[-0.02em]">
              <div className="overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.32, ease: transitionEase }}
                >
                  PURE BY NATURE.
                </motion.span>
              </div>
              <div className="overflow-hidden pb-1">
                <motion.span
                  className="block text-white"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.44, ease: transitionEase }}
                >
                  PERFECTED BY THE PEAKS.
                </motion.span>
              </div>
            </h1>

            {/* 5. Hero paragraph reveals */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.58, ease: transitionEase }}
              className="font-sans text-[17px] sm:text-[19px] lg:text-[20px] font-normal text-[#F5F1E6]/85 leading-[1.55] max-w-[480px]"
            >
              Discover Himalayan Harvest Honey — naturally sourced honey presented with a heritage of four generations of honey harvesting.
            </motion.p>

            {/* 6. CTA buttons reveal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.72, ease: transitionEase }}
              className="pt-2 flex flex-wrap items-center gap-3.5"
            >
              <a
                href="#lineup"
                onClick={onShopClick}
                className="inline-flex items-center justify-center h-[50px] px-8 rounded-full bg-[#D6A83A] hover:bg-[#C99528] text-[#08291F] font-sans text-[15px] sm:text-[16px] font-semibold tracking-wide transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
              >
                SHOP HONEY
              </a>
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20pure%20honey%20products%20and%20offers."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[50px] px-7 rounded-full border border-white/25 bg-white/5 hover:bg-white/10 hover:border-[#D6A83A] text-[#FAF8F0] font-sans text-[15px] font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                ORDER ON WHATSAPP
              </a>
            </motion.div>
          </div>

          {/* 7. Right: Hero Product Imagery reveals with scale/mask and scroll parallax */}
          <div className="w-full lg:max-w-[528px] flex-shrink-0">
            <motion.div
              style={{ y: imageY }}
              className="relative w-full aspect-[528/621] sm:max-h-[621px] rounded-[16px] overflow-hidden bg-[#0B3327]/60 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] group"
            >
              <motion.img
                src="/images/hero_honey_jar.jpg"
                alt="Himalayan Harvest pure raw honey jar on a warm backdrop"
                className="w-full h-full object-cover rounded-[16px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                style={{ objectPosition: 'center center' }}
                loading="eager"
                initial={{ scale: 1.08, opacity: 0.85 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: 0.25, ease: transitionEase }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

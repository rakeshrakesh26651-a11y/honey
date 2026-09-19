import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HeroProps {
  onShopClick?: () => void;
  onNavigate?: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onNavigate }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startVideo = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay policy fallback
          });
        }
      }
    };

    try {
      video.currentTime = 0;
    } catch {
      // ignore
    }

    // Start immediately
    startVideo();

    // Also trigger as soon as initial frame data or buffer is ready
    video.addEventListener('loadeddata', startVideo, { once: true });
    video.addEventListener('canplay', startVideo, { once: true });

    return () => {
      video.removeEventListener('loadeddata', startVideo);
      video.removeEventListener('canplay', startVideo);
    };
  }, []);

  // Senior art-directed luxury easing curve
  const transitionEase = [0.16, 1, 0.3, 1];

  const handleShop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onShopClick) {
      onShopClick();
    } else if (onNavigate) {
      onNavigate('/shop');
    }
  };

  return (
    <section
      aria-label="Himalayan Harvest Honey Hero"
      className="relative w-full bg-[#242424] text-[#FAF9F5] overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 min-h-[600px] lg:min-h-[700px] flex items-center border-b border-[#333333]"
    >
      {/* =========================================================================
          1. LOCKED BACKGROUND VIDEO LAYER (PRESERVED EXACTLY AS APPROVED)
          ========================================================================= */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/himalayan-honey-hero.jpg"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        aria-hidden="true"
      >
        <source
          src="/videos/himalayan-honey-hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* =========================================================================
          2. ATMOSPHERIC OVERLAYS (PRESERVING COMPLETE VIDEO CLARITY ON RIGHT)
          ========================================================================= */}
      {/* Desktop overlay: subtle warm espresso gradient on left behind editorial column, transparent across center & right */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(20, 18, 15, 0.88) 0%, rgba(20, 18, 15, 0.70) 28%, rgba(20, 18, 15, 0.35) 46%, rgba(20, 18, 15, 0.00) 64%)',
        }}
      />

      {/* Mobile/Tablet overlay: subtle vertical vignette for text readability */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(20, 18, 15, 0.88) 0%, rgba(20, 18, 15, 0.65) 48%, rgba(20, 18, 15, 0.38) 100%)',
        }}
      />

      {/* =========================================================================
          3. FOREGROUND EDITORIAL CONTENT (LEFT-ALIGNED COLUMN ONLY)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="w-full lg:max-w-[500px] xl:max-w-[540px] flex flex-col items-start text-left">
          
          {/* Eyebrow: NATURE'S FINEST */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: transitionEase }}
            className="flex items-center gap-3 mb-6 sm:mb-7 select-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          >
            <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.16em] text-[#DDAA55] font-semibold">
              NATURE'S FINEST
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[#C9892E]/70 inline-block" />
          </motion.div>

          {/* Main Heading: Pure Honey. */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: transitionEase }}
            className="w-full mb-3 sm:mb-4 drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]"
          >
            <h1 className="font-serif font-bold text-[#FAF9F5] text-[44px] xs:text-[52px] sm:text-[66px] md:text-[76px] lg:text-[84px] xl:text-[88px] leading-[1.04] tracking-[-0.02em] select-text">
              Pure Honey.
            </h1>
          </motion.div>

          {/* Subheading: From the Himalayas. */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: transitionEase }}
            className="w-full mb-6 sm:mb-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            <h2 className="font-serif italic text-[22px] sm:text-[28px] md:text-[34px] lg:text-[36px] text-[#DDAA55] font-normal tracking-[-0.01em] select-text leading-tight">
              From the Himalayas.
            </h2>
          </motion.div>

          {/* Body Paragraph */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: transitionEase }}
            className="font-sans text-[16px] sm:text-[17px] lg:text-[18px] font-normal text-[#F4F1EA]/90 leading-[1.62] max-w-[460px] mb-8 sm:mb-9 select-text drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]"
          >
            Discover Himalayan Harvest Honey — naturally sourced raw honey presented with the pride and purity of four generations of harvesting tradition.
          </motion.p>

          {/* CTA Buttons: Horizontal on desktop, stacked on mobile */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: transitionEase }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8 sm:mb-10 w-full sm:w-auto"
          >
            {/* Primary CTA: SHOP HONEY → */}
            <a
              href="/shop"
              onClick={handleShop}
              className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] sm:text-[16px] font-bold tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-md cursor-pointer group text-center whitespace-nowrap"
            >
              <span>SHOP HONEY</span>
              <span className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>

            {/* Secondary CTA: ORDER ON WHATSAPP */}
            <a
              href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20pure%20honey%20products%20and%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-[#FAF9F5]/40 bg-[#242424]/60 backdrop-blur-sm hover:bg-[#242424]/85 hover:border-[#DDAA55] text-[#FAF9F5] font-sans text-[15px] font-medium transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center whitespace-nowrap"
            >
              ORDER ON WHATSAPP
            </a>
          </motion.div>

          {/* Trust Row: Clean and aligned on desktop, wraps naturally on mobile */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: transitionEase }}
            className="w-full max-w-[620px] pt-5 sm:pt-6 border-t border-white/20 select-text"
          >
            <div className="inline-flex flex-wrap lg:flex-nowrap items-center gap-x-4 sm:gap-x-5 gap-y-2 py-2 px-3.5 sm:px-4 lg:p-0 rounded-xl lg:rounded-none bg-black/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none text-[#FAF9F5]">
              <div className="flex items-center gap-2 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                <span className="text-[#DDAA55] text-[10px] leading-none select-none">○</span>
                <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#FAF9F5] font-medium">
                  100% RAW &amp; UNHEATED
                </span>
              </div>
              <span className="hidden sm:inline-block w-[1px] h-3.5 bg-white/30" />
              <div className="flex items-center gap-2 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                <span className="text-[#DDAA55] text-[10px] leading-none select-none">○</span>
                <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#FAF9F5] font-medium">
                  4TH-GEN HARVESTERS
                </span>
              </div>
              <span className="hidden sm:inline-block w-[1px] h-3.5 bg-white/30" />
              <div className="flex items-center gap-2 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]">
                <span className="text-[#DDAA55] text-[10px] leading-none select-none">○</span>
                <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.08em] text-[#FAF9F5] font-medium">
                  LAB CERTIFIED IS 4941
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

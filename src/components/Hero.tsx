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

  // Luxury easing curve
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
      className="relative w-full bg-[#242424] text-[#FAF9F5] overflow-hidden py-16 sm:py-20 md:py-24 lg:py-28 min-h-[600px] lg:min-h-[680px] flex items-center border-b border-[#333333]"
    >
      {/* 1. Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/himalayan-honey-hero.jpg"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        aria-hidden="true"
      >
        <source
          src="/videos/himalayan-honey-hero.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Warm Espresso Overlay (Preserving Video Clarity) */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(36, 36, 36, 0.65) 0%, rgba(36, 36, 36, 0.38) 40%, rgba(36, 36, 36, 0.10) 70%, rgba(36, 36, 36, 0.00) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(36, 36, 36, 0.68) 0%, rgba(36, 36, 36, 0.42) 45%, rgba(36, 36, 36, 0.18) 100%)',
        }}
      />

      {/* 3. Hero Content Layer */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 md:px-10">
        <div className="w-full lg:max-w-[580px] flex flex-col items-start space-y-6">
          {/* Eyebrow / Label (0.2s) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: transitionEase }}
            className="flex items-center gap-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]"
          >
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.1em] text-[#DDAA55] font-medium leading-[18px]">
              100% PURE & RAW
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: transitionEase }}
            className="w-full drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
          >
            <h1 className="font-serif text-[40px] xs:text-[46px] sm:text-[60px] md:text-[76px] lg:text-[88px] xl:text-[92px] font-bold text-[#FAF9F5] leading-[1.06] tracking-normal select-text">
              Pure Honey.
            </h1>
          </motion.div>

          {/* Subheading (0.7s) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7, ease: transitionEase }}
            className="flex items-center gap-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
          >
            <span className="w-6 sm:w-8 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-serif text-[22px] sm:text-[28px] md:text-[34px] font-medium text-[#DDAA55] tracking-[-0.01em] select-text">
              From the Himalayas.
            </span>
          </motion.div>

          {/* Description (1.0s) */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: transitionEase }}
            className="font-sans text-[17px] sm:text-[19px] lg:text-[20px] font-normal text-[#F4F1EA] leading-[1.55] max-w-[500px] select-text drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]"
          >
            Discover Himalayan Harvest Honey — naturally sourced raw honey presented with the pride and purity of four generations of harvesting tradition.
          </motion.p>

          {/* CTA Buttons (1.3s) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3, ease: transitionEase }}
            className="pt-2 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="/shop"
              onClick={handleShop}
              className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] sm:text-[16px] font-bold tracking-wide transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer"
            >
              SHOP HONEY
            </a>
            <a
              href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20pure%20honey%20products%20and%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[52px] px-7 rounded-full border border-white/25 bg-[#242424]/50 backdrop-blur-sm hover:bg-[#242424]/75 hover:border-[#DDAA55] text-[#FAF9F5] font-sans text-[15px] font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              ORDER ON WHATSAPP
            </a>
          </motion.div>

          {/* Trust / Quality Badges (1.5s) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 1.5, ease: transitionEase }}
            className="pt-4 flex flex-wrap items-center gap-6 border-t border-white/20 w-full select-text drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDAA55]" />
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#FAF9F5]/85">
                100% Raw & Unheated
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDAA55]" />
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#FAF9F5]/85">
                4th-Gen Harvesters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DDAA55]" />
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#FAF9F5]/85">
                Lab Certified IS 4941
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


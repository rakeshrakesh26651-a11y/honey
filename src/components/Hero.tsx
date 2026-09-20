import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface HeroProps {
  onShopClick?: () => void;
  onNavigate?: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopClick, onNavigate }) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Subtle scroll-linked video parallax & scale
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.08]);
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);

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

  // Cinematic luxury easing curve
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  const revealUp = (delay: number, distance: number = 18) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.75,
      delay,
      ease: easeCurve,
    },
  });

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
      ref={containerRef}
      aria-label="Himalayan Harvest Honey Hero"
      className="relative w-full bg-[#141210] text-[#FAF9F5] overflow-hidden min-h-[520px] sm:min-h-[600px] lg:min-h-[82vh] xl:min-h-[86vh] flex items-center border-b border-white/[0.08]"
    >
      {/* =========================================================================
          1. LOCKED BACKGROUND VIDEO LAYER WITH SCROLL PARALLAX (VIDEO SOURCE UNCHANGED)
          ========================================================================= */}
      <motion.div
        style={shouldReduceMotion ? undefined : { scale: videoScale, y: videoY }}
        className="absolute inset-[-3%] w-[106%] h-[106%] pointer-events-none select-none"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/himalayan-honey-hero.jpg"
          className="w-full h-full object-cover pointer-events-none select-none"
          aria-hidden="true"
        >
          <source
            src="/videos/himalayan-honey-hero.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* =========================================================================
          2. ATMOSPHERIC OVERLAYS (SUBTLE WARM CHARCOAL — NO GREEN, NO HEAVY GRADIENTS)
          ========================================================================= */}
      {/* Desktop Overlay: Left-weighted warm dark gradient for editorial contrast */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(90deg, rgba(18, 16, 14, 0.88) 0%, rgba(18, 16, 14, 0.72) 35%, rgba(18, 16, 14, 0.35) 58%, rgba(18, 16, 14, 0.08) 85%, transparent 100%)',
        }}
      />

      {/* Mobile/Tablet Overlay: Warm charcoal scrim tuned for high readability */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(16, 14, 12, 0.86) 0%, rgba(16, 14, 12, 0.72) 42%, rgba(16, 14, 12, 0.84) 100%)',
        }}
      />

      {/* Subtle bottom fade transition */}
      <div
        className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(18, 16, 14, 0.55) 100%)',
        }}
      />

      {/* =========================================================================
          3. EDITORIAL HERO CONTENT
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-24">
        <div className="w-full lg:max-w-[520px] xl:max-w-[560px] flex flex-col items-start text-left">
          
          {/* Tag: HIMALAYAN HARVEST */}
          <motion.div
            {...revealUp(0.08, 12)}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#181614]/60 border border-white/[0.12] backdrop-blur-md mb-3.5 sm:mb-4 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#DDAA55]" />
            <span className="font-mono text-[10px] xs:text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.14em] text-[#FAF9F5]/90 font-medium">
              HIMALAYAN HARVEST · 100% PURE
            </span>
          </motion.div>

          {/* Main Heading: Pure Honey. */}
          <motion.div
            {...revealUp(0.18, 22)}
            className="w-full mb-1 sm:mb-2"
          >
            <h1 className="font-serif text-[#FAF9F5] text-[40px] xs:text-[46px] sm:text-[62px] md:text-[76px] lg:text-[88px] xl:text-[96px] leading-[0.98] sm:leading-[0.95] tracking-[-0.03em] font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] select-text">
              Pure Honey.
            </h1>
          </motion.div>

          {/* Subheading: From the Himalayas. */}
          <motion.div
            {...revealUp(0.28, 18)}
            className="w-full mb-3 sm:mb-4"
          >
            <p className="font-serif italic text-[18px] xs:text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px] text-[#DDAA55] font-normal tracking-[-0.01em] leading-tight select-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
              From the Himalayas.
            </p>
          </motion.div>

          {/* Minimal Supporting Text */}
          <motion.div
            {...revealUp(0.38, 16)}
            className="w-full mb-5 sm:mb-7"
          >
            <p className="font-sans text-[13px] xs:text-[13.5px] sm:text-[15px] lg:text-[16px] text-[#FAF9F5]/75 leading-[1.6] max-w-[290px] xs:max-w-[340px] sm:max-w-[420px] lg:max-w-[460px] select-text drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] font-normal">
              Raw, single-origin honey harvested across four generations of Himalayan beekeepers. Unfiltered, unheated, and bottled at source.
            </p>
          </motion.div>

          {/* Compact Premium CTA Buttons */}
          <motion.div
            {...revealUp(0.48, 16)}
            className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3.5 mb-6 sm:mb-8 w-full xs:w-auto max-w-[280px] xs:max-w-none"
          >
            {/* Primary CTA: SHOP HONEY → */}
            <a
              href="/shop"
              onClick={handleShop}
              className="inline-flex items-center justify-center h-[42px] xs:h-[44px] sm:h-[46px] px-5 sm:px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#1D1B18] font-sans text-[12.5px] xs:text-[13px] sm:text-[13.5px] font-semibold tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_2px_10px_rgba(201,137,46,0.3)] hover:shadow-[0_4px_16px_rgba(201,137,46,0.4)] cursor-pointer group text-center whitespace-nowrap"
            >
              <span>SHOP HONEY</span>
              <span className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1 font-mono text-[12px]">→</span>
            </a>

            {/* Secondary CTA: ORDER ON WHATSAPP */}
            <a
              href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20pure%20honey%20products%20and%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-[40px] xs:h-[42px] sm:h-[46px] px-4.5 sm:px-5.5 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/35 backdrop-blur-md text-[#FAF9F5]/90 font-sans text-[12px] xs:text-[12.5px] sm:text-[13px] font-medium tracking-wide uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center whitespace-nowrap"
            >
              ORDER ON WHATSAPP
            </a>
          </motion.div>

          {/* Clean Trust Indicators */}
          <motion.div
            {...revealUp(0.58, 14)}
            className="w-full max-w-[560px] pt-3.5 sm:pt-4 border-t border-white/10 select-text"
          >
            <div className="flex flex-wrap items-center gap-x-3.5 sm:gap-x-5 gap-y-1.5 text-[#FAF9F5]/75">
              <div className="flex items-center gap-1.5 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                <span className="font-mono text-[9.5px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#FAF9F5]/85 font-medium">
                  100% RAW &amp; UNHEATED
                </span>
              </div>
              
              <span className="hidden xs:inline-block text-white/25 text-[10px]">•</span>

              <div className="flex items-center gap-1.5 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                <span className="font-mono text-[9.5px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#FAF9F5]/85 font-medium">
                  4TH-GEN HARVESTERS
                </span>
              </div>

              <span className="hidden sm:inline-block text-white/25 text-[10px]">•</span>

              <div className="flex items-center gap-1.5 whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                <span className="font-mono text-[9.5px] xs:text-[10px] sm:text-[11px] uppercase tracking-[0.08em] text-[#FAF9F5]/85 font-medium">
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

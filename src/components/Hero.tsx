import React, { useRef, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { WhatsAppIcon } from './Icons';

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
      className="relative w-full bg-[#141210] text-[#FAF9F5] overflow-hidden min-h-[500px] xs:min-h-[540px] sm:min-h-[620px] lg:min-h-[82vh] xl:min-h-[86vh] flex items-center border-b border-white/[0.08]"
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
          className="w-full h-full object-cover object-[72%_center] sm:object-[65%_center] lg:object-center pointer-events-none select-none"
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

      {/* Mobile/Tablet Overlay: Strong bottom-to-top / 70% dark scrim for high contrast readability */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(180deg, rgba(18, 16, 14, 0.70) 0%, rgba(18, 16, 14, 0.65) 30%, rgba(18, 16, 14, 0.84) 75%, rgba(18, 16, 14, 0.95) 100%)',
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
          3. EDITORIAL HERO CONTENT (IDENTICAL HIERARCHY & COMPOSITION)
          ========================================================================= */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-24">
        <div className="w-full lg:max-w-[540px] xl:max-w-[580px] flex flex-col items-start text-left">
          
          {/* Tag: NATURE'S FINEST */}
          <motion.div
            {...revealUp(0.08, 12)}
            className="flex items-center gap-2 mb-2 sm:mb-3 select-none"
          >
            <span className="font-mono text-[10px] xs:text-[11px] sm:text-[12px] uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#DDAA55] font-semibold">
              NATURE'S FINEST
            </span>
            <span className="w-6 sm:w-8 h-[1px] bg-[#DDAA55]/60" />
          </motion.div>

          {/* Main Heading: Pure Honey. */}
          <motion.div
            {...revealUp(0.18, 22)}
            className="w-full mb-0.5 sm:mb-1"
          >
            <h1 className="font-serif text-[#FAF9F5] text-[38px] xs:text-[44px] sm:text-[62px] md:text-[76px] lg:text-[88px] xl:text-[96px] leading-[0.98] sm:leading-[0.95] tracking-[-0.03em] font-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] select-text">
              Pure Honey.
            </h1>
          </motion.div>

          {/* Subheading: From the Himalayas. */}
          <motion.div
            {...revealUp(0.28, 18)}
            className="w-full mb-2.5 sm:mb-4"
          >
            <p className="font-serif italic text-[18px] xs:text-[21px] sm:text-[26px] md:text-[28px] lg:text-[34px] text-[#DDAA55] font-normal tracking-[-0.01em] leading-tight select-text drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              From the Himalayas.
            </p>
          </motion.div>

          {/* Minimal Supporting Text (Max 2 lines on mobile) */}
          <motion.div
            {...revealUp(0.38, 16)}
            className="w-full mb-4 sm:mb-7"
          >
            <p className="font-sans text-[13px] xs:text-[13.5px] sm:text-[15px] lg:text-[16px] text-[#FAF9F5]/90 leading-[1.5] max-w-[340px] sm:max-w-[440px] lg:max-w-[480px] select-text drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] font-normal line-clamp-2 sm:line-clamp-none">
              Raw, unheated high-altitude honey rooted in four generations of harvesting tradition.
            </p>
          </motion.div>

          {/* Compact Premium CTA Buttons (Side-by-Side on Mobile & Desktop) */}
          <motion.div
            {...revealUp(0.48, 16)}
            className="flex flex-row flex-wrap items-center gap-2 xs:gap-3 sm:gap-3.5 mb-3 sm:mb-4"
          >
            {/* Primary CTA: SHOP HONEY → */}
            <a
              href="/shop"
              onClick={handleShop}
              className="inline-flex items-center justify-center h-[38px] xs:h-[42px] sm:h-[46px] px-4 xs:px-5 sm:px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#1D1B18] font-sans text-[11px] xs:text-[12px] sm:text-[13.5px] font-bold tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_2px_10px_rgba(201,137,46,0.3)] hover:shadow-[0_4px_16px_rgba(201,137,46,0.4)] cursor-pointer group text-center whitespace-nowrap"
            >
              <span>SHOP HONEY</span>
              <span className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1 font-mono text-[11px] xs:text-[12px]">→</span>
            </a>

            {/* Secondary CTA: ORDER ON WHATSAPP (Outline with WhatsApp icon) */}
            <a
              href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20know%20more%20about%20your%20pure%20honey%20products%20and%20offers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 h-[38px] xs:h-[42px] sm:h-[46px] px-3.5 xs:px-4.5 sm:px-5.5 rounded-full border border-white/35 bg-[#181614]/60 hover:bg-[#181614]/90 hover:border-white/60 text-[#FAF9F5] font-sans text-[10.5px] xs:text-[11.5px] sm:text-[13px] font-semibold tracking-wide uppercase transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-center whitespace-nowrap"
            >
              <WhatsAppIcon size={15} color="#25D366" className="inline-block flex-shrink-0" />
              <span>ORDER ON WHATSAPP</span>
            </a>
          </motion.div>

          {/* Subtle Free Delivery Note */}
          <motion.div
            {...revealUp(0.56, 12)}
            className="flex items-center gap-1.5 text-[#FAF9F5]/75 text-[11px] xs:text-[12px] sm:text-[12.5px] font-sans font-normal select-text drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E] inline-block" />
            <span>Free delivery on orders over ₹1,000</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


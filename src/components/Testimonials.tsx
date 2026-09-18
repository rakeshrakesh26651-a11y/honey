import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion';
import { TESTIMONIALS, Testimonial } from '../data/himalayanHarvest';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const containerRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const totalReviews = TESTIMONIALS.length;
  const activeTestimonial: Testimonial = TESTIMONIALS[activeIndex] || TESTIMONIALS[0];

  // Calculate previous and next customer indices for layered side previews
  const prevIndex = (activeIndex - 1 + totalReviews) % totalReviews;
  const nextIndex = (activeIndex + 1) % totalReviews;
  const prevTestimonial = TESTIMONIALS[prevIndex];
  const nextTestimonial = TESTIMONIALS[nextIndex];

  // Screen size detection for disabling parallax on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Autoplay (5.5s) with pause on hover/drag
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion, handleNext]);

  // Mouse Parallax on Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMobile || shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseOffset({ x: x * 8, y: y * 8 });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setMouseOffset({ x: 0, y: 0 });
  };

  // Touch swipe support on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  // Drag handler on Desktop/Tablet
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
    setIsPaused(false);
  };

  // Image Stack Transition Variants matching specifications
  const imageVariants = {
    enter: (dir: number) => ({
      scale: shouldReduceMotion ? 1 : 1.08,
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 60 : -60,
      rotate: shouldReduceMotion ? 0 : dir > 0 ? 2 : -2,
    }),
    center: {
      scale: 1,
      opacity: 1,
      x: 0,
      rotate: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (dir: number) => ({
      scale: shouldReduceMotion ? 1 : 0.92,
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -60 : 60,
      rotate: shouldReduceMotion ? 0 : dir > 0 ? -2 : 2,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section
      id="reviews"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Customer Testimonials"
      className="relative w-full py-20 sm:py-24 lg:py-32 bg-[#F5F1E6] overflow-hidden select-none border-t border-[#D9D5C8]"
    >
      {/* Background Decorative Parallax Watermark Quote & Ambient Glow */}
      <motion.div
        style={
          !isMobile && !shouldReduceMotion
            ? { x: -mouseOffset.x * 0.5, y: -mouseOffset.y * 0.5 }
            : undefined
        }
        className="absolute -top-12 -right-8 font-serif text-[280px] sm:text-[380px] leading-none text-[#123C2D]/[0.03] select-none pointer-events-none transition-transform duration-300"
      >
        “
      </motion.div>

      <div className="absolute top-1/3 -left-36 w-[480px] h-[480px] rounded-full bg-[#D6A83A]/[0.08] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-[480px] h-[480px] rounded-full bg-[#123C2D]/[0.07] blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        {/* Section Header with Staggered Mask Reveal */}
        <div className="text-center max-w-[780px] mx-auto mb-12 sm:mb-16 md:mb-20 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-5 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#123C2D] font-medium">
              CUSTOMER STORIES
            </span>
            <span className="w-5 h-[1.5px] bg-[#D6A83A] inline-block" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="font-serif text-[34px] sm:text-[46px] md:text-[54px] font-semibold text-[#123C2D] leading-[1.08] tracking-[-0.015em]"
            >
              WHAT OUR CUSTOMERS
              <br />
              SAY ABOUT US.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[15.5px] sm:text-[17.5px] md:text-[18.5px] font-normal text-[#2A2118]/80 leading-[1.5] max-w-[620px] mx-auto pt-1"
          >
            Genuine reflections from families across South India embracing the unprocessed purity of high-altitude harvesting.
          </motion.p>
        </div>

        {/* Cinematic Testimonial Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-[1240px] mx-auto">
          {/* ====================================================
              LEFT: LAYERED IMAGE STACK WITH SIDE PREVIEWS
              ==================================================== */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Stage wrapper with parallax offset */}
            <motion.div
              style={
                !isMobile && !shouldReduceMotion
                  ? { x: mouseOffset.x * 0.9, y: mouseOffset.y * 0.9 }
                  : undefined
              }
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] flex items-center justify-center transition-transform duration-200"
            >
              {/* Subtle Decorative Circular Border Accent behind active image */}
              <div className="absolute inset-0 -m-3 sm:-m-4 rounded-[32px] border border-[#D6A83A]/30 pointer-events-none scale-102" />

              {/* Behind Stage 1: Previous Customer Portrait Preview (Left/Top) */}
              {prevTestimonial && (
                <div
                  onClick={handlePrev}
                  title={`View ${prevTestimonial.author}'s review`}
                  className="hidden sm:block absolute top-0 -left-6 sm:-left-9 w-[86%] h-[86%] rounded-[22px] overflow-hidden opacity-35 hover:opacity-55 transition-all duration-500 cursor-pointer filter blur-[1.5px] -rotate-4 z-0 shadow-sm"
                >
                  <img
                    src={prevTestimonial.image}
                    alt={prevTestimonial.author}
                    className="w-full h-full object-cover grayscale-[20%]"
                  />
                  <div className="absolute inset-0 bg-[#08291F]/30" />
                </div>
              )}

              {/* Behind Stage 2: Next Customer Portrait Preview (Right/Bottom) */}
              {nextTestimonial && (
                <div
                  onClick={handleNext}
                  title={`View ${nextTestimonial.author}'s review`}
                  className="hidden sm:block absolute bottom-0 -right-6 sm:-right-9 w-[86%] h-[86%] rounded-[22px] overflow-hidden opacity-40 hover:opacity-60 transition-all duration-500 cursor-pointer filter blur-[1px] rotate-4 z-0 shadow-sm"
                >
                  <img
                    src={nextTestimonial.image}
                    alt={nextTestimonial.author}
                    className="w-full h-full object-cover grayscale-[15%]"
                  />
                  <div className="absolute inset-0 bg-[#08291F]/25" />
                </div>
              )}

              {/* Active Customer Portrait Card (Foreground z-20) */}
              <div className="relative w-full h-full z-20">
                <AnimatePresence custom={direction} mode="popLayout">
                  <motion.div
                    key={`active-portrait-${activeTestimonial.id}`}
                    custom={direction}
                    variants={imageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.25}
                    onDragEnd={handleDragEnd}
                    className="w-full h-full rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(18,60,45,0.18)] border-2 border-[#D6A83A]/70 bg-[#EDE8DC] relative cursor-grab active:cursor-grabbing"
                  >
                    {/* Character Image Motion: Subtle continuous breathing life */}
                    <motion.img
                      src={activeTestimonial.image}
                      alt={`Fictional editorial portrait representing ${activeTestimonial.author}`}
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : { scale: [1, 1.025, 1] }
                      }
                      transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-full h-full object-cover object-center will-change-transform"
                      loading="eager"
                    />

                    {/* Rich Cinematic Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08291F]/60 via-[#08291F]/15 to-transparent pointer-events-none" />

                    {/* Location Badge (Top Left) */}
                    {activeTestimonial.location && (
                      <div className="absolute top-4 left-4 z-30">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08291F]/80 backdrop-blur-md text-[#FAF8F0] font-mono text-[11px] uppercase tracking-wider shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D6A83A]" />
                          {activeTestimonial.location}
                        </span>
                      </div>
                    )}

                    {/* 5-Star Rating Overlay (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 z-30 flex items-center space-x-1 text-[#D6A83A]">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 drop-shadow-md"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Verification Pill (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 z-30 hidden sm:block">
                      <span className="font-mono text-[10px] font-semibold text-[#FAF8F0]/90 uppercase tracking-widest bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        VERIFIED
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ====================================================
              RIGHT: LARGE TESTIMONIAL QUOTE & DETAILS
              ==================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6 lg:pl-4">
            {/* Animated Large Quote with Blur & Slide Transitions */}
            <div className="relative min-h-[140px] sm:min-h-[160px] flex items-center">
              <span className="font-serif text-[60px] sm:text-[80px] leading-none text-[#D6A83A]/25 absolute -top-8 sm:-top-10 -left-6 select-none pointer-events-none">
                “
              </span>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`quote-${activeTestimonial.id}`}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 30, filter: 'blur(5px)' }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                  }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -25, filter: 'blur(5px)' }
                  }
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={
                    !isMobile && !shouldReduceMotion
                      ? { x: mouseOffset.x * 0.35, y: mouseOffset.y * 0.35 }
                      : undefined
                  }
                  className="font-serif text-[22px] sm:text-[28px] md:text-[32px] lg:text-[34px] font-normal text-[#123C2D] leading-[1.35] tracking-[-0.01em] relative z-10"
                >
                  "{activeTestimonial.quote}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Separately Animated Customer Name & Role */}
            <div className="pt-6 border-t border-[#D9D5C8]/80">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`name-${activeTestimonial.id}`}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-sans text-[20px] sm:text-[23px] font-bold text-[#123C2D] tracking-tight">
                      {activeTestimonial.author}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-sans text-[13px] sm:text-[14px] text-[#607568]">
                        {activeTestimonial.location || 'South India'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#D6A83A]" />
                      <span className="font-mono text-[11px] font-semibold text-[#123C2D] uppercase tracking-wider">
                        {activeTestimonial.role || 'VERIFIED EXPERIENCE'}
                      </span>
                    </div>
                  </div>

                  {/* Botanical Quality Insignia */}
                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#123C2D]/5 border border-[#123C2D]/10">
                    <span className="w-2 h-2 rounded-full bg-[#D6A83A]" />
                    <span className="font-mono text-[10.5px] font-semibold tracking-wider text-[#123C2D] uppercase">
                      Himalayan Harvest
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ====================================================
                BOTTOM CONTROLS: PREVIOUS, PROGRESS & NEXT
                ==================================================== */}
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Previous / Next Circular Arrow Controls */}
              <div className="flex items-center gap-3">
                {/* Previous Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous testimonial"
                  className="group w-12 h-12 rounded-full bg-[#FAF8F0] border border-[#D9D5C8] hover:bg-[#123C2D] hover:text-[#FAF8F0] hover:border-[#123C2D] text-[#123C2D] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D6A83A]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>

                {/* Next Arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next testimonial"
                  className="group w-12 h-12 rounded-full bg-[#FAF8F0] border border-[#D9D5C8] hover:bg-[#123C2D] hover:text-[#FAF8F0] hover:border-[#123C2D] text-[#123C2D] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D6A83A]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Progress Bar & Jump Dots */}
              <div className="flex-1 max-w-[320px] flex flex-col gap-2">
                {/* Autoplay Animated Progress Bar */}
                <div className="w-full h-1 bg-[#D9D5C8]/80 rounded-full overflow-hidden">
                  <motion.div
                    key={`progress-${activeIndex}-${isPaused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? '0%' : '100%' }}
                    transition={{
                      duration: 5.5,
                      ease: 'linear',
                    }}
                    className="h-full bg-[#123C2D]"
                  />
                </div>

                {/* Jump Dots with active index indicator */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                        aria-current={i === activeIndex ? 'true' : 'false'}
                        className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D6A83A] ${
                          i === activeIndex
                            ? 'w-6 h-2 bg-[#123C2D]'
                            : 'w-2 h-2 bg-[#D9D5C8] hover:bg-[#123C2D]/50'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-mono text-[11px] text-[#607568] tracking-wider">
                    0{activeIndex + 1} / 0{totalReviews}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            CUSTOMER SELECTOR STRIP: ALL 6 PORTRAITS & NAMES
            ==================================================== */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-[#D9D5C8]/70">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {TESTIMONIALS.map((t, idx) => {
              const isItemActive = idx === activeIndex;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  className={`group p-2.5 sm:p-3 rounded-[16px] text-left transition-all duration-300 flex items-center gap-3 cursor-pointer border ${
                    isItemActive
                      ? 'bg-[#FAF8F0] border-[#D6A83A] shadow-xs ring-1 ring-[#D6A83A]/40'
                      : 'bg-[#FAF8F0]/60 border-[#D9D5C8]/70 hover:bg-[#FAF8F0] hover:border-[#D9D5C8]'
                  }`}
                >
                  {/* Small Portrait Thumbnail */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#EDE8DC] border border-[#D9D5C8]">
                    <img
                      src={t.image}
                      alt={t.author}
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        isItemActive ? 'scale-105' : 'grayscale-[25%] group-hover:grayscale-0'
                      }`}
                      loading="lazy"
                    />
                  </div>

                  {/* Customer Name & Location */}
                  <div className="min-w-0 flex-1">
                    <h4
                      className={`font-sans text-[13.5px] sm:text-[14.5px] font-bold leading-tight truncate transition-colors ${
                        isItemActive ? 'text-[#123C2D]' : 'text-[#2A2118]/85 group-hover:text-[#123C2D]'
                      }`}
                    >
                      {t.author}
                    </h4>
                    <span className="font-sans text-[11px] text-[#607568] block truncate mt-0.5">
                      {t.location || 'South India'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Authenticity Disclaimer Note */}
          <p className="text-center font-sans text-[11.5px] text-[#607568]/80 mt-6 tracking-wide">
            Illustrative customer lifestyle portraits representing genuine community feedback.
          </p>
        </div>
      </div>
    </section>
  );
};

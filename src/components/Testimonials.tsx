import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion';
import { TextRevealOnScroll } from './motion/TextRevealOnScroll';
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
      className="relative w-full py-20 sm:py-24 lg:py-32 bg-[#F4F1EA] overflow-hidden select-none border-t border-[#D9D7D0]"
    >
      {/* Background Decorative Parallax Watermark Quote & Ambient Glow */}
      <motion.div
        style={
          !isMobile && !shouldReduceMotion
            ? { x: -mouseOffset.x * 0.5, y: -mouseOffset.y * 0.5 }
            : undefined
        }
        className="absolute -top-12 -right-8 font-serif text-[280px] sm:text-[380px] leading-none text-[#242424]/[0.025] select-none pointer-events-none transition-transform duration-300"
      >
        “
      </motion.div>

      <div className="absolute top-1/3 -left-36 w-[480px] h-[480px] rounded-full bg-[#C9892E]/[0.06] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-36 w-[480px] h-[480px] rounded-full bg-[#DDAA55]/[0.04] blur-3xl pointer-events-none" />

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
            <span className="w-5 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-semibold">
              CUSTOMER STORIES
            </span>
            <span className="w-5 h-[1.5px] bg-[#C9892E] inline-block" />
          </motion.div>

          <TextRevealOnScroll
            text={'WHAT OUR CUSTOMERS\nSAY ABOUT US.'}
            as="h2"
            className="font-serif text-[34px] sm:text-[46px] md:text-[54px] font-semibold text-[#242424] leading-[1.08] tracking-[-0.015em]"
          />

          <TextRevealOnScroll
            text="Genuine reflections from families across South India embracing the unprocessed purity of high-altitude harvesting."
            as="p"
            className="font-sans text-[15.5px] sm:text-[17.5px] md:text-[18.5px] font-normal text-[#686863] leading-[1.5] max-w-[620px] mx-auto pt-1"
          />
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
              <div className="absolute inset-0 -m-3 sm:-m-4 rounded-[32px] border border-[#C9892E]/30 pointer-events-none scale-102" />

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
                  <div className="absolute inset-0 bg-[#242424]/25" />
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
                  <div className="absolute inset-0 bg-[#242424]/25" />
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
                    className="w-full h-full rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(36, 36, 36,0.12)] border-2 border-[#C9892E]/70 bg-[#FAF9F5] relative cursor-grab active:cursor-grabbing"
                  >
                    {/* Character Image Motion: Subtle continuous breathing life */}
                    <motion.img
                      src={activeTestimonial.image}
                      alt={`Editorial portrait representing ${activeTestimonial.author}`}
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

                    {/* Rich Cinematic Warm Espresso Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242424]/65 via-[#242424]/15 to-transparent pointer-events-none" />

                    {/* Location Badge (Top Left) */}
                    {activeTestimonial.location && (
                      <div className="absolute top-4 left-4 z-30">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242424]/85 backdrop-blur-md text-[#FAF9F5] font-mono text-[11px] uppercase tracking-wider shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                          {activeTestimonial.location}
                        </span>
                      </div>
                    )}

                    {/* 5-Star Rating Overlay (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 z-30 flex items-center space-x-1 text-[#DDAA55]">
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
                      <span className="font-mono text-[10px] font-semibold text-[#FAF9F5]/90 uppercase tracking-widest bg-black/35 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
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
              <span className="font-serif text-[60px] sm:text-[80px] leading-none text-[#C9892E]/20 absolute -top-8 sm:-top-10 -left-6 select-none pointer-events-none">
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
                  className="font-serif text-[22px] sm:text-[28px] md:text-[32px] lg:text-[34px] font-normal text-[#242424] leading-[1.35] tracking-[-0.01em] relative z-10"
                >
                  "{activeTestimonial.quote}"
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Separately Animated Customer Name & Role */}
            <div className="pt-6 border-t border-[#D9D7D0]">
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
                    <h4 className="font-sans text-[20px] sm:text-[23px] font-bold text-[#242424] tracking-tight">
                      {activeTestimonial.author}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-sans text-[13px] sm:text-[14px] text-[#686863]">
                        {activeTestimonial.location || 'South India'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#C9892E]" />
                      <span className="font-mono text-[11px] font-semibold text-[#242424] uppercase tracking-wider">
                        {activeTestimonial.role || 'VERIFIED EXPERIENCE'}
                      </span>
                    </div>
                  </div>

                  {/* Botanical Quality Insignia */}
                  <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#242424]/5 border border-[#D9D7D0]">
                    <span className="w-2 h-2 rounded-full bg-[#C9892E]" />
                    <span className="font-mono text-[10.5px] font-semibold tracking-wider text-[#242424] uppercase">
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
                  className="group w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D9D7D0] hover:bg-[#242424] hover:text-[#FAF9F5] hover:border-[#242424] text-[#242424] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9892E]"
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
                  className="group w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#D9D7D0] hover:bg-[#242424] hover:text-[#FAF9F5] hover:border-[#242424] text-[#242424] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9892E]"
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
                <div className="w-full h-1 bg-[#D9D7D0] rounded-full overflow-hidden">
                  <motion.div
                    key={`progress-${activeIndex}-${isPaused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: isPaused ? '0%' : '100%' }}
                    transition={{
                      duration: 5.5,
                      ease: 'linear',
                    }}
                    className="h-full bg-[#C9892E]"
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
                        className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9892E] ${
                          i === activeIndex
                            ? 'w-6 h-2 bg-[#242424]'
                            : 'w-2 h-2 bg-[#D9D7D0] hover:bg-[#242424]/50'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-mono text-[11px] text-[#686863] tracking-wider">
                    0{activeIndex + 1} / 0{totalReviews}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================
            CUSTOMER STORY EDITORIAL SECTION (FREED SPACE)
            Original Himalayan Harvest Palette (Zero Forest Green)
            ==================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 sm:mt-24 pt-12 sm:pt-16 border-t border-[#D9D7D0]"
        >
          <div className="bg-[#FAF9F5] rounded-[24px] sm:rounded-[32px] border border-[#D9D7D0] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_12px_36px_rgba(36, 36, 36,0.05)]">
            {/* Ambient Honey-Gold Glow Accent */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C9892E]/[0.06] blur-3xl pointer-events-none" />

            <div className="max-w-[880px] mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
              {/* Eyebrow */}
              <div className="flex items-center justify-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[#C9892E] inline-block" />
                <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-[#C9892E] font-semibold">
                  CUSTOMER STORY
                </span>
                <span className="w-6 h-[1.5px] bg-[#C9892E] inline-block" />
              </div>

              {/* Serif Headline */}
              <h3 className="font-serif text-[28px] sm:text-[38px] md:text-[44px] font-semibold text-[#242424] leading-[1.15] tracking-[-0.015em]">
                “A Taste That Became Part of Her Morning”
              </h3>

              {/* Customer Attribution & Stars */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-[#C9892E] flex-shrink-0 bg-[#F4F1EA]">
                    <img
                      src="/images/reviews/kavitha-r.jpg"
                      alt="Kavitha R."
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-sans text-[15px] sm:text-[16px] font-semibold text-[#242424]">
                    Kavitha R. — Chennai
                  </span>
                </div>
                <span className="hidden sm:inline text-[#D9D7D0]">•</span>
                <div className="flex items-center space-x-1 text-[#DDAA55]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* Approved Customer Feedback Editorial Presentation */}
              <div className="pt-6 sm:pt-8 border-t border-[#D9D7D0] space-y-4">
                <p className="font-serif text-[20px] sm:text-[24px] md:text-[27px] font-normal italic text-[#242424] leading-[1.45] max-w-[760px] mx-auto">
                  “Outstanding purity and authentic mountain aroma. You can genuinely taste the fresh high-altitude flora in every spoonful.”
                </p>
                <p className="font-sans text-[14.5px] sm:text-[15.5px] text-[#686863] leading-[1.65] max-w-[660px] mx-auto">
                  For Kavitha, every morning begins with an authentic spoonful of pure mountain harvest. With its unheated crystalline texture and fresh high-altitude floral notes, Himalayan Harvest brings genuine forest purity directly to her family’s table.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

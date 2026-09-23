import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Testimonial } from '../data/himalayanHarvest';
import { useApprovedReviews } from '../hooks/useApprovedReviews';
import { CustomerFeedbackGallery } from './CustomerFeedbackGallery';

export const Testimonials: React.FC = () => {
  const { reviews } = useApprovedReviews();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev

  const containerRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const totalReviews = reviews.length;
  const activeReview: Testimonial = reviews[activeIndex] || reviews[0];

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

  // Touch swipe support on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Directional Slide Animation Variants matching specifications
  // NEXT: current -> x: -80, opacity: 0 | next -> x: 80 -> 0, opacity: 0 -> 1
  // PREVIOUS: current -> x: 80, opacity: 0 | previous -> x: -80 -> 0, opacity: 0 -> 1
  const slideVariants = {
    enter: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? 80 : -80,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir: number) => ({
      x: shouldReduceMotion ? 0 : dir > 0 ? -80 : 80,
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <>
      <section
        id="reviews"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-roledescription="carousel"
        aria-label="Customer Testimonials"
        className="relative w-full py-16 sm:py-20 lg:py-28 bg-[#F4F1EA] overflow-hidden select-none border-t border-[#D9D7D0]"
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header: Eyebrow + Large Editorial Heading + Subline */}
          <div className="max-w-[820px] mb-10 sm:mb-14 lg:mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-[#C9892E] font-semibold">
                CUSTOMER STORIES
              </span>
            </div>

            <h2 className="font-serif text-[32px] sm:text-[44px] md:text-[52px] font-semibold text-[#242424] leading-[1.08] tracking-[-0.015em]">
              WHAT OUR CUSTOMERS SAY ABOUT US.
            </h2>

            <p className="font-sans text-[15px] sm:text-[16.5px] text-[#686863] mt-3 leading-relaxed max-w-[620px]">
              Genuine reflections from families across South India embracing the unprocessed purity of high-altitude harvesting.
            </p>
          </div>

          {/* Editorial Showcase Card */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(36,36,36,0.04)] relative overflow-hidden">
            {/* Ambient Gold Accent Glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C9892E]/[0.05] blur-3xl pointer-events-none" />

            {/* Desktop 2-Column / Mobile 1-Column Sequential Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* ====================================================
                  IMAGE COLUMN: (Mobile: 1st | Desktop: LEFT)
                  ==================================================== */}
              <div className="lg:col-span-5 w-full overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={`portrait-${activeReview.id}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="relative w-full aspect-square sm:aspect-[4/5] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#242424]/5 border border-[#D9D7D0] shadow-sm"
                  >
                    <img
                      src={activeReview.image}
                      alt={activeReview.author}
                      className="w-full h-full object-cover object-center"
                      loading="eager"
                    />

                    {/* Rich Warm Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#242424]/45 via-transparent to-transparent pointer-events-none" />

                    {/* Location Badge (Top Left) */}
                    {activeReview.location && (
                      <div className="absolute top-4 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F5]/92 backdrop-blur-md text-[#242424] font-mono text-[11px] uppercase tracking-wider border border-[#D9D7D0] shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                          {activeReview.location}
                        </span>
                      </div>
                    )}

                    {/* 5-Star Rating Overlay (Bottom Left) */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 text-[#DDAA55]">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 drop-shadow"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Verified Badge (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 z-10 hidden sm:block">
                      <span className="font-mono text-[10px] font-semibold text-[#FAF9F5] uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        VERIFIED
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ====================================================
                  CONTENT & CONTROLS COLUMN: (Desktop: RIGHT)
                  (Mobile Sequence: Quote -> Customer Info -> Controls)
                  ==================================================== */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                {/* Synchronized Animated Testimonial Text & Details */}
                <div className="overflow-hidden">
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={`content-${activeReview.id}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="space-y-6"
                    >
                      {/* Large Testimonial Quote */}
                      <div className="relative pt-2">
                        <span className="font-serif text-[56px] sm:text-[72px] leading-none text-[#C9892E]/25 absolute -top-8 -left-3 sm:-left-4 select-none pointer-events-none">
                          “
                        </span>
                        <blockquote className="font-serif text-[22px] sm:text-[28px] md:text-[32px] text-[#242424] font-normal leading-[1.3] tracking-[-0.01em] relative z-10">
                          "{activeReview.quote}"
                        </blockquote>
                      </div>

                      {/* Customer Name & Location */}
                      <div className="pt-5 border-t border-[#D9D7D0]">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-sans text-[20px] sm:text-[23px] font-bold text-[#242424] tracking-tight">
                              {activeReview.author}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-sans text-[13.5px] sm:text-[14.5px] text-[#686863]">
                                {activeReview.location || 'South India'}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-[#C9892E]" />
                              <span className="font-mono text-[10.5px] font-semibold text-[#242424] uppercase tracking-wider">
                                {activeReview.role || 'CUSTOMER FEEDBACK'}
                              </span>
                            </div>
                          </div>

                          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242424]/5 border border-[#D9D7D0]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                            <span className="font-mono text-[10px] font-semibold tracking-wider text-[#242424] uppercase">
                              Himalayan Harvest
                            </span>
                          </div>
                        </div>

                        {/* Kavitha's Approved Customer Review Presentation (Exactly Preserved) */}
                        {activeReview.id === '1' && (
                          <div className="mt-4 pt-4 border-t border-[#D9D7D0]/60 space-y-2">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                              <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#C9892E] font-semibold">
                                APPROVED CUSTOMER FEEDBACK
                              </span>
                            </div>
                            <div className="space-y-1.5 text-left">
                              <p className="font-sans text-[13.5px] sm:text-[14.5px] text-[#242424] font-medium leading-relaxed">
                                இந்த Honey-யை வாங்கி பயன்படுத்தியதில் மிகவும் திருப்தியாக இருக்கிறது.
                              </p>
                              <p className="font-sans text-[12.5px] sm:text-[13.5px] text-[#555550] leading-relaxed">
                                Honey-யின் quality மிகவும் அருமையாக உள்ளது. சுவையும் இயற்கையானதாகவும், நல்ல மணத்துடனும் இருக்கிறது. வீட்டில் family-யில் அனைவருக்கும் மிகவும் பிடித்திருக்கிறது. Packaging மிகவும் neat-ஆகவும் பாதுகாப்பாகவும் இருந்தது. மொத்தத்தில் quality, taste, packaging, delivery அனைத்துமே மிகவும் சிறப்பாக இருந்தது. 🍯❤️⭐⭐⭐⭐⭐
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ====================================================
                    CONTROLS: Circular Buttons + 6-Dot Pill Indicator + Counter
                    (Mobile: 4th sequential item | Desktop: Right bottom)
                    ==================================================== */}
                <div className="pt-6 border-t border-[#D9D7D0] flex flex-wrap items-center justify-between gap-4">
                  {/* Previous / Next Circular Buttons */}
                  <div className="flex items-center gap-2.5">
                    {/* Previous Button */}
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous testimonial"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D9D7D0] bg-[#FAF9F5] text-[#242424] hover:bg-[#242424] hover:text-[#FAF9F5] hover:border-[#242424] transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C9892E]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next testimonial"
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D9D7D0] bg-[#FAF9F5] text-[#242424] hover:bg-[#242424] hover:text-[#FAF9F5] hover:border-[#242424] transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C9892E]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>

                  {/* 6-Dot Pill Progress Indicator & Slide Counter */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Active Pill-Style Progress Indicator */}
                    <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial navigation">
                      {reviews.map((t, i) => (
                        <button
                          key={t.id}
                          type="button"
                          role="tab"
                          onClick={() => handleSelect(i)}
                          aria-label={`Go to testimonial ${i + 1}`}
                          aria-selected={i === activeIndex}
                          className={`h-2 rounded-full cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9892E] ${
                            i === activeIndex
                              ? 'w-7 bg-[#242424]'
                              : 'w-2 bg-[#D9D7D0] hover:bg-[#242424]/40'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Slide Counter (01 / 06) */}
                    <span className="font-mono text-[12px] sm:text-[13px] text-[#686863] tracking-widest tabular-nums">
                      0{activeIndex + 1} / 0{totalReviews}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden semantic registry for accessibility & preloading */}
        <div className="sr-only" aria-hidden="true">
          {reviews.map((t) => (
            <div key={t.id}>
              <h4>{t.author}</h4>
              <img src={t.image} alt={t.author} />
              <p>{t.quote}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real WhatsApp Customer Feedback SwipeGallery Section */}
      <CustomerFeedbackGallery />
    </>
  );
};

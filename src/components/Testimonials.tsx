import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { QuoteIcon } from './Icons';
import { TESTIMONIALS } from '../data/content';

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const totalReviews = TESTIMONIALS.length;

  // Measure container width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateWidth);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Compute card dimensions based on measured width
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;
  const cardWidth = isMobile
    ? Math.min(Math.max(containerWidth - 48, 280), 340)
    : isTablet
    ? 350
    : 390;
  const gap = isMobile ? 16 : 24;
  const step = cardWidth + gap;

  // Calculate centered translation
  const trackX = containerWidth > 0
    ? containerWidth / 2 - (activeIndex * step + cardWidth / 2)
    : 0;

  // Gentle auto-advancing carousel (paused on hover / touch / reduced motion)
  useEffect(() => {
    if (isPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalReviews);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, totalReviews]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      id="reviews"
      className="relative w-full py-20 lg:py-32 bg-[#F5F1E6] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle organic ambient gradient background accents with slow floating motion */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-[#D6A83A]/[0.08] blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -25, 0],
          y: [0, 15, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 -right-24 w-96 h-96 rounded-full bg-[#123C2D]/[0.08] blur-3xl pointer-events-none"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Heading with Staggered Entrance Animation */}
        <div className="text-center max-w-[720px] mx-auto mb-12 md:mb-16 space-y-3.5">
          {/* Eyebrow / Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#123C2D] font-medium">
              CUSTOMER EXPERIENCES
            </span>
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[32px] sm:text-[44px] md:text-[50px] font-semibold text-[#123C2D] leading-[1.1] tracking-[-0.01em]"
          >
            REAL EXPERIENCES.
          </motion.h2>

          {/* Supporting Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[16px] sm:text-[18px] md:text-[19px] font-normal text-[#2A2118]/80 leading-[1.5]"
          >
            Genuine customer experiences shared by honey lovers across Tamil Nadu and beyond.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div ref={containerRef} className="relative w-full overflow-hidden py-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Moving Track */}
            <motion.div
              animate={{ x: trackX }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-stretch cursor-grab active:cursor-grabbing will-change-transform"
              style={{
                gap: `${gap}px`,
              }}
            >
              {TESTIMONIALS.map((t, idx) => {
                const isActive = idx === activeIndex;
                const distFromActive = Math.abs(idx - activeIndex);

                return (
                  <div
                    key={t.id}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: `${cardWidth}px`,
                      flexShrink: 0,
                    }}
                    className="flex flex-col transition-transform duration-700 ease-out"
                  >
                    <div
                      className={`h-full flex flex-col justify-between p-6 sm:p-7 md:p-8 rounded-[20px] transition-all duration-700 select-none cursor-pointer ${
                        isActive
                          ? 'bg-[#FAF8F0] shadow-[0_20px_45px_rgba(18,60,45,0.09)] border border-[#D6A83A]/70 scale-[1.04] -translate-y-2 opacity-100 ring-1 ring-[#D6A83A]/40'
                          : distFromActive === 1
                          ? 'bg-[#FAF8F0]/85 shadow-xs border border-[#D9D5C8] scale-[0.93] opacity-60 hover:opacity-85 hover:bg-[#FAF8F0]'
                          : 'bg-[#FAF8F0]/50 shadow-2xs border border-[#D9D5C8]/70 scale-[0.88] opacity-35 hover:opacity-65'
                      }`}
                    >
                      {/* Quote & Rating Stars */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                              isActive
                                ? 'bg-[#D6A83A]/15 text-[#D6A83A]'
                                : 'bg-white text-[#D6A83A] border border-[#D9D5C8]'
                            }`}
                          >
                            <QuoteIcon size={20} color="#D6A83A" />
                          </div>

                          {/* 5 Golden Stars */}
                          <div className="flex items-center space-x-1 text-[#D6A83A]">
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

                        <p className="font-serif text-[17px] sm:text-[18px] md:text-[19px] font-normal text-[#123C2D] leading-[1.48]">
                          "{t.quote}"
                        </p>
                      </div>

                      {/* Author Info & Label */}
                      <div className="pt-5 mt-4 border-t border-[#D9D5C8] flex items-center justify-between">
                        <div>
                          <h4 className="font-sans text-[15px] sm:text-[16px] font-semibold text-[#123C2D] leading-tight">
                            {t.author}
                          </h4>
                          {t.location && (
                            <span className="font-sans text-[12px] text-[#607568] block mt-0.5">
                              {t.location}
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-mono text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full transition-colors ${
                            isActive
                              ? 'bg-[#123C2D]/10 text-[#123C2D]'
                              : 'bg-white text-[#607568] border border-[#D9D5C8]/80'
                          }`}
                        >
                          CUSTOMER REVIEW
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Navigation Controls: Previous / Next & Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between mt-8 max-w-[420px] mx-auto px-4"
          >
            {/* Previous Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#D9D5C8] hover:bg-[#123C2D] hover:text-[#FAF8F0] hover:border-[#123C2D] text-[#123C2D] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
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

            {/* Pagination Dots */}
            <div className="flex items-center space-x-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === activeIndex
                      ? 'w-7 h-2 bg-[#D6A83A]'
                      : 'w-2 h-2 bg-[#D9D5C8] hover:bg-[#607568]'
                  }`}
                />
              ))}
            </div>

            {/* Next Arrow */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-[#D9D5C8] hover:bg-[#123C2D] hover:text-[#FAF8F0] hover:border-[#123C2D] text-[#123C2D] flex items-center justify-center transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

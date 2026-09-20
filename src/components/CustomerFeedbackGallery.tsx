import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CUSTOMER_FEEDBACK_ITEMS, CustomerFeedbackItem } from '../data/customerFeedback';

interface CustomerFeedbackGalleryProps {
  items?: CustomerFeedbackItem[];
  className?: string;
}

export const CustomerFeedbackGallery: React.FC<CustomerFeedbackGalleryProps> = ({
  items = CUSTOMER_FEEDBACK_ITEMS,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const total = items.length;

  const wheelTimeoutRef = useRef<number | null>(null);

  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleLightboxPrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (total === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + total) % total : 0));
  }, [total]);

  const handleLightboxNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (total === 0) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % total : 0));
  }, [total]);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  // Lock body scroll when Lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lightboxIndex]);

  // Clean up wheel timer on unmount
  useEffect(() => {
    return () => {
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation (arrows + Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') handleLightboxPrev();
        if (e.key === 'ArrowRight') handleLightboxNext();
      } else {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, closeLightbox, handleLightboxPrev, handleLightboxNext, handlePrev, handleNext]);

  // Trackpad / mouse horizontal wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 25) {
      if (wheelTimeoutRef.current) return;
      if (e.deltaX > 25) {
        handleNext();
      } else {
        handlePrev();
      }
      wheelTimeoutRef.current = window.setTimeout(() => {
        wheelTimeoutRef.current = null;
      }, 400);
    }
  };

  const springConfig = prefersReducedMotion
    ? { duration: 0.1 }
    : { type: 'spring' as const, stiffness: 280, damping: 30 };

  if (total === 0) return null;

  return (
    <section
      id="customer-feedback"
      aria-label="Real WhatsApp Customer Feedback"
      className={`w-full py-16 sm:py-24 bg-[#F4F1EA] border-t border-[#D9D7D0] relative overflow-hidden select-none ${className}`}
      onWheel={handleWheel}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Header: Monospace Eyebrow & Editorial Serif Heading */}
        <div className="text-center max-w-[720px] mx-auto mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2.5"
          >
            <span className="w-5 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.18em] text-[#C9892E] font-semibold">
              REAL CUSTOMER FEEDBACK
            </span>
            <span className="w-5 h-[1.5px] bg-[#C9892E] inline-block" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-[32px] sm:text-[44px] md:text-[50px] font-semibold text-[#242424] leading-[1.1] tracking-[-0.015em]"
          >
            WHAT OUR CUSTOMERS SAY
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-[14.5px] sm:text-[16px] text-[#686863] leading-[1.6] max-w-[560px] mx-auto"
          >
            Unedited WhatsApp messages and customer snapshots from families across Tamil Nadu and beyond enjoying our pure mountain harvest.
          </motion.p>
        </div>

        {/* SwipeGallery Carousel Track */}
        <div className="relative w-full max-w-[1180px] mx-auto">
          {/* Main Interactive Stage */}
          <div className="relative w-full overflow-hidden py-2">
            {/* Desktop Stage Arrow Buttons */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous customer feedback"
              className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#242424] border border-[#D9D7D0] shadow-md hover:shadow-lg items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next customer feedback"
              className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#242424] border border-[#D9D7D0] shadow-md hover:shadow-lg items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              dragMomentum={false}
              onDragStart={() => {
                isDraggingRef.current = true;
                setIsDragging(true);
              }}
              onDragEnd={(_, info) => {
                const swipeThreshold = 30;
                const velocityThreshold = 200;
                if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                  handleNext();
                } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                  handlePrev();
                }
                setTimeout(() => {
                  isDraggingRef.current = false;
                  setIsDragging(false);
                }, 80);
              }}
              style={{ touchAction: 'pan-y' }}
              className="flex items-center justify-center cursor-grab active:cursor-grabbing relative"
            >
              {/* Carousel Stage Container: Perfectly anchored centered viewport */}
              <div className="relative w-full h-[520px] sm:h-[590px] md:h-[630px]">
                {items.map((item, idx) => {
                  // Calculate distance from active index wrapped around total
                  let diff = idx - activeIndex;
                  if (diff > total / 2) diff -= total;
                  if (diff < -total / 2) diff += total;

                  // Render only visible slides (distance <= 2) to maximize performance
                  if (Math.abs(diff) > 2) return null;

                  const isActive = diff === 0;

                  return (
                    <div
                      key={item.id}
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-[74vw] max-w-[270px] sm:max-w-[300px] md:max-w-[320px] h-full pointer-events-none"
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          x: `${diff * 108}%`,
                          scale: isActive ? 1 : 0.88,
                          opacity: isActive ? 1 : Math.abs(diff) === 1 ? 0.48 : 0.15,
                          zIndex: isActive ? 20 : 10 - Math.abs(diff),
                        }}
                        transition={springConfig}
                        onClick={() => {
                          if (isDraggingRef.current || isDragging) return;
                          if (!isActive) {
                            setActiveIndex(idx);
                          } else {
                            setLightboxIndex(idx);
                          }
                        }}
                        className={`w-full h-full flex flex-col items-center cursor-pointer pointer-events-auto select-none ${
                          isActive ? 'pointer-events-auto' : 'pointer-events-auto hover:opacity-75'
                        }`}
                        style={{ touchAction: 'pan-y' }}
                      >
                        {/* WhatsApp Screenshot Device Frame */}
                        <div
                          className={`w-full flex-1 rounded-[24px] sm:rounded-[30px] overflow-hidden border transition-all duration-300 bg-[#0B141B] shadow-[0_12px_36px_rgba(0,0,0,0.12)] relative group flex items-center justify-center p-1.5 sm:p-2 ${
                            isActive
                              ? 'border-[#C9892E] ring-2 ring-[#C9892E]/30 shadow-[0_18px_48px_rgba(201,137,46,0.2)]'
                              : 'border-[#D9D7D0] shadow-sm'
                          }`}
                        >
                          {/* Genuine WhatsApp Screenshot image (contain mode preserves 100% tall screenshot) */}
                          <img
                            src={item.image}
                            alt={item.alt}
                            loading={isActive ? 'eager' : 'lazy'}
                            draggable={false}
                            className="w-full h-full object-contain pointer-events-none select-none rounded-[18px] sm:rounded-[22px]"
                          />

                          {/* Hover / Tap Hint Indicator (Active Card Only) */}
                          {isActive && (
                            <div className="absolute inset-0 rounded-[24px] sm:rounded-[30px] bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/95 text-[#242424] font-mono text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm flex items-center gap-1.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-3.5 h-3.5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                                  />
                                </svg>
                                Tap to zoom
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Monospace Category & Label below screenshot */}
                        <div className="mt-3 text-center px-2 shrink-0">
                          <span className="font-mono text-[11px] uppercase tracking-wider text-[#C9892E] font-semibold block">
                            {item.category}
                          </span>
                          <p className="font-sans text-[12.5px] text-[#242424]/80 line-clamp-1 mt-0.5 font-medium">
                            {item.caption}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Controls & Scrubber Footer: Arrows + Counter + Dots */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[540px] mx-auto px-4">
            {/* Left/Right Arrow Navigation Buttons */}
            <div className="flex items-center gap-2.5 order-2 sm:order-1">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous customer review"
                className="w-10 h-10 rounded-full bg-white border border-[#D9D7D0] hover:border-[#242424] text-[#242424] hover:bg-[#242424] hover:text-[#F4F1EA] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Next customer review"
                className="w-10 h-10 rounded-full bg-white border border-[#D9D7D0] hover:border-[#242424] text-[#242424] hover:bg-[#242424] hover:text-[#F4F1EA] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Pagination Scrubber Dots */}
            <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[220px] py-1 order-3 sm:order-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Jump to screenshot ${i + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    i === activeIndex
                      ? 'w-6 h-2 bg-[#242424]'
                      : 'w-2 h-2 bg-[#D9D7D0] hover:bg-[#242424]/40'
                  }`}
                />
              ))}
            </div>

            {/* Counter Badge: e.g. 01 / 13 */}
            <div className="font-mono text-[12px] font-semibold text-[#242424] bg-white border border-[#D9D7D0] px-3.5 py-1 rounded-full shadow-sm order-1 sm:order-3">
              <span>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className="text-[#686863] mx-1">/</span>
              <span className="text-[#686863]">{String(total).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          FULLSCREEN LIGHTBOX MODAL
          Preserves 100% complete aspect ratio & natural swipe
          ==================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && items[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          >
            {/* Top Toolbar: Counter + Close button */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[800px] flex items-center justify-between z-10 pt-2"
            >
              <span className="font-mono text-[12px] text-white/80 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close screenshot preview"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Center: Full Aspect Ratio Image with Swipe Navigation */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[840px] flex-1 flex items-center justify-center py-3 overflow-hidden"
            >
              {/* Previous Button inside Lightbox */}
              <button
                type="button"
                onClick={handleLightboxPrev}
                aria-label="Previous screenshot"
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-lg backdrop-blur-sm"
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

              {/* Animate current lightbox image */}
              <motion.div
                key={lightboxIndex}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                dragMomentum={false}
                style={{ touchAction: 'none' }}
                onDragEnd={(_, info) => {
                  const swipeThreshold = 35;
                  const velocityThreshold = 200;
                  if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                    handleLightboxNext();
                  } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                    handleLightboxPrev();
                  }
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-h-[82vh] max-w-[92vw] flex items-center justify-center cursor-grab active:cursor-grabbing"
              >
                <img
                  src={items[lightboxIndex].image}
                  alt={items[lightboxIndex].alt}
                  className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain rounded-[18px] sm:rounded-[22px] shadow-2xl border border-white/15 select-none"
                  draggable={false}
                />
              </motion.div>

              {/* Next Button inside Lightbox */}
              <button
                type="button"
                onClick={handleLightboxNext}
                aria-label="Next screenshot"
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all active:scale-95 shadow-lg backdrop-blur-sm"
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

            {/* Bottom: Caption */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-center max-w-[600px] z-10 pb-2 px-4"
            >
              <p className="font-sans text-[13px] text-white/80 font-medium">
                {items[lightboxIndex].caption}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

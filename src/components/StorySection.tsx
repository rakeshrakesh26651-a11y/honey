import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Exactly 4 Heritage Images:
 * 01: Pristine Himalayan landscape / Forest apiary
 * 02: Wild cliff honey harvesting on rope ladder
 * 03: 4th-generation beekeeper tending apiaries in golden hour
 * 04: Raw honey comb uncapping and extraction
 */
const HERITAGE_IMAGES = [
  {
    id: '01',
    src: '/images/story_apiary.jpg',
    alt: 'Pristine Himalayan mountain valley and alpine meadows',
    title: 'Himalayan Alpine Meadows',
  },
  {
    id: '02',
    src: '/images/heritage_cliff_harvest.jpg',
    alt: 'Traditional wild honey harvesting from Himalayan cliffs',
    title: 'Wild Cliff Harvesting Tradition',
  },
  {
    id: '03',
    src: '/images/heritage_apiary_beekeeper.jpg',
    alt: '4th-generation beekeeper tending apiaries at golden hour',
    title: 'Generational Apiary Care',
  },
  {
    id: '04',
    src: '/images/heritage_comb_extraction.jpg',
    alt: 'Pure raw honeycomb extraction and processing',
    title: 'Raw Comb Uncapping & Extraction',
  },
];

export const StorySection: React.FC = () => {
  const [orderedImages, setOrderedImages] = useState(HERITAGE_IMAGES);
  const shouldReduceMotion = useReducedMotion();

  const handleSwap = (targetIndex: number) => {
    if (targetIndex === 0) return;
    setOrderedImages((prev) => {
      const next = [...prev];
      const temp = next[0];
      next[0] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  return (
    <section
      id="story"
      className="w-full max-w-[1280px] mx-auto px-6 md:px-10 py-16 md:py-24 bg-[#F5F1E6] overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* LEFT: OLIO-STYLE REARRANGEMENT GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[540px] flex flex-col select-none"
        >
          {/* 4-Image Grid Stage (Slot 0 full width; Slots 1, 2, 3 in 3-column row) */}
          <div
            role="region"
            aria-label="Heritage gallery image rearrangement"
            className="grid grid-cols-3 gap-3 sm:gap-4 w-full"
          >
            {orderedImages.map((image, index) => {
              const isFeatured = index === 0;

              return (
                <motion.div
                  key={image.id}
                  layout={!shouldReduceMotion}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: 120,
                          damping: 24,
                          mass: 0.9,
                        }
                  }
                  animate={{
                    scale: isFeatured ? 1 : 0.98,
                  }}
                  whileHover={
                    !isFeatured
                      ? { scale: 1.02 }
                      : undefined
                  }
                  onClick={() => !isFeatured && handleSwap(index)}
                  onKeyDown={(e) => {
                    if (!isFeatured && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSwap(index);
                    }
                  }}
                  tabIndex={isFeatured ? -1 : 0}
                  role={isFeatured ? 'img' : 'button'}
                  aria-label={
                    isFeatured
                      ? `Featured heritage image: ${image.title}`
                      : `View ${image.title} as featured image`
                  }
                  className={`relative overflow-hidden group border border-[#D9D5C8] bg-[#EDE8DC] ${
                    isFeatured
                      ? 'col-span-3 aspect-[16/10] sm:aspect-[16/10.2] rounded-[20px] shadow-[0_16px_40px_-15px_rgba(18,60,45,0.12)] cursor-default'
                      : 'col-span-1 aspect-[4/3] rounded-[14px] shadow-xs cursor-pointer hover:border-[#D6A83A]/70 focus:outline-hidden focus:ring-2 focus:ring-[#D6A83A]'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading={isFeatured ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />

                  {/* Ambient Gradient Overlay */}
                  <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                      isFeatured
                        ? 'bg-gradient-to-t from-black/65 via-black/15 to-transparent'
                        : 'bg-gradient-to-t from-black/50 via-transparent to-black/10 group-hover:from-black/35'
                    }`}
                  />

                  {/* Featured Content Overlay */}
                  {isFeatured && (
                    <motion.div
                      key={`caption-${image.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between pointer-events-none text-white z-10"
                    >
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#D6A83A] font-medium block">
                          Heritage Chapter {image.id}
                        </span>
                        <p className="font-serif text-[15px] sm:text-[17px] md:text-[18px] font-medium text-white/95 leading-tight truncate">
                          {image.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                        <span className="font-mono text-[11px] font-semibold text-white tracking-widest">
                          {image.id}/04
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Inactive Secondary Content Overlay */}
                  {!isFeatured && (
                    <div className="absolute inset-0 p-2.5 sm:p-3 flex flex-col justify-between pointer-events-none text-white z-10">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[#D6A83A] border border-white/15 tracking-wider">
                          {image.id}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] sm:text-[12px] font-medium text-white/90 truncate drop-shadow-sm">
                        {image.title}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT: STORY TEXT COPY (EXACT & UNTOUCHED) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[528px] flex flex-col items-start space-y-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#123C2D] font-medium leading-[18.2px]">
              OUR HERITAGE
            </span>
          </div>

          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#123C2D] leading-[1.1] tracking-[-0.01em]">
            FOUR GENERATIONS.<br className="hidden sm:inline" /> ONE TRADITION.
          </h2>

          <p className="font-sans text-[17px] md:text-[19px] font-normal text-[#2A2118]/85 leading-[1.55]">
            A honey harvesting tradition carried through four generations, bringing the sweetness of Himalayan honey from the high peaks to customers in Tamil Nadu and beyond.
          </p>

          <p className="font-sans text-[15px] font-medium text-[#607568] italic">
            From the mountains to your table.
          </p>

          <div className="pt-2">
            <a
              href="#story"
              className="inline-block font-sans text-[15px] font-semibold tracking-wider text-[#123C2D] border-b-2 border-[#123C2D] pb-1 hover:text-[#D6A83A] hover:border-[#D6A83A] transition-colors"
            >
              OUR STORY
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StorySectionProps {
  onNavigate?: (path: string) => void;
}

interface HeritageImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  num: string;
}

const HERITAGE_IMAGES: HeritageImage[] = [
  {
    id: 'heritage-1',
    src: '/images/story_apiary.jpg',
    alt: 'Pristine Himalayan mountain valley and alpine apiary meadows',
    title: 'Himalayan Alpine Sanctuary',
    caption: 'Himalayan Alpine Sanctuary',
    num: '01',
  },
  {
    id: 'heritage-2',
    src: '/images/heritage_apiary_beekeeper.jpg',
    alt: 'Beekeeper tending apiary box hives at golden hour',
    title: '4th-Generation Apiary Stewardship',
    caption: 'Apiary Stewardship',
    num: '02',
  },
  {
    id: 'heritage-3',
    src: '/images/heritage_comb_extraction.jpg',
    alt: 'Traditional cold extraction and uncapping of pure golden honeycomb',
    title: 'Unpasteurized Comb Extraction',
    caption: 'Raw Comb Extraction',
    num: '03',
  },
  {
    id: 'heritage-4',
    src: '/images/heritage_cliff_harvest.jpg',
    alt: 'High-altitude wild cliff honey harvest on traditional rope ladders',
    title: 'Wild High-Altitude Cliff Harvest',
    caption: 'Wild Cliff Harvesting',
    num: '04',
  },
];

export const StorySection: React.FC<StorySectionProps> = ({ onNavigate }) => {
  const [activeId, setActiveId] = useState<string>('heritage-1');
  const shouldReduceMotion = useReducedMotion();

  const activeIndex = HERITAGE_IMAGES.findIndex((img) => img.id === activeId);
  const activeImage = HERITAGE_IMAGES[activeIndex] || HERITAGE_IMAGES[0];
  const orderedImages = [
    activeImage,
    ...HERITAGE_IMAGES.filter((img) => img.id !== activeId),
  ];

  const springTransition = shouldReduceMotion
    ? { duration: 0.2 }
    : {
        type: 'spring' as const,
        stiffness: 120,
        damping: 24,
        mass: 0.9,
      };

  const handleStoryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/about');
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % HERITAGE_IMAGES.length;
    setActiveId(HERITAGE_IMAGES[nextIdx].id);
  };

  return (
    <section
      id="story"
      className="w-full max-w-[1200px] mx-auto px-6 md:px-10 py-16 md:py-24 bg-[#F4F1EA]"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* ====================================================
            LEFT: 4-IMAGE EXPANDABLE HERITAGE GALLERY
            ==================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[528px] flex-shrink-0"
        >
          {/* Single Continuous FLIP Animated Grid: 1 Featured (col-span-3) + 3 Thumbnails (col-span-1 each) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-3.5 w-full">
            {orderedImages.map((img, index) => {
              const isFeatured = index === 0;

              return (
                <motion.div
                  layout
                  key={img.id}
                  onClick={() => {
                    if (!isFeatured) {
                      setActiveId(img.id);
                    } else {
                      handleNext();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (!isFeatured) {
                        setActiveId(img.id);
                      } else {
                        handleNext();
                      }
                    }
                  }}
                  aria-label={
                    isFeatured
                      ? `Featured heritage image ${img.num}: ${img.title}. Click to view next image.`
                      : `View heritage image ${img.num}: ${img.title}`
                  }
                  transition={springTransition}
                  whileHover={shouldReduceMotion ? undefined : isFeatured ? undefined : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                  className={`relative overflow-hidden bg-[#FAF9F5] border border-[#D9D7D0] cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C9892E] ${
                    isFeatured
                      ? 'col-span-3 aspect-[528/410] rounded-[16px] shadow-[0_6px_24px_rgba(36, 36, 36,0.06)] group z-10'
                      : 'col-span-1 aspect-[4/3] rounded-[12px] opacity-90 hover:opacity-100 hover:border-[#C9892E] shadow-xs z-0'
                  }`}
                >
                  <motion.img
                    layout
                    src={img.src}
                    alt={img.alt}
                    loading={isFeatured ? 'eager' : 'lazy'}
                    transition={springTransition}
                    className={`w-full h-full object-cover ${
                      isFeatured
                        ? 'rounded-[16px] transition-transform duration-700 ease-out group-hover:scale-[1.02]'
                        : 'rounded-[12px]'
                    }`}
                  />

                  {/* Origin Tag on Featured Card */}
                  {isFeatured && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-3.5 right-3.5 z-20 pointer-events-none"
                    >
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#242424]/80 backdrop-blur-md text-[#FAF9F5] font-mono text-[10.5px] uppercase tracking-wider border border-white/15 shadow-xs">
                        {img.caption}
                      </span>
                    </motion.div>
                  )}

                  {/* Thumbnail Number on Inactive Cards */}
                  {!isFeatured && (
                    <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
                      <span className="inline-block px-1.5 py-0.5 rounded-md bg-[#242424]/85 backdrop-blur-xs text-[#DDAA55] font-mono text-[10px] font-bold">
                        {img.num}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Minimal Editorial Image Counter & Gallery Hint */}
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#686863]">
              HERITAGE ARCHIVE
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
              <span className="font-mono text-[12px] font-bold text-[#242424] tracking-wider">
                {activeImage.num} / 04
              </span>
            </div>
          </div>
        </motion.div>

        {/* ====================================================
            RIGHT: STORY TEXT COPY (EXACTLY UNCHANGED)
            ==================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[528px] flex flex-col items-start space-y-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#242424] font-medium leading-[18.2px]">
              OUR HERITAGE
            </span>
          </div>

          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#242424] leading-[1.1] tracking-[-0.01em]">
            FOUR GENERATIONS.<br className="hidden sm:inline" /> ONE TRADITION.
          </h2>

          <p className="font-sans text-[17px] md:text-[19px] font-normal text-[#242424]/85 leading-[1.55]">
            A honey harvesting tradition carried through four generations, bringing the sweetness of Himalayan honey from the high peaks to customers in Tamil Nadu and beyond.
          </p>

          <p className="font-sans text-[15px] font-medium text-[#686863] italic">
            From the mountains to your table.
          </p>

          <div className="pt-2">
            <a
              href="/about"
              onClick={handleStoryClick}
              className="inline-block font-sans text-[15px] font-semibold tracking-wider text-[#242424] border-b-2 border-[#242424] pb-1 hover:text-[#C9892E] hover:border-[#C9892E] transition-colors cursor-pointer"
            >
              OUR STORY
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};


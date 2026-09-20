import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedHeading } from './motion/AnimatedHeading';
import { TextRevealOnScroll } from './motion/TextRevealOnScroll';
import { InstagramIcon } from './Icons';

interface AccordionItem {
  id: string;
  num: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  tag: string;
  location: string;
}

export const SocialGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const shouldReduceMotion = useReducedMotion();

  // Exactly 4 curated existing gallery concepts per specification:
  // 1. Himalayan mountain / honey origin image (/images/ugc_6.jpg)
  // 2. Honey toast / daily ritual image (/images/ugc_1.jpg)
  // 3. Honey jar + honey dipper image (/images/ugc_4.jpg)
  // 4. Himalayan landscape / heritage image (/images/story_apiary.jpg)
  const accordionItems: AccordionItem[] = [
    {
      id: 'origin-harvest',
      num: '01',
      src: '/images/ugc_6.jpg',
      alt: 'Honey jar on stone terrace overlooking Himalayan peaks',
      title: 'High-Altitude Harvest',
      subtitle: 'Wild mountain apiaries overlooking Himalayan peaks at 2,800m altitude.',
      tag: 'ORIGIN HARVEST',
      location: 'Himalayan Ridge • 2,800m',
    },
    {
      id: 'daily-ritual',
      num: '02',
      src: '/images/ugc_1.jpg',
      alt: 'Artisanal toast with honey drizzle',
      title: 'Daily Morning Ritual',
      subtitle: 'Artisanal sourdough toast naturally paired with raw multi-floral nectar.',
      tag: 'DAILY RITUAL',
      location: 'Morning Harvest Table',
    },
    {
      id: 'slow-extraction',
      num: '03',
      src: '/images/ugc_4.jpg',
      alt: 'Raw honey dripping from wooden dipper',
      title: '100% Unheated & Raw',
      subtitle: 'Slow-poured raw honey preserving living enzymes, natural pollen, and delicate floral aromas.',
      tag: '100% UNHEATED',
      location: 'Cold Extracted • Raw',
    },
    {
      id: 'heritage-apiary',
      num: '04',
      src: '/images/story_apiary.jpg',
      alt: 'Himalayan mountain apiary surrounded by wild native flora',
      title: 'Generations of Stewardship',
      subtitle: 'Four generations of bee stewardship and biodiversity preservation in high-altitude forests.',
      tag: 'HERITAGE APIARY',
      location: 'Wild Sanctuary Apiaries',
    },
  ];

  const springTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { type: 'spring', stiffness: 220, damping: 26, mass: 0.9 };

  return (
    <section
      id="wild"
      className="relative w-full py-16 sm:py-20 lg:py-28 bg-[#F4F1EA] overflow-hidden border-t border-[#D9D7D0]"
    >
      {/* Subtle organic ambient background accent */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#C9892E]/[0.05] blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-10 sm:mb-14 md:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[11.5px] sm:text-[12px] uppercase tracking-[0.14em] text-[#242424] font-medium">
              @himalayanharvesthoney • 9,592 FOLLOWERS
            </span>
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
          </motion.div>

          <AnimatedHeading
            text="FROM OUR COMMUNITY"
            as="h2"
            animateOnMount={true}
            className="font-serif text-[34px] sm:text-[46px] md:text-[52px] font-semibold text-[#242424] leading-[1.08] tracking-[-0.015em]"
          />

          <TextRevealOnScroll
            text="Living moments from mountain kitchens, morning breakfast tables, and community honey rituals."
            as="p"
            className="font-sans text-[16px] sm:text-[18px] md:text-[19px] font-normal text-[#686863] leading-[1.55]"
          />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2"
          >
            <a
              href="https://www.instagram.com/himalayanharvesthoney/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-sm font-bold tracking-wide transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
            >
              <InstagramIcon size={16} color="currentColor" />
              <span>FOLLOW US ON INSTAGRAM</span>
            </a>
          </motion.div>
        </div>

        {/* ====================================================
            REACT BITS-INSPIRED 4-PANEL ACCORDION GALLERY
            ==================================================== */}
        <div className="w-full max-w-[1240px] mx-auto">
          <div className="flex flex-row gap-2.5 sm:gap-3.5 md:gap-4.5 w-full h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] isolate">
            {accordionItems.map((item, index) => {
              const isExpanded = activeIndex === index;

              return (
                <motion.div
                  key={item.id}
                  layout
                  transition={springTransition}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(index);
                    } else if (e.key === 'ArrowRight') {
                      e.preventDefault();
                      setActiveIndex((prev) => (prev + 1) % accordionItems.length);
                    } else if (e.key === 'ArrowLeft') {
                      e.preventDefault();
                      setActiveIndex((prev) => (prev - 1 + accordionItems.length) % accordionItems.length);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${item.title} — ${item.tag}. ${
                    isExpanded ? 'Currently expanded.' : 'Click or tap to expand panel.'
                  }`}
                  style={{
                    flex: isExpanded ? 4.5 : 1,
                  }}
                  className={`group relative h-full rounded-[18px] sm:rounded-[22px] md:rounded-[24px] overflow-hidden border cursor-pointer select-none transition-all duration-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C9892E] ${
                    isExpanded
                      ? 'border-[#C9892E]/60 shadow-[0_12px_36px_rgba(36,36,36,0.12)] z-10'
                      : 'border-[#D9D7D0] hover:border-[#C9892E]/80 shadow-[0_4px_16px_rgba(36,36,36,0.04)] hover:shadow-[0_8px_24px_rgba(36,36,36,0.08)] z-0'
                  }`}
                >
                  {/* High-quality cover photo */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out ${
                      isExpanded ? 'scale-100' : 'group-hover:scale-[1.04]'
                    }`}
                  />

                  {/* Tint overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                      isExpanded
                        ? 'bg-gradient-to-t from-[#242424]/90 via-[#242424]/35 to-black/10'
                        : 'bg-black/35 group-hover:bg-black/20'
                    }`}
                  />

                  {/* INACTIVE STATE: Narrow vertical panel contents */}
                  {!isExpanded && (
                    <div className="absolute inset-0 flex flex-col justify-between items-center py-3.5 sm:py-5 px-1 sm:px-2 pointer-events-none z-20">
                      {/* Top number pill */}
                      <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#242424]/80 backdrop-blur-md text-[#DDAA55] font-mono text-[10px] sm:text-[11px] md:text-[12px] font-bold border border-white/15 shadow-xs">
                        {item.num}
                      </span>

                      {/* Vertical rotated title / tag */}
                      <div className="flex-1 flex items-center justify-center my-3 sm:my-4 overflow-hidden">
                        <span
                          className="font-mono text-[9.5px] sm:text-[10.5px] md:text-[11.5px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[#FAF9F5] font-medium whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:text-[#DDAA55] transition-colors"
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        >
                          {item.tag}
                        </span>
                      </div>

                      {/* Bottom indicator dot */}
                      <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-[#C9892E] transition-colors" />
                    </div>
                  )}

                  {/* ACTIVE STATE: Expanded editorial presentation */}
                  {isExpanded && (
                    <div className="absolute inset-0 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 text-[#FAF9F5] z-20 pointer-events-none">
                      {/* Top Pills */}
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.08 }}
                        className="flex items-center justify-between gap-1.5 sm:gap-2 w-full"
                      >
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#242424]/80 backdrop-blur-md text-[#FAF9F5] font-mono text-[9.5px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/15 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
                          {item.tag}
                        </span>

                        <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#FAF9F5]/90 font-mono text-[10.5px] uppercase tracking-wider border border-white/15">
                          {item.location}
                        </span>
                      </motion.div>

                      {/* Bottom Content Layer */}
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="space-y-1.5 sm:space-y-2.5"
                      >
                        <h3 className="font-serif text-[18px] sm:text-[24px] md:text-[30px] lg:text-[34px] font-semibold text-[#FAF9F5] leading-[1.15] tracking-[-0.015em]">
                          {item.title}
                        </h3>

                        <p className="font-sans text-[12.5px] sm:text-[14px] md:text-[15.5px] text-[#FAF9F5]/90 max-w-[540px] leading-[1.45] hidden sm:block">
                          {item.subtitle}
                        </p>

                        {/* Meta strip */}
                        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/20 text-[#DDAA55] font-mono text-[10px] sm:text-[11.5px]">
                          <span className="flex items-center gap-1.5 font-medium truncate">
                            <InstagramIcon size={13} color="#DDAA55" />
                            <span className="truncate">@himalayanharvesthoney</span>
                          </span>
                          <span className="text-[#FAF9F5]/80 uppercase tracking-widest text-[9.5px] sm:text-[10.5px] shrink-0 ml-1">
                            {item.num} / 04
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Interactive hint & dots bar */}
          <div className="flex items-center justify-between mt-5 px-1 font-mono text-[11px] sm:text-[12px] text-[#686863]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9892E]" />
              <span className="uppercase tracking-wider">CLICK OR TAP ANY PANEL TO EXPAND</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {accordionItems.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to panel 0${i + 1}: ${item.title}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? 'w-7 sm:w-8 bg-[#C9892E]'
                      : 'w-2 bg-[#D9D7D0] hover:bg-[#686863]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

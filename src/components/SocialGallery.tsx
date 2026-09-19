import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UGC_IMAGES } from '../data/content';
import { AnimatedHeading } from './motion/AnimatedHeading';
import { InstagramIcon } from './Icons';

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
  tag: string;
  aspect: string; // Tailwind aspect ratio or span
  colSpan?: string;
  rowSpan?: string;
}

export const SocialGallery: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Curate lifestyle editorial captions
  const galleryItems: GalleryItem[] = [
    {
      src: UGC_IMAGES[5]?.src || '/images/ugc_6.jpg',
      alt: UGC_IMAGES[5]?.alt || 'Honey jar overlooking Himalayan peaks',
      caption: 'High-altitude raw harvest overlooking mountain peaks',
      tag: 'ORIGIN HARVEST',
      aspect: 'aspect-[4/5]',
      colSpan: 'md:col-span-2 lg:col-span-1',
      rowSpan: 'lg:row-span-2',
    },
    {
      src: UGC_IMAGES[0]?.src || '/images/ugc_1.jpg',
      alt: UGC_IMAGES[0]?.alt || 'Artisanal toast with honey drizzle',
      caption: 'Artisanal breakfast toast with natural floral drizzle',
      tag: 'DAILY RITUAL',
      aspect: 'aspect-square',
    },
    {
      src: UGC_IMAGES[3]?.src || '/images/ugc_4.jpg',
      alt: UGC_IMAGES[3]?.alt || 'Raw honey dripping from wooden dipper',
      caption: 'Slow-poured raw honey preserving living enzymes',
      tag: '100% UNHEATED',
      aspect: 'aspect-square',
    },
    {
      src: '/images/story_apiary.jpg',
      alt: 'Himalayan mountain apiary surrounded by wild native flora',
      caption: 'Four generations of bee stewardship in high-altitude forests',
      tag: 'HERITAGE APIARY',
      aspect: 'aspect-[16/10]',
      colSpan: 'md:col-span-2 lg:col-span-2',
    },
    {
      src: UGC_IMAGES[2]?.src || '/images/ugc_3.jpg',
      alt: UGC_IMAGES[2]?.alt || 'Greek yogurt bowl with walnuts and honey swirl',
      caption: 'Morning bowl with roasted walnuts, figs, and wildflower nectar',
      tag: 'NUTRITION',
      aspect: 'aspect-square',
    },
    {
      src: UGC_IMAGES[1]?.src || '/images/ugc_2.jpg',
      alt: UGC_IMAGES[1]?.alt || 'Mountain herbal tea with honey and lemon',
      caption: 'Evening wellness infusion with citrus and mountain comb',
      tag: 'WELLNESS',
      aspect: 'aspect-square',
    },
  ];

  return (
    <section id="wild" className="relative w-full py-20 lg:py-28 bg-[#F4F1EA] overflow-hidden border-t border-[#D9D7D0]">
      {/* Subtle organic ambient background accent */}
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#C9892E]/[0.06] blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Editorial Section Header */}
        <div className="text-center max-w-[680px] mx-auto mb-14 md:mb-18 space-y-4">
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

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[16px] sm:text-[18px] md:text-[19px] font-normal text-[#686863] leading-[1.55]"
          >
            Living moments from mountain kitchens, morning breakfast tables, and community honey rituals.
          </motion.p>

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

        {/* Asymmetrical Editorial Masonry Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-[1240px] mx-auto">
          {galleryItems.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative rounded-[20px] overflow-hidden bg-white border border-[#D9D7D0] group shadow-[0_4px_18px_rgba(36, 36, 36,0.04)] hover:shadow-[0_16px_38px_rgba(36, 36, 36,0.12)] hover:border-[#C9892E]/70 transition-all duration-500 cursor-pointer ${
                  item.colSpan || ''
                } ${item.rowSpan || ''} ${item.aspect}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background Image with Cinematic Zoom */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover rounded-[20px] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />

                {/* Ambient Soft Dark Gradient Overlay on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-[#242424]/90 via-[#242424]/30 to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Permanent subtle tag pill (top right) */}
                <div className="absolute top-3.5 right-3.5 z-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#FAF9F5] font-mono text-[10px] font-bold uppercase tracking-wider border border-white/15 shadow-xs">
                    {item.tag}
                  </span>
                </div>

                {/* Reveal on Hover: Bottom Caption & Instagram Handle */}
                <div
                  className={`absolute bottom-0 inset-x-0 p-5 sm:p-6 text-[#FAF9F5] z-10 transition-all duration-300 ${
                    isHovered
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-3 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="font-serif text-[15px] sm:text-[17px] font-normal leading-[1.35] mb-2 text-[#FAF9F5]">
                    {item.caption}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[11px] font-mono text-[#DDAA55]">
                    <span className="flex items-center gap-1.5 font-semibold tracking-wider">
                      <InstagramIcon size={12} color="#DDAA55" />
                      @himalayanharvesthoney
                    </span>
                    <span className="text-white/80 uppercase tracking-widest text-[10px]">
                      VIEW POST ↗
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

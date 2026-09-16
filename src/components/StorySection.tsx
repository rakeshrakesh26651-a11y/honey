import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const StorySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="w-full max-w-[1200px] mx-auto px-6 md:px-10 pb-20 lg:pb-32 bg-[#f7f2e7]"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Grove Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[528px] flex-shrink-0"
        >
          <motion.div
            style={{ y: imageY }}
            className="relative w-full aspect-[528/440] rounded-[16px] overflow-hidden bg-[#e8e2d5]/40 shadow-sm group"
          >
            <img
              src="/images/story_apiary.jpg"
              alt="Pristine Himalayan mountain valley and alpine meadows"
              className="w-full h-full object-cover rounded-[16px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />
          </motion.div>
        </motion.div>

        {/* Story Text Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-[528px] flex flex-col items-start space-y-6"
        >
          <span className="font-mono text-[13px] uppercase tracking-[0.06em] text-[#657044] font-normal leading-[18.2px]">
            OUR HERITAGE
          </span>

          <h2 className="font-serif text-[36px] md:text-[48px] font-semibold text-[#1e1a16] leading-[1.1] tracking-[-0.01em]">
            FOUR GENERATIONS.<br className="hidden sm:inline" /> ONE TRADITION.
          </h2>

          <p className="font-sans text-[17px] md:text-[20px] font-normal text-[#1e1a16] leading-[1.5]">
            A honey harvesting tradition carried through four generations, bringing the sweetness of Himalayan honey from the high peaks to customers in Tamil Nadu and beyond.
          </p>

          <p className="font-sans text-[15px] font-medium text-[#657044] italic">
            From the mountains to your table.
          </p>

          <div className="pt-2">
            <a
              href="#story"
              className="inline-block font-sans text-[16px] font-medium text-[#1e1a16] border-b-2 border-[#1e1a16] pb-1 hover:opacity-70 transition-opacity"
            >
              OUR STORY
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

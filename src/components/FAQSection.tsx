import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS, FaqItem } from '../data/himalayanHarvest';
import { AnimatedHeading } from './motion/AnimatedHeading';
import { TextRevealOnScroll } from './motion/TextRevealOnScroll';

interface FAQSectionProps {
  limit?: number;
  showAllLink?: boolean;
  onNavigate?: (path: string) => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  limit,
  showAllLink = false,
  onNavigate,
}) => {
  // Framer FAQ default variant: all closed ("OtH3ntvnF")
  const [openId, setOpenId] = useState<string | null>(null);

  const displayedFaqs: FaqItem[] = limit ? FAQS.slice(0, limit) : FAQS;

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  // Exact Framer spring transition physics from the reference
  const springTransition = {
    type: 'spring',
    damping: 60,
    stiffness: 500,
    mass: 1,
  };

  return (
    <section id="faq" className="relative w-full py-20 lg:py-28 bg-[#FAF9F5] border-t border-[#D9D7D0]">
      <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Editorial Eyebrow & Masked Heading */}
        <div className="text-center max-w-[700px] mx-auto mb-12 sm:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#242424] font-medium">
              COMMON INQUIRIES
            </span>
            <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
          </motion.div>

          <AnimatedHeading
            text="FREQUENTLY ASKED QUESTIONS"
            as="h2"
            animateOnMount={true}
            className="font-serif text-[30px] sm:text-[40px] md:text-[46px] font-semibold text-[#242424] leading-[1.12] tracking-[-0.01em]"
          />

          <TextRevealOnScroll
            text="Clear, transparent answers about our high-altitude harvests, testing protocols, and delivery across India."
            as="p"
            className="font-sans text-[15px] sm:text-[17px] text-[#686863] leading-[1.55] max-w-[580px] mx-auto"
          />
        </div>

        {/* =========================================================================
            FRAMER ACCORDION COMPONENT RECREATION (max-w-[800px], 26px radius, 4px padding, 2px gap)
            ========================================================================= */}
        <div className="w-full max-w-[800px] mx-auto bg-[#E8E4DA] rounded-[26px] p-1 flex flex-col gap-[2px] shadow-sm">
          {displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="w-full rounded-[24px] bg-[#FAF8F5] border border-[#D9D7D0] transition-colors duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left cursor-pointer group flex flex-col focus:outline-none select-none transition-colors hover:bg-[#FAF7F0]"
                >
                  {/* Question Row */}
                  <div className="w-full flex items-center justify-between gap-4">
                    <span className="font-sans text-[16px] sm:text-[18px] font-semibold text-[#242424] leading-[1.4] tracking-[-0.02em] transition-colors group-hover:text-[#C9892E]">
                      {faq.question}
                    </span>

                    {/* Framer Plus / Minus Rotating Icon (28px rounded-full with dual rotating bars) */}
                    <div
                      className="w-7 h-7 rounded-full bg-[#EFECE6] group-hover:bg-[#E5DFD2] flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-colors"
                      aria-hidden="true"
                    >
                      {/* Horizontal bar: -90deg (Closed, looks horizontal) -> 90deg (Opened, stays horizontal) */}
                      <motion.span
                        animate={{ rotate: isOpen ? 90 : -90 }}
                        transition={springTransition}
                        className="absolute w-[1.5px] h-3 bg-[#242424] rounded-full origin-center"
                        style={{ willChange: 'transform' }}
                      />
                      {/* Vertical bar: -180deg (Closed, looks vertical) -> 90deg (Opened, becomes horizontal) */}
                      <motion.span
                        animate={{ rotate: isOpen ? 90 : -180 }}
                        transition={springTransition}
                        className="absolute w-[1.5px] h-3 bg-[#242424] rounded-full origin-center"
                        style={{ willChange: 'transform' }}
                      />
                    </div>
                  </div>

                  {/* Expand / Collapse Answer Reveal with exact Spring physics */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: springTransition,
                            opacity: { duration: 0.25, delay: 0.05 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: springTransition,
                            opacity: { duration: 0.15 },
                          },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pr-6 sm:pr-8">
                          <p className="font-sans text-[15px] sm:text-[16px] text-[#686863] leading-[1.55] tracking-[-0.01em]">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            );
          })}
        </div>

        {/* View All FAQs link if limited */}
        {showAllLink && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('/faq');
                } else if (typeof window !== 'undefined') {
                  window.location.href = '/faq';
                }
              }}
              className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold tracking-wide text-[#242424] hover:text-[#C9892E] transition-colors cursor-pointer border-b border-[#242424] pb-0.5 hover:border-[#C9892E]"
            >
              <span>EXPLORE COMPLETE KNOWLEDGE BASE</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

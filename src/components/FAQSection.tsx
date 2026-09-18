import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQS, FaqItem } from '../data/himalayanHarvest';
import { AnimatedHeading } from './motion/AnimatedHeading';

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
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const displayedFaqs: FaqItem[] = limit ? FAQS.slice(0, limit) : FAQS;

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="relative w-full py-20 lg:py-28 bg-[#FAF8F0] border-t border-[#D9D5C8]">
      <div className="max-w-[1080px] mx-auto px-6 md:px-10">
        {/* Editorial Eyebrow & Masked Heading */}
        <div className="text-center max-w-[700px] mx-auto mb-14 md:mb-18 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#123C2D] font-medium">
              COMMON INQUIRIES
            </span>
            <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
          </motion.div>

          <AnimatedHeading
            text="FREQUENTLY ASKED QUESTIONS"
            as="h2"
            animateOnMount={true}
            className="font-serif text-[32px] sm:text-[44px] md:text-[50px] font-semibold text-[#123C2D] leading-[1.1] tracking-[-0.01em]"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-[16px] sm:text-[18px] text-[#2A2118]/80 leading-[1.5]"
          >
            Clear, transparent answers about our high-altitude harvests, testing protocols, and delivery across India.
          </motion.p>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-[#D9D5C8] border-y border-[#D9D5C8]">
          {displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="transition-colors duration-200 hover:bg-[#F5F1E6]/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-6 sm:py-7 flex items-start justify-between gap-6 text-left cursor-pointer group"
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <span className="font-mono text-[13px] sm:text-[14px] text-[#D6A83A] font-semibold tracking-wider pt-1 flex-shrink-0">
                      {faq.number}
                    </span>
                    <h3 className="font-serif text-[18px] sm:text-[21px] md:text-[23px] text-[#123C2D] font-medium leading-[1.3] group-hover:text-[#D6A83A] transition-colors">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Rotating Animated Plus / Close Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#123C2D] text-[#FAF8F0]'
                        : 'bg-white text-[#123C2D] border border-[#D9D5C8] group-hover:border-[#123C2D]'
                    }`}
                  >
                    <motion.svg
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </motion.svg>
                  </div>
                </button>

                {/* Animated Body Reveal */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.3, delay: 0.08 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-7 pl-10 sm:pl-12 pr-4 sm:pr-14">
                        <p className="font-sans text-[15px] sm:text-[16px] text-[#2A2118]/85 leading-[1.65]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
              className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold tracking-wide text-[#123C2D] hover:text-[#D6A83A] transition-colors cursor-pointer border-b border-[#123C2D] pb-0.5 hover:border-[#D6A83A]"
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

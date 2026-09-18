import React from 'react';
import { motion } from 'framer-motion';
import { TESTIMONIALS } from '../data/himalayanHarvest';
import { CustomerAvatar } from '../components/CustomerAvatar';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { PageTransition } from '../components/motion/PageTransition';
import { QuoteIcon } from '../components/Icons';

interface ReviewsPageProps {
  onNavigate: (path: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="w-full bg-[#F5F1E6] min-h-screen py-10 md:py-18">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#607568]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#123C2D] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#123C2D] font-semibold">REVIEWS</span>
          </nav>

          {/* Editorial Banner */}
          <div className="text-center max-w-[780px] mx-auto mb-14 md:mb-20 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#123C2D] font-semibold">
                COMMUNITY VOICES
              </span>
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="REAL PEOPLE. REAL RESULTS."
              as="h1"
              className="font-serif text-[38px] sm:text-[52px] md:text-[60px] font-semibold text-[#123C2D] leading-[1.05] tracking-[-0.02em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="font-sans text-[17px] sm:text-[19px] text-[#2A2118]/85 leading-[1.55]"
            >
              Unfiltered reflections from our customers across Tamil Nadu, Karnataka, and beyond who treasure honest, raw high-altitude honey.
            </motion.p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#FAF8F0] border border-[#D9D5C8] rounded-[22px] p-7 sm:p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(18,60,45,0.04)] hover:shadow-[0_12px_32px_rgba(18,60,45,0.08)] hover:border-[#D6A83A]/60 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Top Row: Avatar + Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={t.author} image={t.image} size={48} />
                      <div>
                        <h3 className="font-sans text-[16px] font-bold text-[#123C2D] leading-tight">
                          {t.author}
                        </h3>
                        {t.location && (
                          <span className="font-sans text-[12px] text-[#607568] block mt-0.5">
                            {t.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white text-[#D6A83A] border border-[#D9D5C8]/80 shadow-2xs">
                      <QuoteIcon size={16} color="#D6A83A" />
                    </div>
                  </div>

                  {/* Rating Stars */}
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

                  {/* Customer Quote */}
                  <p className="font-serif text-[17px] text-[#123C2D] leading-[1.5]">
                    "{t.quote}"
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-5 mt-6 border-t border-[#D9D5C8] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#607568] tracking-wider uppercase">
                    HIMALAYAN HARVEST
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#123C2D]/10 text-[#123C2D] font-bold">
                    {t.role || 'VERIFIED EXPERIENCE'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action */}
          <div className="text-center py-12 px-6 rounded-[22px] bg-[#08291F] text-[#FAF8F0] space-y-5">
            <h2 className="font-serif text-[28px] sm:text-[34px] font-semibold">
              Ready to experience pure mountain honey?
            </h2>
            <p className="font-sans text-[16px] text-[#F5F1E6]/80 max-w-[520px] mx-auto">
              Join hundreds of happy families enjoying authentic raw honeys harvested with four generations of care.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <button
                onClick={() => onNavigate('/shop')}
                className="px-8 py-3.5 rounded-full bg-[#D6A83A] hover:bg-[#C99528] text-[#08291F] font-sans text-[15px] font-bold transition-all cursor-pointer"
              >
                ORDER NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

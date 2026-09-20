import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONFIG } from '../data/himalayanHarvest';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { TextRevealOnScroll } from '../components/motion/TextRevealOnScroll';
import { PageTransition } from '../components/motion/PageTransition';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-18">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold">OUR STORY</span>
          </nav>

          {/* Hero Story Banner */}
          <div className="text-center max-w-[850px] mx-auto mb-16 md:mb-20 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#242424] font-semibold">
                OUR HERITAGE
              </span>
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="FOUR GENERATIONS. ONE TRADITION."
              as="h1"
              className="font-serif text-[38px] sm:text-[52px] md:text-[62px] font-semibold text-[#242424] leading-[1.05] tracking-[-0.02em]"
            />

            <TextRevealOnScroll
              text="A honey harvesting tradition carried through four generations, bringing the sweetness of Himalayan honey from the high peaks to homes in Tamil Nadu and beyond."
              as="p"
              className="font-sans text-[17px] sm:text-[20px] text-[#242424]/85 leading-[1.6]"
            />
          </div>

          {/* Two-Column Editorial Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-20">
            <div className="lg:col-span-6 space-y-6 text-[#242424]/90 font-sans text-[16px] sm:text-[17px] leading-[1.7]">
              <div className="inline-block px-3 py-1 rounded-full bg-[#242424]/10 text-[#242424] font-mono text-[11px] font-bold uppercase tracking-wider">
                {BRAND_CONFIG.heritage}
              </div>
              <h2 className="font-serif text-[30px] sm:text-[38px] font-semibold text-[#242424] leading-[1.15]">
                Harvested where nature remains untouched.
              </h2>
              <p>
                Our story began in high-altitude mountain forests where native bees harvest nectar from wild flowering trees and rare blossoms. For four generations, our family has practiced ethical, sustainable harvesting methods that preserve the hives and keep nature in balance.
              </p>
              <p>
                Unlike commercial industrial operations that blend sugar syrups and pasteurize honey until it loses its natural character, Himalayan Harvest Honey is bottled directly from the comb. It arrives on your table raw, dense with wild pollen, and bursting with authentic mountain complexity.
              </p>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-[22px] overflow-hidden border border-[#D9D7D0] shadow-[0_16px_40px_rgba(36, 36, 36,0.08)]">
                <img
                  src="/images/story_apiary.jpg"
                  alt="Himalayan Harvest traditional mountain apiary nestled in high peaks"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>

          {/* The Pillars of Our Tradition */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-8 sm:p-12 mb-20">
            <div className="text-center max-w-[600px] mx-auto mb-12 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold">
                TIME-HONORED STANDARDS
              </span>
              <h3 className="font-serif text-[28px] sm:text-[34px] font-semibold text-[#242424]">
                How We Protect the Harvest
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-[16px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/80 space-y-3">
                <span className="font-mono text-[16px] text-[#C9892E] font-bold">01</span>
                <h4 className="font-serif text-[20px] font-semibold text-[#242424]">
                  Unheated & Unpasteurized
                </h4>
                <p className="font-sans text-[14px] text-[#242424]/80 leading-[1.6]">
                  Heat destroys the beneficial invertase and diastase enzymes in honey. We never warm our honey beyond the natural hive temperature.
                </p>
              </div>

              <div className="p-6 rounded-[16px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/80 space-y-3">
                <span className="font-mono text-[16px] text-[#C9892E] font-bold">02</span>
                <h4 className="font-serif text-[20px] font-semibold text-[#242424]">
                  Zero Additives or Dilution
                </h4>
                <p className="font-sans text-[14px] text-[#242424]/80 leading-[1.6]">
                  No rice syrup, no corn sweetener, no commercial adulterants. Every batch is certified compliant under Indian Standard IS 4941.
                </p>
              </div>

              <div className="p-6 rounded-[16px] bg-[#F4F1EA]/70 border border-[#D9D7D0]/80 space-y-3">
                <span className="font-mono text-[16px] text-[#C9892E] font-bold">03</span>
                <h4 className="font-serif text-[20px] font-semibold text-[#242424]">
                  Generational Craftsmanship
                </h4>
                <p className="font-sans text-[14px] text-[#242424]/80 leading-[1.6]">
                  Knowledge passed down from fathers to sons, preserving delicate wild combs and safeguarding traditional mountain bee colonies.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="text-center py-12 px-6 rounded-[22px] bg-[#242424] text-[#F4F1EA] space-y-6">
            <h3 className="font-serif text-[28px] sm:text-[36px] font-semibold">
              Taste the heritage of the peaks.
            </h3>
            <p className="font-sans text-[16px] text-[#FAF9F5]/80 max-w-[500px] mx-auto">
              Explore our current season's harvests delivered safely to your doorstep.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/shop')}
                className="px-8 py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all cursor-pointer"
              >
                EXPLORE SHOP
              </button>
              <button
                onClick={() => onNavigate('/lab-reports')}
                className="px-7 py-3.5 rounded-full border border-white/30 hover:border-white text-white font-sans text-[14px] font-medium transition-all cursor-pointer"
              >
                VIEW LAB REPORTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

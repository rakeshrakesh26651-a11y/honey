import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_CONFIG, WHATSAPP_NUMBER } from '../data/himalayanHarvest';
import { AnimatedHeading } from '../components/motion/AnimatedHeading';
import { PageTransition } from '../components/motion/PageTransition';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="w-full bg-[#F4F1EA] min-h-screen py-10 md:py-18">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-[13px] font-mono text-[#686863]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#242424] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#242424] font-semibold">CONTACT</span>
          </nav>

          {/* Editorial Banner */}
          <div className="text-center max-w-[760px] mx-auto mb-14 md:mb-18 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-2"
            >
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#242424] font-semibold">
                DIRECT CUSTOMER DESK
              </span>
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
            </motion.div>

            <AnimatedHeading
              text="GET IN TOUCH"
              as="h1"
              className="font-serif text-[38px] sm:text-[50px] md:text-[58px] font-semibold text-[#242424] leading-[1.05] tracking-[-0.02em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="font-sans text-[17px] sm:text-[19px] text-[#242424]/85 leading-[1.55]"
            >
              Reach out directly to our team for order inquiries, wholesale distribution, or custom corporate gift requirements.
            </motion.p>
          </div>

          {/* Contact Channels Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* WhatsApp / Phone Channel */}
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[22px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(36,36,36,0.04)] space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#242424] text-[#DDAA55] flex items-center justify-center shadow-xs">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  PHONE & WHATSAPP
                </span>
                <h3 className="font-serif text-[26px] font-semibold text-[#242424]">
                  {BRAND_CONFIG.contactNumber}
                </h3>
                <p className="font-sans text-[15px] text-[#242424]/80 leading-[1.6]">
                  Instant response for order questions, address corrections, parcel tracking, or wholesale quantity discounts.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20connect%20with%20your%20team.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold tracking-wide transition-all duration-200 shadow-sm"
                >
                  START WHATSAPP CHAT
                </a>
              </div>
            </div>

            {/* Instagram Community Channel */}
            <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[22px] p-8 sm:p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(36,36,36,0.04)] space-y-6">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#242424] text-[#DDAA55] flex items-center justify-center shadow-xs">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </div>

                <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold block">
                  COMMUNITY & SOCIAL
                </span>
                <h3 className="font-serif text-[26px] font-semibold text-[#242424]">
                  {BRAND_CONFIG.instagramHandle}
                </h3>
                <p className="font-sans text-[15px] text-[#242424]/80 leading-[1.6]">
                  Follow our mountain harvesting journey, seasonal announcements, recipe ideas, and customer stories.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={BRAND_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-full bg-[#FAF9F5] hover:bg-[#242424] text-[#242424] hover:text-[#FAF9F5] border-2 border-[#242424] font-sans text-[14px] font-bold tracking-wide transition-all duration-200"
                >
                  VIEW INSTAGRAM PROFILE
                </a>
              </div>
            </div>
          </div>

          {/* Wholesale Notice */}
          <div className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[22px] p-8 sm:p-10 text-center space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#C9892E] font-bold">
              FOOD WHOLESALE & BULK ORDERS
            </span>
            <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold text-[#242424]">
              Looking to supply retail stores, hotels, or corporate gifting?
            </h3>
            <p className="font-sans text-[15px] text-[#242424]/85 max-w-[640px] mx-auto leading-[1.6]">
              We supply custom batches of laboratory-certified wild honey and artisanal cultured ghee in calibrated bulk pack sizes with specialized labeling options.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20am%20interested%20in%20Wholesale%20and%20Bulk%20purchasing.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[15px] font-bold transition-all shadow-sm"
              >
                REQUEST WHOLESALE PRICING
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

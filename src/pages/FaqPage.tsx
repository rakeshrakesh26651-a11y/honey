import React from 'react';
import { FAQSection } from '../components/FAQSection';
import { PageTransition } from '../components/motion/PageTransition';

interface FaqPageProps {
  onNavigate: (path: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      <div className="w-full bg-[#FAF8F0] min-h-screen py-10 md:py-16">
        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-[13px] font-mono text-[#607568]">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-[#123C2D] transition-colors cursor-pointer"
            >
              HOME
            </button>
            <span>/</span>
            <span className="text-[#123C2D] font-semibold">FREQUENTLY ASKED QUESTIONS</span>
          </nav>

          {/* Full Accordion */}
          <FAQSection onNavigate={onNavigate} />

          {/* Help Desk Contact Card */}
          <div className="mt-14 p-8 rounded-[20px] bg-[#F5F1E6] border border-[#D9D5C8] text-center space-y-4">
            <h3 className="font-serif text-[24px] font-semibold text-[#123C2D]">
              Still have questions?
            </h3>
            <p className="font-sans text-[15px] text-[#2A2118]/80 max-w-[500px] mx-auto">
              Our customer care team is available on WhatsApp to guide your selection or assist with tracking your shipment.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20have%20a%20question%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#123C2D] hover:bg-[#D6A83A] hover:text-[#08291F] text-[#FAF8F0] font-sans text-[14px] font-bold transition-all"
              >
                CHAT ON WHATSAPP (+91 81243 91725)
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

import React from 'react';
import { InstagramIcon } from './Icons';
import { TextRevealOnScroll } from './motion/TextRevealOnScroll';

interface FooterProps {
  onOpenCart: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCart, onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate && !path.startsWith('http') && !path.startsWith('tel:') && !path.startsWith('mailto:')) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="relative w-full bg-[#181816] text-[#FAF8F5] pt-12 sm:pt-16 pb-8 sm:pb-10 border-t border-white/10 select-none">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 md:px-10">
        {/* Main 4-Column Grid with thin vertical column dividers on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0">
          
          {/* 1. LEFT BRAND COLUMN (spans 5 on lg with thin right divider) */}
          <div className="lg:col-span-5 lg:pr-10 lg:border-r lg:border-white/10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {/* Logo */}
              <a
                href="/"
                onClick={(e) => handleLinkClick(e, '/')}
                className="inline-flex items-center space-x-2.5 hover:opacity-90 transition-opacity"
                aria-label="Himalayan Harvest Honey"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-[#C9892E] flex-shrink-0"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 19H22L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M12 9L7 19H17L12 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="12" cy="14.5" r="1.2" fill="currentColor" />
                </svg>
                <span className="font-serif text-[18px] sm:text-[20px] font-semibold text-[#FAF8F5] tracking-[-0.01em] whitespace-nowrap leading-none">
                  HIMALAYAN HARVEST HONEY
                </span>
              </a>

              {/* Short Brand Description */}
              <TextRevealOnScroll
                text="Pure Himalayan honey rooted in generations of harvesting tradition. Harvested directly from native mountain peaks."
                as="p"
                className="font-sans text-[14px] leading-[1.65] text-[#D9D7D0]/80 max-w-[340px]"
              />
            </div>

            {/* Phone & Instagram */}
            <div className="space-y-2.5 font-sans text-[13.5px]">
              <div>
                <a
                  href="tel:+918124391725"
                  className="font-mono text-[13.5px] text-[#FAF8F5] hover:text-[#C9892E] transition-colors tracking-wide inline-flex items-center gap-2"
                >
                  <span className="text-[#C9892E]">TEL</span>
                  <span>+91 81243 91725</span>
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#D9D7D0]/80 hover:text-[#C9892E] transition-colors"
                >
                  <InstagramIcon size={15} color="#C9892E" />
                  <span>@himalayanharvesthoney</span>
                </a>
              </div>
            </div>

            {/* Premium Gold WhatsApp CTA */}
            <div className="pt-1">
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20order%20pure%20honey."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[42px] px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[13px] font-bold tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer w-fit"
              >
                <span>ORDER ON WHATSAPP</span>
              </a>
            </div>
          </div>

          {/* Navigation Groups Wrapper */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-0">
            {/* 2. EXPLORE COLUMN */}
            <div className="lg:px-8 lg:border-r lg:border-white/10 space-y-4">
              <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-semibold">
                EXPLORE
              </p>
              <ul className="space-y-2.5 font-sans text-[14px]">
                <li>
                  <a
                    href="/"
                    onClick={(e) => handleLinkClick(e, '/')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/shop"
                    onClick={(e) => handleLinkClick(e, '/shop')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Shop Honey
                  </a>
                </li>
                <li>
                  <a
                    href="/lab-reports"
                    onClick={(e) => handleLinkClick(e, '/lab-reports')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Quality & Lab Reports
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    onClick={(e) => handleLinkClick(e, '/faq')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors text-left cursor-pointer py-0.5"
                  >
                    Cart
                  </button>
                </li>
              </ul>
            </div>

            {/* 3. OUR STORY COLUMN */}
            <div className="lg:px-8 lg:border-r lg:border-white/10 space-y-4">
              <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-semibold">
                OUR STORY
              </p>
              <ul className="space-y-2.5 font-sans text-[14px]">
                <li>
                  <a
                    href="/about"
                    onClick={(e) => handleLinkClick(e, '/about')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Our Heritage
                  </a>
                </li>
                <li>
                  <a
                    href="/lab-reports"
                    onClick={(e) => handleLinkClick(e, '/lab-reports')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Laboratory Purity
                  </a>
                </li>
                <li>
                  <a
                    href="/reviews"
                    onClick={(e) => handleLinkClick(e, '/reviews')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Customer Reviews
                  </a>
                </li>
              </ul>
            </div>

            {/* 4. HELP & WHOLESALE COLUMN */}
            <div className="col-span-2 sm:col-span-1 lg:pl-8 space-y-4">
              <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-semibold">
                HELP & WHOLESALE
              </p>
              <ul className="space-y-2.5 font-sans text-[14px]">
                <li>
                  <a
                    href="/contact"
                    onClick={(e) => handleLinkClick(e, '/contact')}
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20confirm%20availability%20and%20pricing."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    WhatsApp Ordering
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/himalayanharvesthoney"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FAF8F5]/80 hover:text-[#C9892E] transition-colors block py-0.5"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. BOTTOM ROW (Thin horizontal divider above legal row) */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] sm:text-[13px] text-[#FAF8F5]/60 font-sans">
          {/* Copyright */}
          <p className="text-center sm:text-left">
            © 2026 Himalayan Harvest Honey. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
            <a
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, '/privacy-policy')}
              className="hover:text-[#C9892E] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-white/20 select-none hidden xs:inline">•</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => handleLinkClick(e, '/terms-and-conditions')}
              className="hover:text-[#C9892E] transition-colors"
            >
              Terms & Conditions
            </a>
            <span className="text-white/20 select-none hidden xs:inline">•</span>
            <a
              href="/refund-policy"
              onClick={(e) => handleLinkClick(e, '/refund-policy')}
              className="hover:text-[#C9892E] transition-colors"
            >
              Refund & Return Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

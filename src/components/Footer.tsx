import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenCart: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate && !path.startsWith('http') && !path.startsWith('tel:') && !path.startsWith('mailto:')) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="relative w-full bg-[#181816] text-[#FAF8F5] pt-8 sm:pt-12 pb-7 sm:pb-9 border-t border-white/10 select-none">
      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 md:px-10">
        
        {/* 1. BRAND & CONTACT SECTION */}
        <div className="space-y-4 max-w-[480px] sm:max-w-none">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              className="inline-block hover:opacity-90 transition-opacity"
              aria-label="Himalayan Harvest Honey"
            >
              <BrandLogo variant="footer" />
            </a>
          </div>

          {/* Short Brand Description */}
          <p className="font-sans text-[13.5px] sm:text-[14px] leading-[1.65] text-[#D9D7D0]/85 max-w-[420px]">
            Pure Himalayan honey rooted in generations of harvesting tradition. Harvested directly from native mountain peaks.
          </p>

          {/* Phone & Instagram */}
          <div className="space-y-2.5 pt-1 font-sans text-[13.5px] sm:text-[14px]">
            <div>
              <a
                href="tel:+918124391725"
                className="inline-flex items-center space-x-2.5 text-[#FAF8F5]/90 hover:text-[#C9892E] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#C9892E] flex-shrink-0" fill="currentColor" aria-hidden="true">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" />
                </svg>
                <span>+91 81243 91725</span>
              </a>
            </div>
            <div>
              <a
                href="https://instagram.com/himalayanharvesthoney"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 text-[#FAF8F5]/90 hover:text-[#C9892E] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#C9892E] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>@himalayanharvesthoney</span>
              </a>
            </div>
          </div>

          {/* Order On WhatsApp Pill Button */}
          <div className="pt-2">
            <a
              href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20order%20pure%20honey."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2.5 h-[42px] px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[12.5px] sm:text-[13px] font-bold tracking-wider uppercase transition-all shadow-sm active:scale-95 cursor-pointer w-fit"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#242424] flex-shrink-0" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.49 0-2.95-.4-4.22-1.15l-.3-.18-3.13.82.83-3.05-.2-.32a8.188 8.188 0 01-1.26-4.47c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.182 8.182 0 012.41 5.82c.01 4.54-3.69 8.24-8.24 8.24z" />
              </svg>
              <span>ORDER ON WHATSAPP</span>
            </a>
          </div>
        </div>

        {/* 3. TWO-COLUMN NAVIGATION (OUR STORY / HELP & WHOLESALE with thin divider) */}
        <div className="grid grid-cols-2 gap-0 pt-7 pb-6 sm:pt-8 sm:pb-8 border-b border-white/10">
          {/* OUR STORY */}
          <div className="pr-4 sm:pr-8 border-r border-white/10 space-y-3">
            <p className="font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-bold">
              OUR STORY
            </p>
            <ul className="space-y-2 sm:space-y-2.5 font-sans text-[13.5px] sm:text-[14px]">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  Our Heritage
                </a>
              </li>
              <li>
                <a
                  href="/lab-reports"
                  onClick={(e) => handleLinkClick(e, '/lab-reports')}
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  Laboratory Purity
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  onClick={(e) => handleLinkClick(e, '/reviews')}
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* HELP & WHOLESALE */}
          <div className="pl-4 sm:pl-8 space-y-3">
            <p className="font-sans text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-[#C9892E] font-bold">
              HELP & WHOLESALE
            </p>
            <ul className="space-y-2 sm:space-y-2.5 font-sans text-[13.5px] sm:text-[14px]">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20confirm%20availability%20and%20pricing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  WhatsApp Ordering
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FAF8F5]/85 hover:text-[#C9892E] transition-colors block py-0.5"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. BOTTOM LEGAL & COPYRIGHT ROW */}
        <div className="pt-6 flex flex-col items-center justify-center space-y-2.5 text-[12px] sm:text-[12.5px] text-[#FAF8F5]/60 font-sans text-center">
          {/* Copyright */}
          <p>
            © 2026 Himalayan Harvest Honey. All rights reserved.
          </p>

          {/* Legal Links with vertical pipe separators */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1">
            <a
              href="/privacy-policy"
              onClick={(e) => handleLinkClick(e, '/privacy-policy')}
              className="hover:text-[#C9892E] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-white/20 select-none">|</span>
            <a
              href="/terms-and-conditions"
              onClick={(e) => handleLinkClick(e, '/terms-and-conditions')}
              className="hover:text-[#C9892E] transition-colors"
            >
              Terms & Conditions
            </a>
            <span className="text-white/20 select-none">|</span>
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

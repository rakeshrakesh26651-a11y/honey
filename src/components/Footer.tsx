import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { InstagramIcon } from './Icons';

interface FooterProps {
  onOpenCart: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCart, onNavigate }) => {
  const footerRef = useRef<HTMLElement>(null);

  // Track scroll progress as the footer enters and reaches bottom of viewport
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });

  // Subtle scrub smoothing to eliminate micro-jitter while tracking scroll directly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 350,
    damping: 35,
    mass: 0.1,
  });

  // Physical scroll-scrubbed upward translation: 85% -> 0% (reversible, no fade)
  const wordmarkY = useTransform(smoothProgress, [0, 1], ['85%', '0%']);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate && !path.startsWith('http') && !path.startsWith('tel:') && !path.startsWith('mailto:')) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#242424] text-[#F4F1EA] pt-20 sm:pt-24 pb-10 overflow-hidden border-t border-[#242424]"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-12 sm:gap-14">
        {/* Top Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column (spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2.5">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#DDAA55] flex-shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 19H22L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M12 9L7 19H17L12 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <circle cx="12" cy="14.5" r="1.2" fill="currentColor" />
              </svg>
              <h3 className="font-serif text-[22px] font-semibold text-[#F4F1EA] tracking-[-0.01em]">
                HIMALAYAN HARVEST HONEY
              </h3>
            </div>

            <p className="font-sans text-[15px] leading-[1.6] text-[#D9D7D0] max-w-[320px]">
              Pure Himalayan honey rooted in generations of harvesting tradition.
            </p>

            {/* Contact & Social Links */}
            <div className="space-y-2 pt-1 font-sans text-[14px]">
              <div>
                <a
                  href="tel:+918124391725"
                  className="text-[#F4F1EA] hover:text-[#DDAA55] transition-colors font-mono text-[14px]"
                >
                  +91 81243 91725
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-[#D9D7D0] hover:text-[#DDAA55] transition-colors"
                >
                  <InstagramIcon size={16} color="#DDAA55" />
                  <span>@himalayanharvesthoney</span>
                </a>
              </div>
            </div>

            {/* WhatsApp CTA Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0AI%20would%20like%20to%20order%20pure%20honey."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[44px] px-7 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold tracking-wide transition-all shadow-md cursor-pointer"
              >
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-semibold text-[#F4F1EA] tracking-wide">
              Explore
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-[#D9D7D0]">
              <li>
                <a
                  href="/"
                  onClick={(e) => handleLinkClick(e, '/')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleLinkClick(e, '/shop')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Shop Honey
                </a>
              </li>
              <li>
                <a
                  href="/lab-reports"
                  onClick={(e) => handleLinkClick(e, '/lab-reports')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Quality & Lab Reports
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleLinkClick(e, '/faq')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCart}
                  className="hover:text-[#DDAA55] transition-colors text-left text-[#D9D7D0] cursor-pointer"
                >
                  Cart
                </button>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-semibold text-[#F4F1EA] tracking-wide">
              Our Story
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-[#D9D7D0]">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick(e, '/about')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Our Heritage
                </a>
              </li>
              <li>
                <a
                  href="/lab-reports"
                  onClick={(e) => handleLinkClick(e, '/lab-reports')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Laboratory Purity
                </a>
              </li>
              <li>
                <a
                  href="/reviews"
                  onClick={(e) => handleLinkClick(e, '/reviews')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          {/* Wholesale & Contact */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-semibold text-[#F4F1EA] tracking-wide">
              Help & Wholesale
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-[#D9D7D0]">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick(e, '/contact')}
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20confirm%20availability%20and%20pricing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  WhatsApp Ordering
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#DDAA55] transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Scroll-Linked Giant Brand Typography: HIMALAYAN */}
        <div
          data-framer-name="Big Wordmark"
          className="w-full overflow-hidden select-none py-2 sm:py-4 lg:py-6 flex items-center justify-center relative px-2"
        >
          <motion.div
            style={{ y: wordmarkY }}
            className="w-full flex justify-center items-center will-change-transform"
          >
            <div
              id="footer-giant-wordmark"
              className="font-serif font-semibold text-[#F4F1EA] whitespace-nowrap text-center text-[clamp(2.8rem,10.8vw,155px)] leading-[0.92] select-none pointer-events-none w-full"
              style={{
                fontFamily: 'Recia, "Recia Placeholder", serif',
                letterSpacing: '-0.02em',
              }}
            >
              HIMALAYAN
            </div>
          </motion.div>
        </div>

        {/* Legal Policy Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 gap-y-2 text-[13px] sm:text-[14px] text-[#D9D7D0] font-sans border-t border-[#242424] pt-6">
          <a
            href="/privacy-policy"
            onClick={(e) => handleLinkClick(e, '/privacy-policy')}
            className="hover:text-[#DDAA55] transition-colors py-1.5 px-2 inline-block rounded-md hover:bg-white/5 active:bg-white/10"
          >
            Privacy Policy
          </a>
          <span className="text-[#D9D7D0]/40 select-none hidden xs:inline">|</span>
          <a
            href="/terms-and-conditions"
            onClick={(e) => handleLinkClick(e, '/terms-and-conditions')}
            className="hover:text-[#DDAA55] transition-colors py-1.5 px-2 inline-block rounded-md hover:bg-white/5 active:bg-white/10"
          >
            Terms & Conditions
          </a>
          <span className="text-[#D9D7D0]/40 select-none hidden xs:inline">|</span>
          <a
            href="/refund-policy"
            onClick={(e) => handleLinkClick(e, '/refund-policy')}
            className="hover:text-[#DDAA55] transition-colors py-1.5 px-2 inline-block rounded-md hover:bg-white/5 active:bg-white/10"
          >
            Refund & Return Policy
          </a>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#D9D7D0]/70 font-sans space-y-2 sm:space-y-0 border-t border-[#242424] pt-4">
          <p>© 2026 Himalayan Harvest Honey. All rights reserved.</p>
          <p className="hover:opacity-80 transition-opacity">
            Purity from the mountains
          </p>
        </div>
      </div>
    </footer>
  );
};

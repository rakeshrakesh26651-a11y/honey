import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { InstagramIcon } from './Icons';

interface FooterProps {
  onOpenCart: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCart }) => {
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

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#1e1a16] text-white pt-20 sm:pt-24 pb-10 overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col gap-14 sm:gap-16">
        {/* Top Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column (spans 2 on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2.5">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white flex-shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 19H22L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M12 9L7 19H17L12 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <circle cx="12" cy="14.5" r="1.2" fill="currentColor" />
              </svg>
              <h3 className="font-serif text-[22px] font-semibold text-white tracking-[-0.01em]">
                HIMALAYAN HARVEST HONEY
              </h3>
            </div>

            <p className="font-sans text-[15px] leading-[1.6] text-white/80 max-w-[320px]">
              Pure Himalayan honey rooted in generations of harvesting tradition.
            </p>

            {/* Contact & Social Links */}
            <div className="space-y-2 pt-1 font-sans text-[14px]">
              <div>
                <a
                  href="tel:+918124391725"
                  className="text-white hover:opacity-70 transition-opacity font-mono text-[14px]"
                >
                  +91 81243 91725
                </a>
              </div>
              <div>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
                >
                  <InstagramIcon size={16} color="#ffffff" />
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
                className="inline-flex items-center justify-center h-[42px] px-6 rounded-full bg-[#657044] hover:bg-[#525b37] text-white font-sans text-[14px] font-medium transition-all shadow-sm"
              >
                ORDER ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-medium text-white tracking-wide">
              Explore
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-white/85">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#lineup" className="hover:text-white transition-colors">
                  Shop
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-white transition-colors">
                  Special Offers
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenCart}
                  className="hover:text-white transition-colors text-left text-white/85 cursor-pointer"
                >
                  Cart
                </button>
              </li>
            </ul>
          </div>

          {/* About Links */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-medium text-white tracking-wide">
              Our Story
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-white/85">
              <li>
                <a href="#story" className="hover:text-white transition-colors">
                  Our Heritage
                </a>
              </li>
              <li>
                <a href="#quality" className="hover:text-white transition-colors">
                  Quality & Lab Report
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#wild" className="hover:text-white transition-colors">
                  Community Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Wholesale & Contact */}
          <div className="space-y-4">
            <p className="font-sans text-[15px] font-medium text-white tracking-wide">
              Wholesale & Help
            </p>
            <ul className="space-y-2.5 font-sans text-[15px] text-white/85">
              <li>
                <a href="#wholesale" className="hover:text-white transition-colors">
                  Wholesale Enquiry
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B%0A%0APlease%20confirm%20availability%20and%20pricing."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Contact on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/himalayanharvesthoney"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Scroll-Linked Giant Brand Typography */}
        <div
          data-framer-name="Big Wordmark"
          className="w-full overflow-hidden select-none py-4 sm:py-6 lg:py-8 flex items-center justify-center relative"
        >
          <motion.div
            style={{ y: wordmarkY }}
            className="w-full flex justify-center items-center will-change-transform"
          >
            <div
              className="font-serif font-semibold text-white tracking-[-0.02em] whitespace-nowrap text-center text-[76px] xs:text-[96px] sm:text-[124px] md:text-[156px] lg:text-[190px] xl:text-[220px] leading-[0.92] select-none pointer-events-none"
              style={{
                fontFamily: 'Recia, "Recia Placeholder", serif',
              }}
            >
              HIMALAYAN HARVEST
            </div>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[13px] text-white font-sans space-y-2 sm:space-y-0 opacity-90 border-t border-white/10 pt-6">
          <p>© 2026 Himalayan Harvest Honey. All rights reserved.</p>
          <p className="hover:opacity-80 transition-opacity">
            Purity from the mountains
          </p>
        </div>
      </div>
    </footer>
  );
};

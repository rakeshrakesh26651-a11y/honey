import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from './BrandLogo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentPath = '/',
}) => {
  const mainLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Cart', href: '/cart' },
    { label: 'Our Story', href: '/about' },
    { label: 'Lab Report', href: '/lab-reports' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onClose();
    if (onNavigate && !href.startsWith('http')) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden bg-[#F4F1EA] border-b border-[#D9D7D0] lg:hidden z-30"
        >
          <div className="px-6 py-6 flex flex-col space-y-5">
            {/* Top: Brand Logo */}
            <div className="pb-3 border-b border-[#D9D7D0]">
              <a href="/" onClick={(e) => handleLinkClick(e, '/')}>
                <BrandLogo variant="mobile" />
              </a>
            </div>

            {/* Main Navigation Links */}
            <nav className="flex flex-col space-y-3.5">
              {mainLinks.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`font-sans text-[20px] font-medium tracking-wide transition-colors ${
                      isActive ? 'text-[#C9892E] font-semibold' : 'text-[#242424] hover:text-[#C9892E]'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* WhatsApp Direct Action */}
            <div className="pt-2">
              <a
                href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>ORDER VIA WHATSAPP (+91 81243 91725)</span>
              </a>
            </div>

            {/* Secondary Policy Links */}
            <div className="pt-4 border-t border-[#D9D7D0] flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-mono text-[#686863]">
              {policyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-[#242424] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

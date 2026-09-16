import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandLogo } from './BrandLogo';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const links = [
    { label: 'Shop', href: '#lineup' },
    { label: 'Offers', href: '#offers' },
    { label: 'Our Story', href: '#story' },
    { label: 'Quality', href: '#quality' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Wholesale', href: '#wholesale' },
    { label: 'Contact', href: 'https://wa.me/918124391725' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden bg-[#f7f2e7] border-b border-[#1e1a16]/[0.08] lg:hidden z-30"
        >
          <div className="px-6 py-6 flex flex-col space-y-5">
            <div className="pb-3 border-b border-[#1e1a16]/10">
              <BrandLogo variant="mobile" />
            </div>
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="font-sans text-[24px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

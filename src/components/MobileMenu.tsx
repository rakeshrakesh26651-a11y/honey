import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
  const { user, userProfile } = useAuth();

  const mainLinks = [
    { number: '01', label: 'Shop', href: '/shop' },
    { number: '02', label: 'Our Story', href: '/about' },
    { number: '03', label: 'Lab Report', href: '/lab-reports' },
    { number: '04', label: 'FAQ', href: '/faq' },
    { number: '05', label: 'Contact', href: '/contact' },
    user
      ? { number: '06', label: userProfile?.name ? `Account (${userProfile.name.split(' ')[0]})` : 'Account', href: '/account' }
      : { number: '06', label: 'Sign In', href: '/login' },
  ];

  const policyLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Refund Policy', href: '/refund-policy' },
  ];

  // Prevent background body scroll and listen for Escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onClose();
    if (onNavigate && !href.startsWith('http')) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  // Modern Index Navbar signature easing curve & 8 columns
  const columnEasing = [0.76, 0, 0.24, 1];
  const columns = [0, 1, 2, 3, 4, 5, 6, 7];

  // Blinds column variants:
  // Open: sweeps top to bottom (0% to 280ms stagger from left to right)
  // Close: sweeps back up (30ms to 240ms reverse stagger from right to left)
  const columnVariants = {
    closed: (i: number) => ({
      y: '-100%',
      transition: {
        duration: 0.5,
        delay: (7 - i) * 0.03,
        ease: columnEasing,
      },
    }),
    open: (i: number) => ({
      y: '0%',
      transition: {
        duration: 0.55,
        delay: i * 0.04,
        ease: columnEasing,
      },
    }),
  };

  // Variants for menu content and staggered children
  const contentContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.25,
        delay: 0.32,
        delayChildren: 0.35,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      {/* =========================================================================
          1. FULLSCREEN OVERLAY REVEAL (8 STAGGERED CASCADING BLINDS)
          ========================================================================= */}
      <div
        className="fixed inset-0 flex pointer-events-none z-30 lg:hidden"
        aria-hidden="true"
      >
        {columns.map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={columnVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            className="flex-1 h-full bg-[#F4F1EA]"
            style={{ willChange: 'transform' }}
          />
        ))}
      </div>

      {/* =========================================================================
          2. FULLSCREEN NAVIGATION CONTENT & STAGGERED ITEMS
          ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[35] overflow-y-auto lg:hidden pt-[104px] pb-10 px-5 xs:px-6 sm:px-8 flex flex-col justify-between max-w-[1200px] mx-auto box-border"
          >
            <div className="w-full flex flex-col">
              {/* Index indicator */}
              <motion.div
                variants={itemVariants}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#6E6B64] font-semibold mb-3 select-none"
              >
                [ index ]
              </motion.div>

              {/* Main Index Navigation Links */}
              <nav className="flex flex-col w-full">
                {mainLinks.map((link) => {
                  const isActive = currentPath === link.href;
                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      variants={itemVariants}
                      className="group flex flex-col py-3 sm:py-3.5 border-b border-[#D9D7D0] text-decoration-none cursor-pointer select-none transition-colors"
                    >
                      {/* Numeric Indicator */}
                      <span className="font-mono text-[11px] sm:text-[12px] text-[#78756E] tracking-wider leading-none mb-1 transition-colors group-hover:text-[#C9892E]">
                        {link.number}
                      </span>

                      {/* Large Typography Link */}
                      <span
                        className={`font-serif font-bold text-[32px] xs:text-[36px] sm:text-[40px] leading-[1.02] tracking-[-0.03em] transition-colors ${
                          isActive
                            ? 'text-[#C9892E]'
                            : 'text-[#242424] group-hover:text-[#C9892E]'
                        }`}
                      >
                        {link.label}
                      </span>
                    </motion.a>
                  );
                })}
              </nav>

              {/* WhatsApp Direct Action CTA */}
              <motion.div
                variants={itemVariants}
                className="pt-6 sm:pt-7"
              >
                <a
                  href="https://wa.me/918124391725?text=Hello%20Himalayan%20Harvest%20Honey!%20%F0%9F%91%8B"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-[48px] px-6 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[13.5px] sm:text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-sm active:translate-y-0 cursor-pointer text-center"
                >
                  <span>ORDER VIA WHATSAPP (+91 81243 91725)</span>
                </a>
              </motion.div>
            </div>

            {/* Secondary Policy Links */}
            <motion.div
              variants={itemVariants}
              className="pt-6 mt-6 border-t border-[#D9D7D0] flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-mono text-[#5A5852]"
            >
              {policyLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-[#C9892E] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

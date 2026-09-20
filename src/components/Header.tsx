import React from 'react';
import { motion } from 'framer-motion';
import { CartIcon } from './Icons';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onToggleMobileMenu,
  isMobileMenuOpen,
  onNavigate,
  currentPath = '/',
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Our Story', href: '/about' },
    { label: 'Lab Report', href: '/lab-reports' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full bg-[#F4F1EA] border-b border-[#D9D7D0] transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto h-[58px] px-3.5 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="hover:opacity-85 transition-opacity"
            aria-label="Himalayan Harvest Honey Home"
          >
            <BrandLogo variant="header" />
          </a>
        </div>

        {/* Desktop Navigation Links to Dedicated Routes */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
          {navLinks.map((link) => {
            const isActive = currentPath === link.href;

            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`font-sans text-[14.5px] font-medium tracking-wide transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#C9892E] font-semibold'
                    : 'text-[#242424] hover:text-[#C9892E]'
                }`}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9892E] rounded-full"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Group: Cart and Mobile Hamburger */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 lg:space-x-6 flex-shrink-0">
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-1.5 sm:space-x-2 text-[#242424] hover:text-[#C9892E] transition-colors cursor-pointer flex-shrink-0"
            aria-label="View Shopping Cart"
          >
            <CartIcon size={19} color="currentColor" />
            <span className="font-sans text-[13.5px] sm:text-[15px] font-medium leading-none whitespace-nowrap">
              Cart ({cartCount})
            </span>
          </button>

          {/* Mobile Menu Hamburger / X Transition Button */}
          <button
            onClick={onToggleMobileMenu}
            className="relative w-[28px] h-[18px] p-0 bg-transparent border-none cursor-pointer lg:hidden flex flex-col justify-between items-center focus:outline-none select-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span
              className="absolute left-0 w-full h-[2px] bg-[#242424] rounded-full transition-all duration-400 ease-out origin-center"
              style={{
                top: isMobileMenuOpen ? '8px' : '0px',
                transform: isMobileMenuOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            />
            <span
              className="absolute left-0 w-full h-[2px] bg-[#242424] rounded-full transition-all duration-300 ease-out"
              style={{
                top: '8px',
                opacity: isMobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              className="absolute left-0 w-full h-[2px] bg-[#242424] rounded-full transition-all duration-400 ease-out origin-center"
              style={{
                top: isMobileMenuOpen ? '8px' : '16px',
                transform: isMobileMenuOpen ? 'rotate(-45deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

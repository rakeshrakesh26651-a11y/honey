import React from 'react';
import { motion } from 'framer-motion';
import { CartIcon, MenuIcon } from './Icons';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  onToggleMobileMenu,
  onNavigate,
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full bg-[#f7f2e7] border-b border-[#1e1a16]/[0.08] transition-colors duration-200"
    >
      <div className="max-w-[1440px] mx-auto h-[56px] px-4 sm:px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex-shrink-0">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="hover:opacity-80 transition-opacity"
            aria-label="Himalayan Harvest Honey Home"
          >
            <BrandLogo variant="header" />
          </a>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a
            href="/#lineup"
            onClick={(e) => handleLinkClick(e, '/#lineup')}
            className="font-sans text-[15px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
          >
            Shop
          </a>
          <a
            href="/#story"
            onClick={(e) => handleLinkClick(e, '/#story')}
            className="font-sans text-[15px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
          >
            Our Story
          </a>
          <a
            href="/#quality"
            onClick={(e) => handleLinkClick(e, '/#quality')}
            className="font-sans text-[15px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
          >
            Quality
          </a>
          <a
            href="/#reviews"
            onClick={(e) => handleLinkClick(e, '/#reviews')}
            className="font-sans text-[15px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
          >
            Reviews
          </a>
          <a
            href="/#wholesale"
            onClick={(e) => handleLinkClick(e, '/#wholesale')}
            className="font-sans text-[15px] font-medium text-[#1e1a16] hover:opacity-60 transition-opacity"
          >
            Wholesale
          </a>
        </nav>

        {/* Right Group: Cart and Mobile Hamburger */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-[#1e1a16] hover:opacity-60 transition-opacity cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <CartIcon size={20} color="#1e1a16" />
            <span className="font-sans text-[15px] font-medium leading-none">
              Cart ({cartCount})
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onToggleMobileMenu}
            className="p-1 text-[#1e1a16] hover:opacity-60 transition-opacity lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <MenuIcon size={24} color="#1e1a16" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

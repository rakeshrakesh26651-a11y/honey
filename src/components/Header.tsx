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
      className="sticky top-0 z-40 w-full bg-[#F5F1E6] border-b border-[#D9D5C8] transition-colors duration-200"
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
            className="font-sans text-[15px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors"
          >
            Shop
          </a>
          <a
            href="/#story"
            onClick={(e) => handleLinkClick(e, '/#story')}
            className="font-sans text-[15px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors"
          >
            Our Story
          </a>
          <a
            href="/#quality"
            onClick={(e) => handleLinkClick(e, '/#quality')}
            className="font-sans text-[15px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors"
          >
            Quality
          </a>
          <a
            href="/#reviews"
            onClick={(e) => handleLinkClick(e, '/#reviews')}
            className="font-sans text-[15px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors"
          >
            Reviews
          </a>
          <a
            href="/#wholesale"
            onClick={(e) => handleLinkClick(e, '/#wholesale')}
            className="font-sans text-[15px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors"
          >
            Wholesale
          </a>
        </nav>

        {/* Right Group: Cart and Mobile Hamburger */}
        <div className="flex items-center space-x-4 lg:space-x-6">
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 text-[#123C2D] hover:text-[#D6A83A] transition-colors cursor-pointer"
            aria-label="View Shopping Cart"
          >
            <CartIcon size={20} color="currentColor" />
            <span className="font-sans text-[15px] font-medium leading-none">
              Cart ({cartCount})
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={onToggleMobileMenu}
            className="p-1 text-[#123C2D] hover:text-[#D6A83A] transition-colors lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <MenuIcon size={24} color="currentColor" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

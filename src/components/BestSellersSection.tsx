import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedHeading } from './motion/AnimatedHeading';

interface BestSellersSectionProps {
  onNavigate?: (path: string) => void;
}

export interface BestSellerProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  alt: string;
  images: [string, string]; // [0: Original Harvest Image, 1: Alternate Branded Jar Image]
  objectPositions: [string, string];
}

/**
 * Exactly the 3 Best Seller products:
 * 1. Forest Honey (Original: honeycomb + dipper; Alternate: product_multifloral.jpg)
 * 2. Kombu Honey (Original: glass jar + dipper; Alternate: product_wildflower.jpg)
 * 3. Gulkand Honey (Original: golden bowl + dipper; Alternate: product_gulkand.jpg)
 */
const BEST_SELLERS: BestSellerProduct[] = [
  {
    id: 'forest-honey',
    name: 'Forest Honey',
    slug: 'forest-honey',
    price: 699,
    alt: 'Forest Honey pure harvest with honeycomb and honey dipper',
    images: ['/images/forest_honey_best.jpg', '/images/product_multifloral.jpg'],
    objectPositions: ['center 35%', 'center center'],
  },
  {
    id: 'kombu-honey',
    name: 'Kombu Honey',
    slug: 'kombu-honey',
    price: 799,
    alt: 'Kombu Honey wild comb harvest in glass jar with dipper',
    images: ['/images/kombu_honey_best.jpg', '/images/product_wildflower.jpg'],
    objectPositions: ['center center', 'center center'],
  },
  {
    id: 'gulkand-honey',
    name: 'Gulkand Honey',
    slug: 'gulkand-honey',
    price: 699,
    alt: 'Gulkand Honey natural blend in golden bowl with dipper',
    images: ['/images/gulkand_honey_best.jpg', '/images/product_gulkand.jpg'],
    objectPositions: ['center 45%', 'center center'],
  },
];

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onNavigate }) => {
  // Independent image state for each card: 0 = ORIGINAL, 1 = ALTERNATE
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({
    'forest-honey': 0,
    'kombu-honey': 0,
    'gulkand-honey': 0,
  });

  const handleToggle = (productId: string) => {
    setActiveIndices((prev) => ({
      ...prev,
      [productId]: prev[productId] === 0 ? 1 : 0,
    }));
  };

  const handleShopAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/shop');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop';
    }
  };

  return (
    <section id="lineup" className="w-full py-16 md:py-24 bg-[#F5F1E6] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header Row — Editorial Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 pb-2"
        >
          {/* Left: Eyebrow + Heading */}
          <div className="space-y-1.5 md:space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#D6A83A] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#123C2D] font-medium">
                THE LINEUP
              </span>
            </div>
            <AnimatedHeading
              text="MEET THE BEST SELLERS"
              as="h2"
              animateOnMount={true}
              className="font-serif text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-semibold text-[#123C2D] leading-[1.15] tracking-[-0.01em]"
            />
          </div>

          {/* Right: Tagline + Shop Action */}
          <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 pt-2 md:pt-0">
            <span className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-[#607568] font-normal tracking-wide hidden sm:inline">
              Pure, raw, and harvested straight from high-altitude peaks.
            </span>
            <a
              href="/shop"
              onClick={handleShopAllClick}
              className="group inline-flex items-center gap-1.5 font-sans text-[13px] sm:text-[14px] font-medium text-[#123C2D] hover:text-[#D6A83A] transition-colors cursor-pointer"
            >
              <span>Shop everything</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </motion.div>

        {/* 3 Equal Cards: Positions, widths, and heights remain completely stable */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {BEST_SELLERS.map((product) => {
            const activeIndex = activeIndices[product.id] ?? 0;
            const isAlternate = activeIndex === 1;

            return (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                aria-label={`${product.name} - ₹${product.price}. Currently showing ${
                  isAlternate ? 'alternate' : 'original'
                } image. Click to toggle image.`}
                onClick={() => handleToggle(product.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(product.id);
                  }
                }}
                className="group flex flex-col cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D6A83A] rounded-[20px]"
              >
                {/* Rounded Image Container with constant 3:4 Proportions and 16px Radius */}
                <div className="relative aspect-[3/4] w-full rounded-[16px] overflow-hidden bg-[#EDE8DC] shadow-[0_4px_16px_rgba(18,60,45,0.04)] transition-shadow duration-300 group-hover:shadow-[0_8px_24px_rgba(18,60,45,0.08)]">
                  {/* Top-left BEST SELLER badge */}
                  <div className="absolute top-3.5 left-3.5 z-20 pointer-events-none">
                    <span
                      data-testid="bestseller-badge"
                      className="inline-flex items-center px-3 py-1 rounded-full bg-[#D6A83A] text-[#08291F] font-mono text-[11px] font-bold tracking-wider uppercase shadow-xs"
                    >
                      BEST SELLER
                    </span>
                  </div>

                  {/* Dual-Layered Framer Motion Cross-Transition (Zero Blank Flash) */}

                  {/* Layer 0: Original Image */}
                  <motion.img
                    src={product.images[0]}
                    alt={product.alt}
                    loading="lazy"
                    initial={false}
                    animate={{
                      opacity: isAlternate ? 0 : 1,
                      scale: isAlternate ? 1.04 : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      objectPosition: product.objectPositions[0],
                    }}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Layer 1: Alternate Image */}
                  <motion.img
                    src={product.images[1]}
                    alt={`${product.name} packaged jar view`}
                    loading="lazy"
                    initial={false}
                    animate={{
                      opacity: isAlternate ? 1 : 0,
                      scale: isAlternate ? 1 : 0.96,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{
                      objectPosition: product.objectPositions[1],
                    }}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Subtle 2-dot indicator pill at bottom-right */}
                  <div className="absolute bottom-3.5 right-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#123C2D]/60 backdrop-blur-md transition-opacity duration-300 pointer-events-none">
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        !isAlternate
                          ? 'bg-[#F5F1E6] scale-125'
                          : 'bg-[#F5F1E6]/40 scale-100'
                      }`}
                    />
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isAlternate
                          ? 'bg-[#F5F1E6] scale-125'
                          : 'bg-[#F5F1E6]/40 scale-100'
                      }`}
                    />
                  </div>
                </div>

                {/* Product Meta: Name and Price below image */}
                <div className="mt-4 px-1 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-[19px] sm:text-[21px] font-semibold text-[#123C2D] group-hover:text-[#D6A83A] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <span className="font-sans font-bold text-[17px] sm:text-[18px] text-[#2A2118] whitespace-nowrap">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

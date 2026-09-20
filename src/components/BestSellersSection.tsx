import React, { useState, useEffect, useCallback } from 'react';
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
  price400g: number;
  price1kg: number;
  category: string;
  badge: string;
  alt: string;
  image: string;
  subtitle: string;
  description: string;
}

/**
 * EXACTLY 4 PRODUCTS:
 * 1. Forest Honey — ₹399 / ₹699
 * 2. Mountain Honey — ₹449 / ₹899
 * 3. Kombu Honey — ₹499 / ₹999
 * 4. Stingless Bee Honey — ₹749 / ₹1499
 */
export const BEST_SELLERS: BestSellerProduct[] = [
  {
    id: 'forest-honey',
    name: 'Forest Honey',
    slug: 'forest-honey',
    price: 399,
    price400g: 399,
    price1kg: 699,
    category: 'WILD MOUNTAIN FLORA',
    badge: 'BEST SELLER',
    alt: 'Forest Honey pure natural harvest glass jar',
    image: '/images/product_multifloral_nobg.png',
    subtitle: 'Raw • Unheated • Pollen-Preserved',
    description: 'Minimally processed, unheated, and pollen-preserved from native flora. An ideal natural sweet for the whole family.',
  },
  {
    id: 'mountain-honey',
    name: 'Mountain Honey',
    slug: 'mountain-honey',
    price: 449,
    price400g: 449,
    price1kg: 899,
    category: 'HIGH-ALTITUDE FLORA',
    badge: 'HARVEST SPECIAL',
    alt: 'Mountain Honey pure high-altitude harvest glass jar',
    image: '/images/product_mountain_nobg.png',
    subtitle: 'High-Altitude • Raw Harvest',
    description: 'Harvested from high-altitude flora and suitable for daily use. Traditionally valued for natural vitality and daily wellness.',
  },
  {
    id: 'kombu-honey',
    name: 'Kombu Honey',
    slug: 'kombu-honey',
    price: 499,
    price400g: 499,
    price1kg: 999,
    category: 'SMALL BEE WILD COMB',
    badge: 'RARE HARVEST',
    alt: 'Kombu Honey pure mountain comb glass jar',
    image: '/images/product_wildflower_nobg.png',
    subtitle: 'Small Bee • Wild Comb • Pure',
    description: 'Traditional small bee wild comb honey harvested through generations of sustainable forest foraging.',
  },
  {
    id: 'stingless-bee-honey',
    name: 'Stingless Bee Honey',
    slug: 'stingless-bee-honey',
    price: 749,
    price400g: 749,
    price1kg: 1499,
    category: 'RARE MOUNTAIN COMB',
    badge: 'LIMITED HARVEST',
    alt: 'Stingless Bee Honey rare high-altitude reserve glass jar',
    image: '/images/product_raw_reserve_nobg.png',
    subtitle: 'Rare • Comb • High Nutritional Value',
    description: 'Prized for its high nutritional density and distinct tangy floral profile, harvested in small artisanal batches.',
  },
];

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const total = BEST_SELLERS.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handleViewProduct = (e: React.MouseEvent, slug?: string) => {
    e.stopPropagation();
    const dest = slug ? `/product/${slug}` : '/shop';
    if (onNavigate) {
      onNavigate(dest);
    } else if (typeof window !== 'undefined') {
      window.location.href = dest;
    }
  };

  const handleShopAllClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/shop');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop';
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  const springConfig = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  };

  return (
    <section
      id="lineup"
      className="w-full py-16 md:py-24 bg-[#F4F1EA] overflow-hidden select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Meet the Best Sellers"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header Row — Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 pb-2">
          {/* Left: Eyebrow + Heading */}
          <div className="space-y-1.5 md:space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#C9892E] font-semibold">
                THE LINEUP
              </span>
            </div>
            <AnimatedHeading
              text="MEET THE BEST SELLERS"
              as="h2"
              animateOnMount={true}
              className="font-serif text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] font-semibold text-[#242424] leading-[1.15] tracking-[-0.01em]"
            />
          </div>

          {/* Right: Tagline + Shop Action */}
          <div className="flex items-center justify-between md:justify-end gap-5 sm:gap-8 pt-2 md:pt-0">
            <span className="font-sans text-[13px] sm:text-[14px] md:text-[15px] text-[#686863] font-normal tracking-wide hidden sm:inline">
              Pure, raw, and harvested straight from high-altitude peaks.
            </span>
            <a
              href="/shop"
              onClick={handleShopAllClick}
              className="group inline-flex items-center gap-1.5 font-sans text-[13px] sm:text-[14px] font-medium text-[#242424] hover:text-[#C9892E] transition-colors cursor-pointer"
            >
              <span>Shop everything</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            PRODUCT FOCUS CAROUSEL CONTAINER (Centered Active Card + Partial Side Cards)
            ========================================================================= */}
        <div className="relative w-full h-[470px] xs:h-[490px] sm:h-[530px] md:h-[560px] flex items-center justify-center overflow-hidden touch-pan-y">
          {/* Left Circular Navigation Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous product"
            className="absolute left-2 xs:left-3 sm:left-6 md:left-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-[#EAE6DE] flex items-center justify-center text-[#242424] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer focus:outline-none"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Right Circular Navigation Arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next product"
            className="absolute right-2 xs:right-3 sm:right-6 md:right-8 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.14)] border border-[#EAE6DE] flex items-center justify-center text-[#242424] hover:bg-[#FAF8F5] active:scale-95 transition-all cursor-pointer focus:outline-none"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Cards Track with Drag / Swipe support */}
          <div className="relative w-full h-full flex items-center justify-center">
            {BEST_SELLERS.map((product, index) => {
              // Wrapped relative difference in range [-2, 2]
              let diff = index - activeIndex;
              while (diff > total / 2) diff -= total;
              while (diff < -total / 2) diff += total;

              const isActive = diff === 0;
              const isPrev = diff === -1;
              const isNext = diff === 1;
              const isVisible = Math.abs(diff) <= 1;

              // Responsive translation in pixels, scale, and opacity
              let targetX = 0;
              let targetScale = 1;
              let targetOpacity = 1;
              let targetZIndex = 25;
              let shadow = '0 24px 48px -12px rgba(36, 36, 36, 0.22), 0 8px 16px -4px rgba(36, 36, 36, 0.08)';

              if (diff === 0) {
                // Active Card: Center, elevated, forward depth
                targetX = 0;
                targetScale = 1;
                targetOpacity = 1;
                targetZIndex = 25;
                shadow = '0 24px 48px -12px rgba(36, 36, 36, 0.22), 0 8px 16px -4px rgba(36, 36, 36, 0.08)';
              } else if (diff === 1) {
                // Next Card (Right side): partially peeking so the bottle is visible
                targetX = isMobile ? 230 : 350;
                targetScale = isMobile ? 0.78 : 0.82;
                targetOpacity = isMobile ? 0.55 : 0.65;
                targetZIndex = 10;
                shadow = '0 8px 20px -6px rgba(36, 36, 36, 0.10)';
              } else if (diff === -1) {
                // Prev Card (Left side): partially peeking so the bottle is visible
                targetX = isMobile ? -230 : -350;
                targetScale = isMobile ? 0.78 : 0.82;
                targetOpacity = isMobile ? 0.55 : 0.65;
                targetZIndex = 10;
                shadow = '0 8px 20px -6px rgba(36, 36, 36, 0.10)';
              } else {
                // Opposite Card (diff === 2 or -2): hidden behind
                targetX = diff > 0 ? (isMobile ? 480 : 700) : (isMobile ? -480 : -700);
                targetScale = 0.5;
                targetOpacity = 0;
                targetZIndex = 1;
                shadow = 'none';
              }

              return (
                <motion.div
                  key={product.id}
                  drag={isActive ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.22}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 30;
                    if (info.offset.x < -swipeThreshold || info.velocity.x < -180) {
                      handleNext();
                    } else if (info.offset.x > swipeThreshold || info.velocity.x > 180) {
                      handlePrev();
                    }
                  }}
                  animate={{
                    x: targetX,
                    scale: targetScale,
                    opacity: targetOpacity,
                    zIndex: targetZIndex,
                  }}
                  transition={springConfig}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    else if (isNext) handleNext();
                  }}
                  style={{
                    boxShadow: shadow,
                    willChange: 'transform, opacity',
                  }}
                  className={`absolute w-[78vw] max-w-[310px] xs:max-w-[325px] sm:max-w-[360px] md:max-w-[380px] h-[450px] xs:h-[470px] sm:h-[500px] md:h-[530px] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#FAF8F5] border border-[#E2DDD3] cursor-pointer ${
                    !isVisible ? 'pointer-events-none' : ''
                  }`}
                >
                  <div className="relative w-full h-full flex flex-col justify-between p-5 sm:p-6 md:p-7">
                    {/* Subtle warm pedestal backdrop lighting */}
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C9892E]/8 rounded-full blur-3xl pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Top Row: Category & Origin Pill Badge */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] text-[#8C827A] font-semibold truncate">
                        {product.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#242424] text-[#FAF9F5] font-mono text-[9.5px] sm:text-[10px] font-bold tracking-wider uppercase shrink-0 shadow-xs">
                        {product.badge}
                      </span>
                    </div>

                    {/* HERO PRODUCT BOTTLE — Prominently FIRST on each slide */}
                    <div className="relative flex-1 w-full min-h-[190px] xs:min-h-[210px] sm:min-h-[230px] md:min-h-[250px] flex items-center justify-center my-2 sm:my-3 select-none">
                      <img
                        src={product.image}
                        alt={product.alt}
                        loading="lazy"
                        className="max-h-[180px] xs:max-h-[200px] sm:max-h-[230px] md:max-h-[250px] w-auto max-w-[85%] object-contain drop-shadow-[0_16px_22px_rgba(36,36,36,0.18)] transition-transform duration-500 hover:scale-105 select-none pointer-events-none"
                      />
                    </div>

                    {/* Product Name & Details Follow Below the Bottle */}
                    <div className="flex flex-col gap-1.5 sm:gap-2 z-10 pt-2 border-t border-[#EAE6DE]">
                      {/* Name & Dual Price Row: Forest Honey — ₹399 / ₹699 */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-[20px] xs:text-[22px] sm:text-[25px] font-semibold text-[#242424] leading-tight tracking-[-0.01em]">
                          {product.name}
                        </h3>
                        <div className="text-right whitespace-nowrap shrink-0">
                          <span className="font-sans font-bold text-[17px] sm:text-[19px] text-[#242424] tracking-tight">
                            ₹{product.price400g} <span className="text-[#8C827A] font-normal text-[13px] sm:text-[14px]">/</span> ₹{product.price1kg}
                          </span>
                        </div>
                      </div>

                      {/* Product Description */}
                      <p className="font-sans text-[12px] sm:text-[12.5px] text-[#686863] leading-[1.45] line-clamp-2 text-left">
                        {product.description}
                      </p>

                      {/* View Product CTA / Available Sizes */}
                      <div className="pt-2 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={(e) => handleViewProduct(e, product.slug)}
                          className="flex-1 py-2.5 sm:py-3 px-4 rounded-full bg-[#242424] hover:bg-[#C9892E] text-[#FAF9F5] font-sans text-[12.5px] sm:text-[13px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer text-center shadow-xs active:scale-95"
                        >
                          View Product
                        </button>
                        <span className="font-mono text-[10.5px] sm:text-[11px] text-[#8C827A] whitespace-nowrap font-medium">
                          400g • 1kg
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Small Carousel Progress / Dot Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
          {BEST_SELLERS.map((item, index) => {
            const isCurrent = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to ${item.name}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? 'w-7 bg-[#C9892E]'
                    : 'w-2 bg-[#242424]/25 hover:bg-[#242424]/50'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

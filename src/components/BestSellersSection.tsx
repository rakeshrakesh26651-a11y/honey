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
  category: string;
  badge: string;
  alt: string;
  image: string;
  objectPosition?: string;
}

/**
 * 5 existing products with exact names, images, and prices:
 * 1. Forest Honey (₹699)
 * 2. Kombu Honey (₹799)
 * 3. Gulkand Honey (₹699)
 * 4. Kurinji Honey (₹799)
 * 5. Ghee (₹699)
 */
export const BEST_SELLERS: BestSellerProduct[] = [
  {
    id: 'forest-honey',
    name: 'Forest Honey',
    slug: 'forest-honey',
    price: 699,
    category: 'WILD MOUNTAIN FLORA',
    badge: 'BEST SELLER',
    alt: 'Forest Honey pure harvest with honeycomb and honey dipper',
    image: '/images/forest_honey_best.jpg',
    objectPosition: 'center 35%',
  },
  {
    id: 'kombu-honey',
    name: 'Kombu Honey',
    slug: 'kombu-honey',
    price: 799,
    category: 'SMALL BEE WILD COMB',
    badge: 'RARE',
    alt: 'Kombu Honey wild comb harvest in glass jar with dipper',
    image: '/images/kombu_honey_best.jpg',
    objectPosition: 'center center',
  },
  {
    id: 'gulkand-honey',
    name: 'Gulkand Honey',
    slug: 'gulkand-honey',
    price: 699,
    category: 'ROSE PETAL BLEND',
    badge: 'ARTISANAL',
    alt: 'Gulkand Honey natural blend in golden bowl with dipper',
    image: '/images/gulkand_honey_best.jpg',
    objectPosition: 'center 45%',
  },
  {
    id: 'kurinji-honey',
    name: 'Kurinji Honey',
    slug: 'kurinji-honey',
    price: 799,
    category: 'RARE MOUNTAIN BLOOM',
    badge: 'LIMITED HARVEST',
    alt: 'Kurinji Honey rare high-altitude reserve jar',
    image: '/images/product_raw_reserve.jpg',
    objectPosition: 'center center',
  },
  {
    id: 'ghee',
    name: 'Ghee',
    slug: 'ghee',
    price: 699,
    category: 'TRADITIONAL ARTISANAL',
    badge: 'CULTURED GHEE',
    alt: 'Traditional artisanal cultured ghee jar',
    image: '/images/product_ghee.jpg',
    objectPosition: 'center center',
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

  // Navigate directly to /shop (do NOT open product detail page)
  const handleViewProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('/shop');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop';
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
    damping: 32,
    mass: 0.8,
  };

  return (
    <section
      id="lineup"
      className="w-full py-16 md:py-24 bg-[#F4F1EA] overflow-hidden select-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Best Sellers Focus Carousel"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header Row — Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12 pb-2">
          {/* Left: Eyebrow + Heading */}
          <div className="space-y-1.5 md:space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="w-4 h-[1.5px] bg-[#C9892E] inline-block" />
              <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#242424] font-medium">
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
        <div className="relative w-full h-[440px] xs:h-[460px] sm:h-[490px] md:h-[540px] flex items-center justify-center overflow-hidden touch-pan-y">
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
              let targetZIndex = 20;
              let shadow = '0 25px 50px -12px rgba(36, 36, 36, 0.28)';

              if (diff === 0) {
                targetX = 0;
                targetScale = 1;
                targetOpacity = 1;
                targetZIndex = 20;
                shadow = '0 25px 50px -12px rgba(36, 36, 36, 0.28)';
              } else if (diff === 1) {
                targetX = isMobile ? 245 : 360;
                targetScale = isMobile ? 0.72 : 0.76;
                targetOpacity = isMobile ? 0.6 : 0.65;
                targetZIndex = 10;
                shadow = '0 10px 30px -10px rgba(36, 36, 36, 0.15)';
              } else if (diff === -1) {
                targetX = isMobile ? -245 : -360;
                targetScale = isMobile ? 0.72 : 0.76;
                targetOpacity = isMobile ? 0.6 : 0.65;
                targetZIndex = 10;
                shadow = '0 10px 30px -10px rgba(36, 36, 36, 0.15)';
              } else {
                // diff === 2 or -2
                targetX = diff > 0 ? (isMobile ? 500 : 750) : (isMobile ? -500 : -750);
                targetScale = isMobile ? 0.5 : 0.55;
                targetOpacity = 0;
                targetZIndex = 1;
                shadow = 'none';
              }

              return (
                <motion.div
                  key={product.id}
                  drag={isActive ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 40;
                    if (info.offset.x < -swipeThreshold || info.velocity.x < -250) {
                      handleNext();
                    } else if (info.offset.x > swipeThreshold || info.velocity.x > 250) {
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
                  className={`absolute w-[78vw] max-w-[310px] xs:max-w-[325px] sm:max-w-[350px] md:max-w-[380px] h-[390px] xs:h-[410px] sm:h-[450px] md:h-[490px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#FAF8F5] cursor-pointer ${
                    !isVisible ? 'pointer-events-none' : ''
                  }`}
                >
                  <div className="relative w-full h-full">
                    {/* Full Bleed Image */}
                    <img
                      src={product.image}
                      alt={product.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                      style={{
                        objectPosition: product.objectPosition || 'center center',
                      }}
                    />

                    {/* Dark Scrim Overlay for clear text legibility */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Bottom Card Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-7 flex flex-col gap-2 z-10">
                      {/* Category & Badge */}
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10.5px] sm:text-[11.5px] uppercase tracking-[0.14em] text-white/85 font-medium">
                          {product.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#C9892E]" />
                        <span className="font-sans text-[13.5px] sm:text-[14px] font-bold text-[#EADDC7]">
                          ₹{product.price}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h3 className="font-serif text-[22px] xs:text-[24px] sm:text-[28px] md:text-[30px] font-semibold text-white leading-tight tracking-[-0.01em]">
                        {product.name}
                      </h3>

                      {/* VIEW PRODUCT Button (Navigates directly to /shop) */}
                      {isActive && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleViewProduct}
                            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white hover:bg-[#FAF8F5] text-[#242424] font-sans text-[13px] sm:text-[14px] font-semibold tracking-[-0.01em] shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer w-fit inline-block"
                          >
                            View Product
                          </button>
                        </div>
                      )}
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

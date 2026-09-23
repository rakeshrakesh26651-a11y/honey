import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AnimatedHeading } from './motion/AnimatedHeading';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../data/himalayanHarvest';

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

export function toBestSellerProduct(p: Product): BestSellerProduct {
  const v400 = p.variants?.find((v) => v.size.toLowerCase().includes('400')) || p.variants?.[0];
  const v1k = p.variants?.find((v) => v.size.toLowerCase().includes('1k') || v.size.toLowerCase().includes('1000')) || p.variants?.[1] || v400;
  const isAllOut = p.available === false || (p.variants && p.variants.length > 0 && p.variants.every((v) => v.available === false || (v.stock !== undefined && v.stock <= 0)));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    price400g: v400 ? v400.price : p.price,
    price1kg: v1k ? v1k.price : p.price,
    category: p.category ? p.category.toUpperCase() : 'WILD MOUNTAIN FLORA',
    badge: isAllOut ? 'OUT OF STOCK' : (p.badge || 'BEST SELLER'),
    alt: p.alt || `${p.name} pure natural harvest glass jar`,
    image: p.image || '/images/hero_honey_jar.jpg',
    subtitle: p.subtitle || '',
    description: p.description || '',
  };
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({ onNavigate }) => {
  const { products: liveProducts, loading } = useProducts();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Active products strictly from Firestore (do NOT filter out 0-stock products)
  const activeProducts = liveProducts.filter((p) => (p as any).active !== false);
  const displayProducts: BestSellerProduct[] = activeProducts.map(toBestSellerProduct);

  const total = Math.max(1, displayProducts.length);

  useEffect(() => {
    if (activeIndex >= total) {
      setActiveIndex(0);
    }
  }, [activeIndex, total]);

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

  const handleViewProduct = (e: React.MouseEvent, _slug?: string) => {
    e.stopPropagation();
    const dest = _slug ? `/shop/${_slug}` : '/shop';
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
        {displayProducts.length === 0 ? (
          <div className="relative w-full h-[320px] flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-[#C9892E] border-t-transparent animate-spin" />
                <span className="font-mono text-[12px] uppercase tracking-wider text-[#686863]">
                  Loading line-up...
                </span>
              </div>
            ) : (
              <p className="font-sans text-[15px] text-[#686863]">
                No products are currently available in this lineup.
              </p>
            )}
          </div>
        ) : (
          <>
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
            {displayProducts.map((product, index) => {
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
                      {/* Product Name */}
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-[20px] xs:text-[22px] sm:text-[25px] font-semibold text-[#242424] leading-tight tracking-[-0.01em]">
                          {product.name}
                        </h3>
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
              {displayProducts.map((item, index) => {
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
          </>
        )}
      </div>
    </section>
  );
};

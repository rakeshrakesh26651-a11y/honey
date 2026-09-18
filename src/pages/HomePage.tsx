import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureStrip } from '../components/FeatureStrip';
import { BestSellersSection } from '../components/BestSellersSection';
import { StorySection } from '../components/StorySection';
import { Testimonials } from '../components/Testimonials';
import { SocialGallery } from '../components/SocialGallery';
import { WholesaleSection } from '../components/WholesaleSection';
import { Newsletter } from '../components/Newsletter';
import { Product } from '../data/content';
import { PageTransition } from '../components/motion/PageTransition';

interface HomePageProps {
  onAddToCart?: (product: Product, size: string, quantity: number) => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      {/* 1. Hero Section with Sequenced Reveals */}
      <Hero
        onShopClick={() => onNavigate('/shop')}
        onNavigate={onNavigate}
      />

      {/* 2. Feature Strip */}
      <FeatureStrip />

      {/* 3. The Lineup / OLIO-Inspired Best Sellers Section (Exactly 3 Products) */}
      <BestSellersSection
        onNavigate={onNavigate}
      />

      {/* 4. Heritage Story Teaser */}
      <StorySection />

      {/* 5. REAL PEOPLE. REAL RESULTS. Animated Testimonial Carousel */}
      <Testimonials />

      {/* 6. Social UGC Gallery ("FROM OUR COMMUNITY") */}
      <SocialGallery />

      {/* 7. Wholesale & Bulk Orders */}
      <WholesaleSection />

      {/* 8. Newsletter */}
      <Newsletter />
    </PageTransition>
  );
};

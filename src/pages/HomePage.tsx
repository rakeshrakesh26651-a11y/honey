import React from 'react';
import { Hero } from '../components/Hero';
import { FeatureStrip } from '../components/FeatureStrip';
import { StorySection } from '../components/StorySection';
import { BestSellersSection } from '../components/BestSellersSection';
import { Testimonials } from '../components/Testimonials';
import { SocialGallery } from '../components/SocialGallery';
import { WholesaleSection } from '../components/WholesaleSection';
import { Newsletter } from '../components/Newsletter';
import { PageTransition } from '../components/motion/PageTransition';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <PageTransition>
      {/* 1. Hero Section with Mountain Harvest Video & Primary CTA to Shop */}
      <Hero
        onShopClick={() => onNavigate('/shop')}
        onNavigate={onNavigate}
      />

      {/* 2. 4-Feature Strip */}
      <FeatureStrip />

      {/* 3. Heritage Brand Storytelling: FOUR GENERATIONS. ONE TRADITION. */}
      <StorySection onNavigate={onNavigate} />

      {/* 4. Meet The Best Sellers with OLIO-Style Image Interaction */}
      <BestSellersSection onNavigate={onNavigate} />

      {/* 5. Customer Testimonials Carousel ("REAL PEOPLE. REAL RESULTS.") */}
      <Testimonials />

      {/* 6. Social UGC Community Gallery ("FROM OUR COMMUNITY") */}
      <SocialGallery />

      {/* 7. Wholesale & Bulk Orders */}
      <WholesaleSection />

      {/* 8. Newsletter Subscription */}
      <Newsletter />
    </PageTransition>
  );
};




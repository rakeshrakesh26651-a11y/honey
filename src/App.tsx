import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Hero } from './components/Hero';
import { FeatureStrip } from './components/FeatureStrip';
import { ProductSection } from './components/ProductSection';
import { StorySection } from './components/StorySection';
import { BundleSection } from './components/BundleSection';
import { Testimonials } from './components/Testimonials';
import { QualitySection } from './components/QualitySection';
import { SocialGallery } from './components/SocialGallery';
import { WholesaleSection } from './components/WholesaleSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { Product } from './data/content';
import { openWhatsAppOrder } from './utils/whatsapp';

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Start with 1 item or empty state
  ]);

  // Initialize Lenis smooth scroll with optimal wheel & touch settings
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    const updatedItems = existing
      ? cartItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cartItems, { product, quantity: 1 }];

    setCartItems(updatedItems);
    setIsCartOpen(true);
    openWhatsAppOrder(updatedItems);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#f7f2e7] flex flex-col selection:bg-[#c88a2b] selection:text-white"
    >
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Interactive Cart Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => openWhatsAppOrder(cartItems)}
      />

      {/* Main Page Sections */}
      <main className="flex-1 w-full">
        {/* 3. Hero Section */}
        <Hero onShopClick={() => {}} />

        {/* 4. Value / Feature Strip */}
        <FeatureStrip />

        {/* 5. The Lineup / Bestsellers */}
        <ProductSection onAddToCart={handleAddToCart} />

        {/* 6. Story Teaser */}
        <StorySection />

        {/* 7. Promotional / BUY 1 GET 1 Banner */}
        <BundleSection onAddToCart={handleAddToCart} />

        {/* 8. Quality & Transparency (Lab Report) */}
        <QualitySection />

        {/* 9. Testimonials / Kind Words */}
        <Testimonials />

        {/* 10. Social UGC Gallery */}
        <SocialGallery />

        {/* 11. Wholesale & Bulk Enquiries */}
        <WholesaleSection />

        {/* 12. Email Newsletter */}
        <Newsletter />
      </main>

      {/* 11. Footer */}
      <Footer onOpenCart={() => setIsCartOpen(true)} />
    </motion.div>
  );
}

export default App;

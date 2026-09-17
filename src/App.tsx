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
import { QualitySection } from './components/QualitySection';
import { Testimonials } from './components/Testimonials';
import { SocialGallery } from './components/SocialGallery';
import { WholesaleSection } from './components/WholesaleSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { RefundPolicy } from './pages/RefundPolicy';
import { Product } from './data/content';
import { openWhatsAppOrder } from './utils/whatsapp';

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Listen to browser popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  const handleNavigate = (path: string) => {
    if (typeof window === 'undefined') return;

    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      const targetRoute = route || '/';
      if (currentPath !== targetRoute) {
        window.history.pushState({}, '', path);
        setCurrentPath(targetRoute);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Add to Cart handler:
   * 1. Stores selected variant size (400g / 700g / 1000g)
   * 2. Different sizes of the same product remain separate line items
   * 3. Opens cart drawer WITHOUT redirecting or opening WhatsApp
   */
  const handleAddToCart = (product: Product, size: string = '400g', quantity: number = 1) => {
    const itemId = `${product.id}-${size}`;
    const variantObj = product.variants?.find((v) => v.size === size);
    const unitPrice = variantObj ? variantObj.price : product.price;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === itemId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          id: itemId,
          product,
          size,
          unitPrice,
          quantity,
        },
      ];
    });

    // Open Cart Drawer (WITHOUT WhatsApp redirect)
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Render the appropriate main content based on current path
  const renderMainContent = () => {
    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicy onNavigateHome={() => handleNavigate('/')} />;
    }
    if (currentPath === '/terms-and-conditions') {
      return <TermsAndConditions onNavigateHome={() => handleNavigate('/')} />;
    }
    if (currentPath === '/refund-policy') {
      return <RefundPolicy onNavigateHome={() => handleNavigate('/')} />;
    }

    return (
      <>
        {/* 3. Hero Section */}
        <Hero onShopClick={() => handleNavigate('/#lineup')} />

        {/* 4. Value / Feature Strip */}
        <FeatureStrip />

        {/* 5. The Lineup / Bestsellers with 400g / 700g / 1000g Size Selection */}
        <ProductSection onAddToCart={handleAddToCart} />

        {/* 6. Story Teaser */}
        <StorySection />

        {/* 7. Quality & Transparency (Lab Report) */}
        <QualitySection />

        {/* 8. Customer Testimonials Animated Carousel */}
        <Testimonials />

        {/* 9. Social UGC Gallery */}
        <SocialGallery />

        {/* 10. Wholesale & Bulk Enquiries */}
        <WholesaleSection />

        {/* 11. Email Newsletter */}
        <Newsletter />
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#F5F1E6] flex flex-col selection:bg-[#D6A83A] selection:text-[#08291F]"
    >
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        isMobileMenuOpen={isMobileMenuOpen}
        onNavigate={handleNavigate}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
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

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {renderMainContent()}
      </main>

      {/* Footer */}
      <Footer
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />
    </motion.div>
  );
}

export default App;

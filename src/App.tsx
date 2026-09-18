import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { Footer } from './components/Footer';

// Dedicated Multi-Page Architecture
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { LabReportsPage } from './pages/LabReportsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
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

  // Open cart automatically if customer navigates to /cart or /checkout directly
  useEffect(() => {
    if (currentPath === '/cart' || currentPath === '/checkout') {
      setIsCartOpen(true);
    }
  }, [currentPath]);

  // Initialize Lenis smooth scroll
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

    if (path === '/cart') {
      setIsCartOpen(true);
      return;
    }

    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      const targetRoute = route || '/';
      if (currentPath !== targetRoute) {
        window.history.pushState({}, '', path);
        setCurrentPath(targetRoute);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
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

  // Render the appropriate main page based on current path
  const renderMainContent = () => {
    // Dynamic Product Detail Route: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').replace(/\/$/, '');
      return (
        <ProductDetailPage
          slug={slug}
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPath === '/shop') {
      return (
        <ShopPage
          onAddToCart={handleAddToCart}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/lab-reports') {
      return <LabReportsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/reviews') {
      return <ReviewsPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/faq') {
      return <FaqPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/privacy-policy') {
      return <PrivacyPolicy onNavigateHome={() => handleNavigate('/')} />;
    }

    if (currentPath === '/terms-and-conditions') {
      return <TermsAndConditions onNavigateHome={() => handleNavigate('/')} />;
    }

    if (currentPath === '/refund-policy') {
      return <RefundPolicy onNavigateHome={() => handleNavigate('/')} />;
    }

    // Default: Editorial Multi-Section Homepage
    return (
      <HomePage
        onAddToCart={handleAddToCart}
        onNavigate={handleNavigate}
      />
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
        currentPath={currentPath}
      />

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavigate}
        currentPath={currentPath}
      />

      {/* Interactive Cart Slide-over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onCheckout={() => openWhatsAppOrder(cartItems)}
      />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {renderMainContent()}
      </main>

      {/* Footer with HIMALAYAN giant typography and links */}
      <Footer
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
      />
    </motion.div>
  );
}

export default App;

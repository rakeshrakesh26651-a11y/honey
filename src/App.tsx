import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';

// Dedicated Multi-Page Architecture
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CartPage, CartItem } from './pages/CartPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { LabReportsPage } from './pages/LabReportsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { RefundPolicy } from './pages/RefundPolicy';
import { AccountPage } from './pages/AccountPage';

import { Product } from './data/content';

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
   * 1. Stores selected variant size (400g / 1kg)
   * 2. Different sizes of the same product remain separate line items
   * 3. Retains cart state, redirects only when explicitly requested
   */
  const handleAddToCart = (
    product: Product,
    size: string = '400g',
    quantity: number = 1,
    shouldRedirect: boolean = false
  ) => {
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

    if (shouldRedirect) {
      handleNavigate('/cart');
    }
  };

  /**
   * Buy Now handler:
   * Adds product & selected variant/quantity to cart state and navigates straight to /checkout
   */
  const handleBuyNow = (product: Product, size: string = '400g', quantity: number = 1) => {
    handleAddToCart(product, size, quantity, false);
    handleNavigate('/checkout');
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
    // Dynamic Product Detail Route: /shop/:slug
    if (currentPath.startsWith('/shop/') && currentPath !== '/shop') {
      const slug = currentPath.replace('/shop/', '').replace(/\/$/, '');
      return (
        <ProductDetailPage
          slug={slug}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onNavigate={handleNavigate}
        />
      );
    }

    // Dynamic Product Detail Backwards-Compatible Alias: /product/:slug
    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '').replace(/\/$/, '');
      return (
        <ProductDetailPage
          slug={slug}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
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

    // Full Cart & Checkout Page (Reproducing Dribbble Reference)
    if (currentPath === '/cart' || currentPath === '/checkout') {
      return (
        <CartPage
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCartItems([])}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentPath === '/about' || currentPath === '/our-story' || currentPath === '/our-heritage') {
      return <AboutPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/lab-reports' || currentPath === '/lab-report') {
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

    if (currentPath === '/login') {
      return <AccountPage initialMode="login" onNavigate={handleNavigate} />;
    }

    if (currentPath === '/signup') {
      return <AccountPage initialMode="signup" onNavigate={handleNavigate} />;
    }

    if (currentPath === '/forgot-password') {
      return <AccountPage initialMode="forgot-password" onNavigate={handleNavigate} />;
    }

    if (currentPath === '/account') {
      return <AccountPage initialMode="account" onNavigate={handleNavigate} />;
    }

    // Default or /home: Editorial Multi-Section Homepage
    return (
      <HomePage
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#F4F1EA] text-[#242424] font-sans flex flex-col selection:bg-[#C9892E] selection:text-[#242424]"
    >
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => handleNavigate('/cart')}
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

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {renderMainContent()}
      </main>

      {/* Footer with HIMALAYAN giant typography and links */}
      <Footer
        onOpenCart={() => handleNavigate('/cart')}
        onNavigate={handleNavigate}
      />
    </motion.div>
  );
}

export default App;

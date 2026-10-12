import { useState, useEffect, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { MobileMenu } from './components/MobileMenu';
import { Footer } from './components/Footer';

// Eagerly loaded: Homepage sections (visible immediately)
import { HomePage } from './pages/HomePage';

// Lazy-loaded: Heavy pages only needed when navigated to
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const LabReportsPage = lazy(() => import('./pages/LabReportsPage').then(m => ({ default: m.LabReportsPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then(m => ({ default: m.ReviewsPage })));
const FaqPage = lazy(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions').then(m => ({ default: m.TermsAndConditions })));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy').then(m => ({ default: m.RefundPolicy })));
const AccountPage = lazy(() => import('./pages/AccountPage').then(m => ({ default: m.AccountPage })));
const AdminApp = lazy(() => import('./admin/AdminApp').then(m => ({ default: m.AdminApp })));

import { Product } from './data/content';

// CartItem interface defined here since CartPage is now lazy-loaded
export interface CartItem {
  id: string;
  product: Product;
  size: string;
  unitPrice: number;
  quantity: number;
}

// Minimal loading spinner for Suspense boundaries
const PageSpinner = () => (
  <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#F4F1EA]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#C9892E] border-t-transparent animate-spin" />
      <span className="font-mono text-[12px] uppercase tracking-wider text-[#686863]">Loading...</span>
    </div>
  </div>
);

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

  // Initialize Lenis smooth scroll (desktop/mouse only — mobile has native momentum scroll)
  useEffect(() => {
    // Skip on touch/mobile devices: native scroll is smoother and avoids rAF CPU overhead
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

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

    if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/forgot-password' || currentPath === '/account') {
      const mode = currentPath.replace('/', '') as 'login' | 'signup' | 'forgot-password' | 'account';
      return <AccountPage key={currentPath} mode={mode} onNavigate={handleNavigate} />;
    }

    // Default or /home: Editorial Multi-Section Homepage
    return (
      <HomePage
        onNavigate={handleNavigate}
      />
    );
  };

  // Dedicated Administrative Control Subsystem
  if (currentPath.startsWith('/admin')) {
    return (
      <Suspense fallback={<PageSpinner />}>
        <AdminApp
          currentPath={currentPath}
          onNavigate={handleNavigate}
        />
      </Suspense>
    );
  }

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
        <Suspense fallback={<PageSpinner />}>
          {renderMainContent()}
        </Suspense>
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

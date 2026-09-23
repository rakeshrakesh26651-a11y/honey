import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  or,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, ProductVariant } from '../data/himalayanHarvest';
import { PRODUCTS_COLLECTION } from '../admin/services/productService';

/**
 * Transforms a Firestore ProductDocument directly into a typed storefront Product.
 * Reads ALL editable fields strictly from Firestore as the single source of truth.
 * No static file fallbacks or merging.
 */
export function mapFirestoreDocToProduct(docId: string, data: any): Product {
  const normId = (docId || data.id || '').trim();
  const slug = (data.slug || data.id || docId || '').toLowerCase().trim();
  const name = (data.name || 'Himalayan Honey').trim();
  const category = (data.category || 'Wild Mountain Flora').trim();
  const subtitle = data.subtitle || '';
  const description = data.description || '';
  const badge = data.badge || '';
  const mainImage = data.image || '/images/hero_honey_jar.jpg';
  const alt = data.alt || `${name} bottle`;

  // Authoritative gallery images array
  const galleryImages = Array.isArray(data.galleryImages) && data.galleryImages.length > 0
    ? data.galleryImages.filter(Boolean)
    : (mainImage ? [mainImage] : []);

  // Authoritative variants from Firestore
  const rawVariants = Array.isArray(data.variants) ? data.variants : [];
  const variants: ProductVariant[] = rawVariants.map((v: any, index: number) => {
    const size = String(v.size || v.weight || (index === 0 ? '400g' : '1kg')).trim();
    const weight = String(v.weight || size).trim();
    const weightInGrams = Number(v.weightInGrams) || (size.toLowerCase().includes('kg') ? 1000 : parseInt(size, 10) || 400);
    const price = Number(v.price) >= 0 ? Number(v.price) : 0;
    const compareAtPrice = v.compareAtPrice !== undefined && Number(v.compareAtPrice) > 0
      ? Number(v.compareAtPrice)
      : undefined;
    const variantImage = v.image || mainImage;
    const hasDistinctAsset = Boolean(v.hasDistinctAsset ?? (v.image && v.image !== mainImage));
    const available = v.available !== false;
    const rawStock = v.stock ?? v.stockOnHand ?? v.quantity;
    const stock = rawStock !== undefined && rawStock !== null && !isNaN(Number(rawStock))
      ? Number(rawStock)
      : undefined;
    const id = v.id || `${normId}-${size}`;
    const sku = v.sku || `HHH-${normId.substring(0, 2).toUpperCase()}-${size.toUpperCase()}`;

    return {
      id,
      sku,
      size,
      weight,
      weightInGrams,
      price,
      compareAtPrice,
      image: variantImage,
      hasDistinctAsset,
      available,
      stock,
    };
  });

  // Calculate authoritative base selling price (basePrice -> min variant price -> price)
  const basePrice = Number(
    data.basePrice ??
    data.price ??
    (variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : 0)
  );

  const compareAtPrice = data.compareAtPrice !== undefined && Number(data.compareAtPrice) > 0
    ? Number(data.compareAtPrice)
    : undefined;

  const isAvailable = Boolean(data.available ?? data.active ?? true);
  const isActive = Boolean(data.active ?? data.available ?? true);

  // Authoritative characteristics from Firestore
  const characteristics = {
    aroma: data.characteristics?.aroma || '',
    tasteNote: data.characteristics?.tasteNote || '',
    sweetness: data.characteristics?.sweetness || '',
    texture: data.characteristics?.texture || '',
  };

  // Authoritative accordions & specifications from Firestore
  const accordions = {
    description: Array.isArray(data.accordions?.description)
      ? data.accordions.description
      : (description ? [description] : []),
    productDetails: {
      ingredients: data.accordions?.productDetails?.ingredients || '100% Pure Raw Wild Honey',
      packaging: data.accordions?.productDetails?.packaging || 'Sterilized food-grade glass jar with air-tight lid',
      storage: data.accordions?.productDetails?.storage || 'Store at room temperature away from direct sunlight. Do not refrigerate.',
      shelfLife: data.accordions?.productDetails?.shelfLife || '18 months from harvest date',
      ...(data.accordions?.productDetails || {}),
    },
    traditionalUse: Array.isArray(data.accordions?.traditionalUse)
      ? data.accordions.traditionalUse
      : (typeof data.accordions?.traditionalUse === 'string' ? data.accordions.traditionalUse.split('\n').filter(Boolean) : []),
    harvestingAndSource: Array.isArray(data.accordions?.harvestingAndSource)
      ? data.accordions.harvestingAndSource
      : (typeof data.accordions?.harvestingAndSource === 'string' ? data.accordions.harvestingAndSource.split('\n').filter(Boolean) : []),
    qualityLabReport: data.accordions?.qualityLabReport || undefined,
    returnsAndExchange: data.accordions?.returnsAndExchange || {
      summary: '7-day replacement guarantee for damaged transit or broken seals.',
      link: '/refund-policy',
    },
  };

  return {
    id: normId,
    slug,
    name,
    category,
    subtitle,
    description,
    badge,
    image: mainImage,
    alt,
    price: basePrice,
    basePrice,
    compareAtPrice,
    available: isAvailable,
    active: isActive,
    featured: Boolean(data.featured ?? false),
    displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
    variants,
    galleryImages,
    characteristics,
    accordions,
    whatsappMessage: data.whatsappMessage,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

// Module-level cache & subscription management
// Guarantees all storefront components share a single real-time Firestore stream
let cachedAllProducts: Product[] = [];
let cachedActiveProducts: Product[] = [];
let isInitialized = false;
let isLoading = true;
let currentError: Error | null = null;
const listeners = new Set<() => void>();
let unsubscribeFirestore: (() => void) | null = null;

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('[useProducts] Listener notification error:', e);
    }
  });
}

function startSubscription() {
  if (unsubscribeFirestore) return;

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);

    const handleSnapshot = (snapshot: any) => {
      isLoading = false;
      currentError = null;

      if (snapshot.empty) {
        cachedAllProducts = [];
        cachedActiveProducts = [];
        isInitialized = true;
        notifyListeners();
        return;
      }

      const firestoreProducts: Product[] = [];

      snapshot.docs.forEach((docSnap: any) => {
        const data = docSnap.data();
        const mapped = mapFirestoreDocToProduct(docSnap.id, data);
        firestoreProducts.push(mapped);
      });

      // Sort: displayOrder asc if provided, or alphabetically by name
      firestoreProducts.sort((a: any, b: any) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        return a.name.localeCompare(b.name);
      });

      cachedAllProducts = firestoreProducts;
      cachedActiveProducts = firestoreProducts.filter(
        (p) => p.available !== false && (p as any).active !== false
      );
      isInitialized = true;
      notifyListeners();
    };

    // Primary query matches active == true OR available == true
    // This allows public customers to read active catalog products seamlessly
    let primaryQ: any;
    try {
      primaryQ = query(
        productsRef,
        or(where('active', '==', true), where('available', '==', true))
      );
    } catch {
      primaryQ = query(productsRef, where('available', '==', true));
    }

    const fallbackAvailableQ = query(productsRef, where('available', '==', true));
    const fallbackActiveQ = query(productsRef, where('active', '==', true));
    const fallbackAllQ = query(productsRef);

    // Subscription runner with chained fallback for both empty snapshots and query errors
    const trySubscribe = (
      qToTry: any,
      nextFallback?: () => void
    ): (() => void) => {
      let isCancelled = false;
      let innerUnsub: (() => void) | null = null;

      innerUnsub = onSnapshot(
        qToTry,
        (snapshot: any) => {
          if (isCancelled) return;
          if (snapshot.empty && nextFallback) {
            isCancelled = true;
            if (innerUnsub) innerUnsub();
            nextFallback();
            return;
          }
          handleSnapshot(snapshot);
        },
        (err: any) => {
          if (isCancelled) return;
          console.warn('[useProducts] Query notice:', err?.code, err?.message);
          if (nextFallback) {
            isCancelled = true;
            if (innerUnsub) innerUnsub();
            nextFallback();
          } else {
            currentError = err;
            isLoading = false;
            isInitialized = true;
            notifyListeners();
          }
        }
      );

      return () => {
        isCancelled = true;
        if (innerUnsub) innerUnsub();
      };
    };

    const subscribeFallbackAll = () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = trySubscribe(fallbackAllQ);
    };

    const subscribeFallbackActive = () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = trySubscribe(fallbackActiveQ, subscribeFallbackAll);
    };

    const subscribeFallbackAvailable = () => {
      if (unsubscribeFirestore) unsubscribeFirestore();
      unsubscribeFirestore = trySubscribe(fallbackAvailableQ, subscribeFallbackActive);
    };

    unsubscribeFirestore = trySubscribe(primaryQ, subscribeFallbackAvailable);
  } catch (err: any) {
    console.error('[useProducts] Failed to initialize subscription! Code:', err?.code, 'Message:', err?.message);
    currentError = err;
    isLoading = false;
    isInitialized = true;
    notifyListeners();
  }
}

/**
 * Public storefront React hook for products.
 * Reads real-time product data directly from Firestore's `products` collection as the single source of truth.
 */
export function useProducts() {
  const [, setTick] = useState(0);

  useEffect(() => {
    startSubscription();

    const onUpdate = () => setTick((t) => t + 1);
    listeners.add(onUpdate);

    return () => {
      listeners.delete(onUpdate);
    };
  }, []);

  const getProductBySlug = (slugOrId: string): Product | undefined => {
    const target = (slugOrId || '').toLowerCase().trim();
    if (!target) return undefined;
    return cachedAllProducts.find(
      (p) =>
        (p.slug || '').toLowerCase().trim() === target ||
        (p.id || '').toLowerCase().trim() === target
    );
  };

  return {
    /** Filtered active/available products for customer catalog display */
    products: cachedActiveProducts,
    /** All products including inactive/drafts for explicit lookup */
    allProducts: cachedAllProducts,
    loading: isLoading && !isInitialized,
    error: currentError,
    getProductBySlug,
  };
}

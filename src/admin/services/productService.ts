import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProductDocument, ProductVariant } from '../../types/admin';
import { PRODUCTS } from '../../data/himalayanHarvest';

export const PRODUCTS_COLLECTION = 'products';

/**
 * Normalizes raw Firestore variant data to guarantee consistent stock, pricing, and identifiers.
 * Reads variant stock from `stock` (or fallback `stockOnHand` / `quantity`).
 */
export function normalizeProductVariant(v: any, index: number, docId: string): ProductVariant {
  const size = String(v.size || v.weight || (index === 0 ? '400g' : '1kg')).trim();
  const weight = String(v.weight || size).trim();
  const weightInGrams = Number(v.weightInGrams) || (size.toLowerCase().includes('kg') ? 1000 : parseInt(size, 10) || 400);
  const price = Number(v.price) >= 0 ? Number(v.price) : 0;
  const compareAtPrice = v.compareAtPrice !== undefined && Number(v.compareAtPrice) > 0 ? Number(v.compareAtPrice) : undefined;
  const rawStock = v.stock ?? v.stockOnHand ?? v.quantity;
  const stock = rawStock !== undefined && rawStock !== null && !isNaN(Number(rawStock)) ? Number(rawStock) : 0;
  const available = v.available !== false;
  const id = v.id || `${docId}-${size}`;
  const sku = v.sku || `HHH-${docId.substring(0, 2).toUpperCase()}-${size.toUpperCase()}`;
  const image = v.image || '';
  const hasDistinctAsset = Boolean(v.hasDistinctAsset);

  return {
    id,
    sku,
    size,
    weight,
    weightInGrams,
    price,
    compareAtPrice,
    image,
    hasDistinctAsset,
    available,
    stock,
  };
}

/**
 * Real-time subscription to all products in Firestore.
 * Automatically updates UI when products are added, edited, or deleted.
 */
export function subscribeAdminProducts(
  onData: (products: ProductDocument[]) => void,
  onError: (error: Error) => void
): () => void {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    // Order by createdAt desc if index exists, or fetch raw
    const q = query(productsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const products: ProductDocument[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const variants = Array.isArray(data.variants)
            ? data.variants.map((v: any, i: number) => normalizeProductVariant(v, i, docSnap.id))
            : [];
          return {
            ...data,
            id: docSnap.id,
            variants,
            active: data.active ?? data.available ?? true,
            available: data.available ?? data.active ?? true,
          } as ProductDocument;
        });

        // Sort: displayOrder asc if provided, or alphabetically by name
        products.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          return a.name.localeCompare(b.name);
        });

        onData(products);
      },
      (err) => {
        console.error('[ProductService] Snapshot error:', err);
        onError(err);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('[ProductService] Subscription setup failed:', err);
    onError(err);
    return () => {};
  }
}

/**
 * One-time fetch of all products.
 */
export async function getAdminProducts(): Promise<ProductDocument[]> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(productsRef);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    const variants = Array.isArray(data.variants)
      ? data.variants.map((v: any, i: number) => normalizeProductVariant(v, i, docSnap.id))
      : [];
    return {
      ...data,
      id: docSnap.id,
      variants,
      active: data.active ?? data.available ?? true,
      available: data.available ?? data.active ?? true,
    } as ProductDocument;
  });
}

/**
 * Creates a new product document in Firestore.
 */
export async function createAdminProduct(
  productData: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'>,
  authorEmail?: string
): Promise<string> {
  const docId = productData.slug
    ? productData.slug.toLowerCase().replace(/[^a-z0-9_-]/g, '')
    : doc(collection(db, PRODUCTS_COLLECTION)).id;

  const docRef = doc(db, PRODUCTS_COLLECTION, docId);

  // Prevent accidental overwriting of existing product data
  const existingDoc = await getDoc(docRef);
  if (existingDoc.exists()) {
    throw new Error(
      `A product with identifier "${docId}" already exists. Please choose a different title or URL slug.`
    );
  }

  const rawPayload = {
    ...productData,
    id: docId,
    slug: productData.slug || docId,
    active: productData.active ?? productData.available ?? true,
    available: productData.available ?? productData.active ?? true,
    createdBy: authorEmail || 'system',
    updatedBy: authorEmail || 'system',
  };

  // Strip undefined values to satisfy Firestore strict serialization
  const cleanPayload = JSON.parse(JSON.stringify(rawPayload));
  cleanPayload.createdAt = serverTimestamp();
  cleanPayload.updatedAt = serverTimestamp();

  await setDoc(docRef, cleanPayload);
  return docId;
}

/**
 * Updates an existing product document in Firestore.
 * Preserves createdAt and createdBy fields while recording updatedAt and updatedBy.
 * Uses atomic merge write with timeout protection so Save never hangs indefinitely.
 */
export async function updateAdminProduct(
  productId: string,
  productData: Partial<ProductDocument>,
  authorEmail?: string
): Promise<void> {
  const cleanId = (productId || '').trim();
  if (!cleanId) {
    throw new Error('Product ID is required for update.');
  }

  const docRef = doc(db, PRODUCTS_COLLECTION, cleanId);

  const rawPayload: any = {
    ...productData,
    updatedBy: authorEmail || 'system',
  };

  if (rawPayload.active !== undefined && rawPayload.available === undefined) {
    rawPayload.available = rawPayload.active;
  }
  if (rawPayload.available !== undefined && rawPayload.active === undefined) {
    rawPayload.active = rawPayload.available;
  }

  // Preserve core immutable and audit fields
  delete rawPayload.id;
  delete rawPayload.createdAt;
  delete rawPayload.createdBy;

  // Clean undefined properties before writing to Firestore
  const cleanPayload = JSON.parse(JSON.stringify(rawPayload));
  cleanPayload.updatedAt = serverTimestamp();

  // Commit product document and all variants in ONE efficient atomic batch write
  const batch = writeBatch(db);
  batch.set(docRef, cleanPayload, { merge: true });

  // Await batch commit with proper timer cleanup.
  // In Firebase Web SDK, mutations apply synchronously to local cache (latency compensation).
  // If the server acknowledgment is delayed or operating in offline queue mode, we allow up to
  // 4000ms for server confirmation without hanging the UI or throwing false timeout errors.
  let timerId: ReturnType<typeof setTimeout> | undefined;

  const commitPromise = batch.commit().catch((err) => {
    if (!timerId) {
      console.warn('[ProductService] Deferred Firestore commit background notice:', err);
    }
    throw err;
  });

  const safeTimeoutPromise = new Promise<void>((resolve) => {
    timerId = setTimeout(() => {
      timerId = undefined;
      console.info(
        `[ProductService] Update for product "${cleanId}" committed to Firestore local cache. Server sync in progress.`
      );
      resolve();
    }, 4000);
  });

  try {
    await Promise.race([commitPromise, safeTimeoutPromise]);
  } finally {
    if (timerId) {
      clearTimeout(timerId);
      timerId = undefined;
    }
  }
}

/**
 * Toggles a product's active / available status.
 */
export async function toggleAdminProductActive(
  productId: string,
  currentStatus: boolean,
  authorEmail?: string
): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  const nextStatus = !currentStatus;

  await updateDoc(docRef, {
    active: nextStatus,
    available: nextStatus,
    updatedAt: serverTimestamp(),
    updatedBy: authorEmail || 'system',
  });
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteAdminProduct(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Imports exactly ONE authentic catalog product into Firestore by its ID or slug.
 * Safely and idempotently verifies whether the product already exists before writing.
 * If already in Firestore, skips writing and preserves the existing document intact.
 * If not present, creates the product document containing ALL of its variants (e.g. 400g and 1kg).
 */
export async function importCatalogProduct(
  targetSlugOrId: string,
  authorEmail?: string
): Promise<{
  success: boolean;
  alreadyExisted: boolean;
  id: string;
  name: string;
}> {
  const normTarget = targetSlugOrId.trim().toLowerCase();
  const catalogProduct = PRODUCTS.find(
    (p) => (p.slug || p.id).toLowerCase() === normTarget || p.id.toLowerCase() === normTarget
  );

  if (!catalogProduct) {
    throw new Error(`Catalog product not found for identifier: "${targetSlugOrId}"`);
  }

  const targetDocId = catalogProduct.slug || catalogProduct.id;
  const docRef = doc(db, PRODUCTS_COLLECTION, targetDocId);

  // 1. Pre-check if already exists in Firestore
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(`[ProductService] Product "${targetDocId}" already exists in Firestore. Preserving existing document.`);
    return {
      success: true,
      alreadyExisted: true,
      id: targetDocId,
      name: catalogProduct.name,
    };
  }

  // 2. Map all authentic variants (e.g. 400g and 1kg) with initial stock
  const variantsWithStock = catalogProduct.variants.map((v) => ({
    ...v,
    id: `${catalogProduct.id}-${v.size}`,
    sku: `HHH-${catalogProduct.id.substring(0, 2).toUpperCase()}-${v.size.toUpperCase()}`,
    weightInGrams: v.size.includes('kg') ? 1000 : parseInt(v.size, 10) || 400,
    stock: 0,
    available: true,
  }));

  const productIndex = PRODUCTS.indexOf(catalogProduct);

  const productPayload: any = {
    id: targetDocId,
    slug: targetDocId,
    name: catalogProduct.name,
    category: catalogProduct.category,
    subtitle: catalogProduct.subtitle || '',
    description: catalogProduct.description,
    badge: catalogProduct.badge || '',
    available: catalogProduct.available ?? true,
    active: catalogProduct.available ?? true,
    featured: true,
    displayOrder: productIndex >= 0 ? productIndex + 1 : 1,
    image: catalogProduct.image,
    alt: catalogProduct.alt || `${catalogProduct.name} bottle`,
    galleryImages: catalogProduct.galleryImages || [catalogProduct.image],
    basePrice: catalogProduct.price,
    variants: variantsWithStock,
    characteristics: catalogProduct.characteristics || {
      aroma: 'Natural wildflower aroma',
      tasteNote: 'Pure raw honey richness',
      sweetness: 'Natural balanced sweetness',
      texture: 'Silky raw amber liquid',
    },
    accordions: catalogProduct.accordions || {
      description: [catalogProduct.description],
      productDetails: { ingredients: '100% Pure Raw Honey' },
      traditionalUse: ['Daily natural wellness routine'],
      harvestingAndSource: ['4th-generation sustainable harvesting'],
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    updatedBy: authorEmail || 'admin-single-import',
  };

  await setDoc(docRef, productPayload);
  console.log(`[ProductService] Successfully imported "${targetDocId}" with ${variantsWithStock.length} variants.`);

  return {
    success: true,
    alreadyExisted: false,
    id: targetDocId,
    name: catalogProduct.name,
  };
}

/**
 * Safely and idempotently seeds authentic catalog products into Firestore.
 * Performance optimized: Uses Firestore writeBatch() to commit all missing products
 * in a single atomic network operation rather than sequential round trips.
 * Pre-checks existing documents so that existing products (e.g. Forest Honey)
 * and their stock/price customizations are safely preserved and never overwritten.
 */
export async function seedInitialProductsFromCatalog(authorEmail?: string): Promise<{
  imported: number;
  skipped: number;
  total: number;
}> {
  console.log('[ProductService] Starting batched seed of catalog products...');
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(productsRef);

  // Index existing product IDs and slugs in Firestore
  const existingIds = new Set<string>();
  snapshot.docs.forEach((docSnap) => {
    existingIds.add(docSnap.id.toLowerCase());
    const data = docSnap.data();
    if (data.slug) existingIds.add(String(data.slug).toLowerCase());
    if (data.id) existingIds.add(String(data.id).toLowerCase());
  });

  // Identify missing products from static authentic catalog
  const missingProducts = PRODUCTS.filter((p) => {
    const targetDocId = (p.slug || p.id).toLowerCase();
    const pId = p.id.toLowerCase();
    return !existingIds.has(targetDocId) && !existingIds.has(pId);
  });

  const skipped = PRODUCTS.length - missingProducts.length;

  if (missingProducts.length === 0) {
    console.log('[ProductService] All catalog products already exist in Firestore. Nothing to import.');
    return {
      imported: 0,
      skipped,
      total: PRODUCTS.length,
    };
  }

  // Use writeBatch for atomic, high-performance single round-trip commit
  const batch = writeBatch(db);

  for (const p of missingProducts) {
    const targetDocId = p.slug || p.id;
    const docRef = doc(db, PRODUCTS_COLLECTION, targetDocId);

    // Map all variants (400g and 1kg) with initial stock
    const variantsWithStock = p.variants.map((v) => ({
      ...v,
      id: `${p.id}-${v.size}`,
      sku: `HHH-${p.id.substring(0, 2).toUpperCase()}-${v.size.toUpperCase()}`,
      weightInGrams: v.size.includes('kg') ? 1000 : parseInt(v.size, 10) || 400,
      stock: 0,
      available: true,
    }));

    const productIndex = PRODUCTS.indexOf(p);

    const rawPayload: any = {
      id: targetDocId,
      slug: targetDocId,
      name: p.name,
      category: p.category,
      subtitle: p.subtitle || '',
      description: p.description,
      badge: p.badge || '',
      available: p.available ?? true,
      active: p.available ?? true,
      featured: true,
      displayOrder: productIndex >= 0 ? productIndex + 1 : 1,
      image: p.image,
      alt: p.alt || `${p.name} bottle`,
      galleryImages: p.galleryImages || [p.image],
      basePrice: p.price,
      variants: variantsWithStock,
      characteristics: p.characteristics || {
        aroma: 'Natural wildflower aroma',
        tasteNote: 'Pure raw honey richness',
        sweetness: 'Natural balanced sweetness',
        texture: 'Silky raw amber liquid',
      },
      accordions: p.accordions || {
        description: [p.description],
        productDetails: { ingredients: '100% Pure Raw Honey' },
        traditionalUse: ['Daily natural wellness routine'],
        harvestingAndSource: ['4th-generation sustainable harvesting'],
      },
      updatedBy: authorEmail || 'system-batch-seed',
    };

    // Clean undefined fields to satisfy Firestore strict serialization
    const cleanPayload = JSON.parse(JSON.stringify(rawPayload));
    cleanPayload.createdAt = serverTimestamp();
    cleanPayload.updatedAt = serverTimestamp();

    batch.set(docRef, cleanPayload);
  }

  // Commit all missing products in one single atomic operation
  await batch.commit();
  console.log(`[ProductService] Successfully committed batch of ${missingProducts.length} product(s) to Firestore.`);

  return {
    imported: missingProducts.length,
    skipped,
    total: PRODUCTS.length,
  };
}

/**
 * Repairs the variants array for all existing Firestore products by merging
 * authoritative catalog variant data. Existing stock values are preserved.
 * Products with missing variant sizes are filled from the catalog definition.
 * Only updates products whose slug/id matches a known catalog entry.
 */
export async function repairProductVariantsFromCatalog(authorEmail?: string): Promise<{ repaired: number; skipped: number }> {
  const productsRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(productsRef);

  // Build a lookup map by slug and id from static catalog
  const catalogMap = new Map<string, typeof PRODUCTS[0]>();
  for (const p of PRODUCTS) {
    catalogMap.set(p.slug, p);
    catalogMap.set(p.id, p);
  }

  let repaired = 0;
  let skipped = 0;

  const batch = writeBatch(db);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const docId = docSnap.id;
    const slug = data.slug || docId;

    // Find the matching catalog product
    const catalogProduct = catalogMap.get(slug) || catalogMap.get(docId);
    if (!catalogProduct) {
      // Unknown product not in catalog — skip without modifying
      skipped++;
      continue;
    }

    const existingVariants: any[] = data.variants || [];

    // Build a map of existing variant stock by size so we preserve admin-set stock counts
    const existingStockBySizeOrWeight = new Map<string, number>();
    for (const ev of existingVariants) {
      const key = (ev.size || ev.weight || '').toLowerCase();
      if (key) existingStockBySizeOrWeight.set(key, ev.stock ?? 0);
    }

    // Build the full variant list from catalog, preserving existing stock where found
    const repairedVariants = catalogProduct.variants.map((v) => {
      const key = (v.size || v.weight || '').toLowerCase();
      const preservedStock = existingStockBySizeOrWeight.get(key) ?? 0;
      return {
        ...v,
        id: `${catalogProduct.id}-${v.size}`,
        sku: `HHH-${catalogProduct.id.substring(0, 2).toUpperCase()}-${v.size.toUpperCase()}`,
        weightInGrams: v.size.includes('kg') ? 1000 : parseInt(v.size, 10) || 400,
        stock: preservedStock,
        available: true,
      };
    });

    // Only update if the variant count is wrong or any variant is missing
    const existingSizes = new Set(existingVariants.map((v) => (v.size || v.weight || '').toLowerCase()));
    const catalogSizes = new Set(catalogProduct.variants.map((v) => v.size.toLowerCase()));
    const needsRepair = repairedVariants.length !== existingVariants.length ||
      [...catalogSizes].some((s) => !existingSizes.has(s));

    if (!needsRepair) {
      skipped++;
      continue;
    }

    batch.set(
      doc(db, PRODUCTS_COLLECTION, docId),
      {
        variants: repairedVariants,
        basePrice: catalogProduct.price,
        updatedAt: serverTimestamp(),
        updatedBy: authorEmail || 'system-repair',
      },
      { merge: true }
    );
    repaired++;
  }

  if (repaired > 0) {
    await batch.commit();
  }

  return { repaired, skipped };
}


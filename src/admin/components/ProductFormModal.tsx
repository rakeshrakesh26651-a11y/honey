import React, { useState, useEffect, useRef } from 'react';
import { ProductDocument, ProductVariant } from '../../types/admin';
import {
  AdminModal,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminIcons,
} from './ui';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialProduct?: ProductDocument | null;
}

const CATEGORY_PRESETS = [
  'Wild Mountain Flora',
  'High-Altitude Flora',
  'Small Bee Wild Comb',
  'Rare Mountain Comb',
  'Artisanal Reserve',
];

const WEIGHT_PRESETS = ['250g', '400g', '500g', '1kg'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct,
}) => {
  const isEditing = Boolean(initialProduct);

  // Tab navigation for luxury CMS feel
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'story' | 'variants' | 'accordions'>('info');

  // Form States
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(CATEGORY_PRESETS[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [image, setImage] = useState('');
  const [galleryImagesText, setGalleryImagesText] = useState('');
  const [active, setActive] = useState(true);

  // Characteristics
  const [aroma, setAroma] = useState('');
  const [tasteNote, setTasteNote] = useState('');
  const [sweetness, setSweetness] = useState('Medium');
  const [texture, setTexture] = useState('Velvety smooth');

  // Accordion Details
  const [ingredients, setIngredients] = useState('100% Pure Raw Wild Honey');
  const [packaging, setPackaging] = useState('Sterilized food-grade glass jar with air-tight gold lid');
  const [storage, setStorage] = useState('Store at room temperature away from direct sunlight. Do not refrigerate.');
  const [shelfLife, setShelfLife] = useState('18 months from harvest date');
  const [traditionalUse, setTraditionalUse] = useState('');
  const [harvestingAndSource, setHarvestingAndSource] = useState('');

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      id: 'v-400g',
      sku: 'HHH-400G',
      size: '400g',
      weight: '400g',
      weightInGrams: 400,
      price: 399,
      stock: 50,
      image: '',
      hasDistinctAsset: true,
      available: true,
    },
    {
      id: 'v-1kg',
      sku: 'HHH-1KG',
      size: '1kg',
      weight: '1kg',
      weightInGrams: 1000,
      price: 699,
      stock: 32,
      image: '',
      hasDistinctAsset: false,
      available: true,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name || '');
      setSlug(initialProduct.slug || initialProduct.id || '');

      if (CATEGORY_PRESETS.includes(initialProduct.category)) {
        setCategory(initialProduct.category);
        setIsCustomCategory(false);
      } else {
        setIsCustomCategory(true);
        setCustomCategory(initialProduct.category || '');
      }

      setSubtitle(initialProduct.subtitle || '');
      setDescription(initialProduct.description || '');
      setBadge(initialProduct.badge || '');
      setImage(initialProduct.image || '');
      setGalleryImagesText((initialProduct.galleryImages || []).join('\n'));
      setActive(initialProduct.active ?? initialProduct.available ?? true);

      // Characteristics
      if (initialProduct.characteristics) {
        setAroma(initialProduct.characteristics.aroma || '');
        setTasteNote(initialProduct.characteristics.tasteNote || '');
        setSweetness(initialProduct.characteristics.sweetness || 'Medium');
        setTexture(initialProduct.characteristics.texture || 'Velvety smooth');
      }

      // Accordions
      if (initialProduct.accordions) {
        const acc = initialProduct.accordions;
        setIngredients(acc.productDetails?.ingredients || '100% Pure Raw Wild Honey');
        setPackaging(acc.productDetails?.packaging || 'Sterilized food-grade glass jar with air-tight gold lid');
        setStorage(acc.productDetails?.storage || 'Store at room temperature away from direct sunlight. Do not refrigerate.');
        setShelfLife(acc.productDetails?.shelfLife || '18 months from harvest date');
        setTraditionalUse((acc.traditionalUse || []).join('\n'));
        setHarvestingAndSource((acc.harvestingAndSource || []).join('\n'));
      }

      // Variants
      if (initialProduct.variants && initialProduct.variants.length > 0) {
        setVariants(initialProduct.variants.map((v) => ({ ...v })));
      }
    } else {
      // Defaults for brand new product
      setName('');
      setSlug('');
      setCategory(CATEGORY_PRESETS[0]);
      setIsCustomCategory(false);
      setCustomCategory('');
      setSubtitle('');
      setDescription('');
      setBadge('');
      setImage('/images/hero_honey_jar.jpg');
      setGalleryImagesText('');
      setActive(true);
      setAroma('Deep wild mountain floral notes with hints of warm amber');
      setTasteNote('Rich, complex sweetness with earthy undertones');
      setSweetness('Medium-High');
      setTexture('Dense, smooth, and naturally unfiltered');
      setVariants([
        {
          id: 'v-400g',
          sku: 'HHH-400G',
          size: '400g',
          weight: '400g',
          weightInGrams: 400,
          price: 399,
          stock: 50,
          image: '',
          hasDistinctAsset: true,
          available: true,
        },
        {
          id: 'v-1kg',
          sku: 'HHH-1KG',
          size: '1kg',
          weight: '1kg',
          weightInGrams: 1000,
          price: 699,
          stock: 32,
          image: '',
          hasDistinctAsset: false,
          available: true,
        },
      ]);
    }
    setFormError(null);
    setActiveTab('info');
  }, [initialProduct, isOpen]);

  // Variant Helpers
  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      // Auto-update weightInGrams if size changed
      if (field === 'size' || field === 'weight') {
        const valStr = String(value).toLowerCase();
        if (valStr.includes('kg')) {
          const num = parseFloat(valStr) || 1;
          updated[index].weightInGrams = Math.round(num * 1000);
        } else if (valStr.includes('g')) {
          updated[index].weightInGrams = parseFloat(valStr) || 400;
        }
        updated[index].weight = String(value);
        updated[index].size = String(value);
      }
      return updated;
    });
  };

  const handleAddVariant = () => {
    const newWeight = variants.length === 0 ? '400g' : variants.length === 1 ? '1kg' : '250g';
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      sku: `HHH-${newWeight.toUpperCase()}`,
      size: newWeight,
      weight: newWeight,
      weightInGrams: newWeight === '1kg' ? 1000 : 400,
      price: 499,
      stock: 25,
      image: '',
      hasDistinctAsset: false,
      available: true,
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) {
      setFormError('Every honey product must contain at least 1 variant (e.g. 400g or 1kg).');
      return;
    }
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const isSubmittingRef = useRef(false);

  // Form submission
  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault?.();
    if (isSubmittingRef.current || isSaving) return;
    setFormError(null);

    // Synchronous validation before engaging saving state
    if (!name.trim()) {
      setFormError('Product title is required.');
      setActiveTab('info');
      return;
    }

    if (!slug.trim()) {
      setFormError('Product URL slug is required.');
      setActiveTab('info');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setFormError('Product category is required.');
      setActiveTab('info');
      return;
    }

    if (variants.length === 0) {
      setFormError('At least one weight variant is required.');
      setActiveTab('variants');
      return;
    }

    // Check variants validity (price >= 0 and stock >= 0)
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      const p = Number(v.price);
      if ((v.price as any) === '' || v.price === undefined || v.price === null || isNaN(p) || p < 0) {
        setFormError(`Variant #${i + 1} (${v.weight || v.size || 'Unnamed'}) must have a valid selling price of 0 or greater.`);
        setActiveTab('variants');
        return;
      }
      const s = Number(v.stock);
      if ((v.stock as any) === '' || v.stock === undefined || v.stock === null || isNaN(s) || s < 0) {
        setFormError(`Variant #${i + 1} (${v.weight || v.size || 'Unnamed'}) stock count must be 0 or greater.`);
        setActiveTab('variants');
        return;
      }
    }

    isSubmittingRef.current = true;
    setIsSaving(true);

    try {

      const galleryImages = galleryImagesText
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const sanitizedVariants: ProductVariant[] = variants.map((v, i) => {
        const sizeStr = String(v.size || v.weight || '400g').trim();
        const isKg = sizeStr.toLowerCase().includes('kg');
        const defaultGrams = isKg ? Math.round((parseFloat(sizeStr) || 1) * 1000) : (parseInt(sizeStr, 10) || 400);
        const priceNum = Math.max(0, Number(v.price) || 0);
        const stockNum = Math.max(0, Math.floor(Number(v.stock) || 0));

        return {
          id: v.id || `v-${slug.trim() || 'prod'}-${sizeStr.toLowerCase().replace(/[^a-z0-9]/g, '') || i}`,
          sku: (v.sku || '').trim() || `HHH-${(slug.trim() || 'PROD').substring(0, 3).toUpperCase()}-${sizeStr.toUpperCase()}`,
          size: sizeStr,
          weight: v.weight || sizeStr,
          weightInGrams: v.weightInGrams || defaultGrams,
          price: priceNum,
          stock: stockNum,
          image: v.image || '',
          hasDistinctAsset: Boolean(v.hasDistinctAsset),
          available: v.available ?? true,
        };
      });

      const basePrice = sanitizedVariants.length > 0 ? Math.min(...sanitizedVariants.map((v) => v.price)) : 0;

      const productPayload: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'> = {
        name: name.trim(),
        slug: slug.trim(),
        category: finalCategory,
        subtitle: subtitle.trim(),
        description: description.trim(),
        badge: badge.trim() || '',
        image: image.trim() || '/images/hero_honey_jar.jpg',
        galleryImages,
        basePrice,
        active,
        available: active,
        variants: sanitizedVariants,
        characteristics: {
          aroma: aroma.trim(),
          tasteNote: tasteNote.trim(),
          sweetness: sweetness.trim(),
          texture: texture.trim(),
        },
        accordions: {
          description: description.trim() ? [description.trim()] : [],
          productDetails: {
            ingredients: ingredients.trim(),
            packaging: packaging.trim(),
            storage: storage.trim(),
            shelfLife: shelfLife.trim(),
          },
          traditionalUse: traditionalUse
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          harvestingAndSource: harvestingAndSource
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
        },
      };

      await onSave(productPayload);
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product in Firestore.');
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Product: ${initialProduct?.name}` : 'Create New Honey Variety'}
      subtitle="Configure luxury catalog metadata, pricing, inventory, and variant weights."
      maxWidth="2xl"
      footer={
        <>
          <AdminButton
            type="button"
            variant="outline"
            size="md"
            disabled={isSaving}
            onClick={onClose}
          >
            Cancel
          </AdminButton>
          <AdminButton
            type="button"
            variant="primary"
            size="md"
            isLoading={isSaving}
            onClick={handleSubmit}
            icon={<AdminIcons.Check className="w-4 h-4" />}
          >
            {isEditing ? 'Save Changes' : 'Create Product'}
          </AdminButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Banner */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] flex items-center justify-between">
            <span className="font-medium">⚠ {formError}</span>
            <button
              type="button"
              onClick={() => setFormError(null)}
              className="text-[#991B1B] hover:opacity-100 opacity-60 ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl overflow-x-auto text-xs font-mono">
          {[
            { id: 'info', label: '1. Basic Info' },
            { id: 'variants', label: `2. Variants & Stock (${variants.length})` },
            { id: 'images', label: '3. Imagery' },
            { id: 'story', label: '4. Tasting & Aroma' },
            { id: 'accordions', label: '5. Specifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-[#2C241E] font-bold shadow-2xs border border-[#EBE6DD]'
                  : 'text-[#73665C] hover:text-[#2C241E] hover:bg-[#FAF8F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: BASIC INFORMATION */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Product Name *"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Forest Honey"
                required
              />
              <AdminInput
                label="URL Slug *"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. forest-honey"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AdminSelect
                  label="Category Preset"
                  value={isCustomCategory ? '__CUSTOM__' : category}
                  onChange={(e) => {
                    if (e.target.value === '__CUSTOM__') {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setCategory(e.target.value);
                    }
                  }}
                >
                  {CATEGORY_PRESETS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__CUSTOM__">+ Custom Category</option>
                </AdminSelect>

                {isCustomCategory && (
                  <div className="mt-2">
                    <AdminInput
                      label="Custom Category Name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Artisanal Forest Harvest"
                    />
                  </div>
                )}
              </div>

              <AdminInput
                label="Promotional Badge (Optional)"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. BEST SELLER, RARE HARVEST"
              />
            </div>

            <AdminInput
              label="Subtitle (Editorial Tagline)"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 100% Pure Raw Honey Harvested from Dense Flora"
            />

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73665C] font-medium mb-1.5">
                Catalog Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Detailed origin, harvest notes, and culinary profile..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs sm:text-sm text-[#2C241E] placeholder-[#9E9287] outline-none focus:bg-white focus:border-[#C9892E] focus:ring-2 focus:ring-[#C9892E]/20"
              />
            </div>

            {/* Active Toggle */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs sm:text-sm text-[#2C241E] block">
                  Product Visibility Status
                </span>
                <span className="text-[11px] text-[#73665C] block">
                  When enabled, this honey product is visible to customers across the storefront.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none ${
                  active ? 'bg-[#166534]' : 'bg-[#D5CBBC]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    active ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: VARIANTS & INVENTORY */}
        {activeTab === 'variants' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif text-sm font-semibold text-[#2C241E]">
                  Weight Variants & Inventory Matrix
                </h4>
                <p className="text-xs text-[#73665C]">
                  Configure price and warehouse stock for each jar size (typically 400g and 1kg).
                </p>
              </div>
              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
                icon={<AdminIcons.Plus className="w-3.5 h-3.5" />}
              >
                Add Variant
              </AdminButton>
            </div>

            <div className="space-y-3">
              {variants.map((v, index) => (
                <div
                  key={v.id || index}
                  className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#EBE6DD]">
                    <span className="font-mono text-xs font-bold text-[#C9892E]">
                      Variant #{index + 1}: {v.weight || v.size}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-xs text-[#8C8075] hover:text-[#C53030] font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10.5px] font-mono uppercase text-[#73665C] mb-1">
                        Weight / Size
                      </label>
                      <select
                        value={v.size || v.weight}
                        onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-xs font-mono outline-none focus:border-[#C9892E]"
                      >
                        {v.size && !WEIGHT_PRESETS.includes(v.size) && (
                          <option value={v.size}>{v.size}</option>
                        )}
                        {WEIGHT_PRESETS.map((w) => (
                          <option key={w} value={w}>
                            {w}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono uppercase text-[#73665C] mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={v.price === undefined || v.price === null ? '' : v.price}
                        onChange={(e) =>
                          handleUpdateVariant(
                            index,
                            'price',
                            e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0)
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-xs font-mono outline-none focus:border-[#C9892E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono uppercase text-[#73665C] mb-1">
                        Stock (Jars) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={v.stock === undefined || v.stock === null ? '' : v.stock}
                        onChange={(e) =>
                          handleUpdateVariant(
                            index,
                            'stock',
                            e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-xs font-mono outline-none focus:border-[#C9892E]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-mono uppercase text-[#73665C] mb-1">
                        SKU
                      </label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-[#E2DBD0] text-xs font-mono outline-none focus:border-[#C9892E]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMAGERY */}
        {activeTab === 'images' && (
          <div className="space-y-4">
            <AdminInput
              label="Primary Product Image Asset URL *"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/hero_honey_jar.jpg or HTTPS URL"
              hint="Authoritative showcase image presented in the catalog and product hero."
            />

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73665C] font-medium mb-1.5">
                Gallery Image URLs (One URL per line)
              </label>
              <textarea
                value={galleryImagesText}
                onChange={(e) => setGalleryImagesText(e.target.value)}
                rows={4}
                placeholder="https://.../jar-front.jpg&#10;https://.../jar-texture.jpg"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-mono text-[#2C241E] placeholder-[#9E9287] outline-none focus:bg-white focus:border-[#C9892E]"
              />
            </div>
          </div>
        )}

        {/* TAB 4: TASTING & AROMA */}
        {activeTab === 'story' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Aroma Notes"
                value={aroma}
                onChange={(e) => setAroma(e.target.value)}
                placeholder="e.g. Wild forest flora, hints of caramel"
              />
              <AdminInput
                label="Taste Profile"
                value={tasteNote}
                onChange={(e) => setTasteNote(e.target.value)}
                placeholder="e.g. Rich, warm floral sweetness"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Sweetness Intensity"
                value={sweetness}
                onChange={(e) => setSweetness(e.target.value)}
                placeholder="e.g. Medium, Delicate, Robust"
              />
              <AdminInput
                label="Texture & Density"
                value={texture}
                onChange={(e) => setTexture(e.target.value)}
                placeholder="e.g. Velvety smooth, Unfiltered crystalline"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SPECIFICATIONS & ACCORDIONS */}
        {activeTab === 'accordions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
              />
              <AdminInput
                label="Packaging"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Storage Instructions"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
              />
              <AdminInput
                label="Shelf Life"
                value={shelfLife}
                onChange={(e) => setShelfLife(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#73665C] font-medium mb-1.5">
                Traditional Uses (One line per bullet point)
              </label>
              <textarea
                value={traditionalUse}
                onChange={(e) => setTraditionalUse(e.target.value)}
                rows={3}
                placeholder="Natural morning wellness elixir with warm water&#10;Ayurvedic preparation base"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-sans text-[#2C241E] outline-none focus:bg-white focus:border-[#C9892E]"
              />
            </div>
          </div>
        )}
      </form>
    </AdminModal>
  );
};

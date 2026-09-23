import React, { useState, useEffect } from 'react';
import { ProductDocument } from '../../types/admin';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  subscribeAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  toggleAdminProductActive,
  deleteAdminProduct,
  seedInitialProductsFromCatalog,
  repairProductVariantsFromCatalog,
} from '../services/productService';
import { ProductFormModal } from '../components/ProductFormModal';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminBadge,
  AdminStatusBadge,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
  AdminModal,
  AdminPageHeader,
  AdminEmptyState,
  AdminLoadingState,
  AdminIcons,
} from '../components/ui';

interface AdminProductsPageProps {
  onNavigate?: (path: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = () => {
  const { adminUser } = useAdminAuth();

  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(null);

  // Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<ProductDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Batched Import & Action States
  const [isImporting, setIsImporting] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Real-time Firestore sync
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAdminProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message || 'Failed to load products from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: ProductDocument) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<ProductDocument, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, productData, adminUser?.email || 'admin');
        showNotification(`Product "${productData.name}" updated successfully.`);
      } else {
        await createAdminProduct(productData, adminUser?.email || 'admin');
        showNotification(`Product "${productData.name}" created successfully.`);
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to save product.', 'error');
      throw err;
    }
  };

  const handleToggleActive = async (product: ProductDocument) => {
    if (togglingId) return;
    setTogglingId(product.id);
    const currentActive = product.active ?? product.available ?? true;
    try {
      await toggleAdminProductActive(product.id, currentActive, adminUser?.email || 'admin');
      showNotification(
        `"${product.name}" is now ${!currentActive ? 'Active' : 'Inactive'}.`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to toggle status.', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteAdminProduct(deletingProduct.id);
      showNotification(`Product "${deletingProduct.name}" removed permanently.`);
      setDeletingProduct(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete product.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImportAllProducts = async () => {
    if (isImporting) return;
    setIsImporting(true);
    try {
      const result = await seedInitialProductsFromCatalog(adminUser?.email || 'admin');
      if (result.imported > 0) {
        showNotification(
          `Successfully imported ${result.imported} catalog product(s) into Firestore (${result.skipped} already preserved).`
        );
      } else {
        showNotification('All products already imported.');
      }
    } catch (err: any) {
      showNotification(err.message || 'Failed to import products.', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleRepairVariants = async () => {
    if (isRepairing) return;
    setIsRepairing(true);
    try {
      const result = await repairProductVariantsFromCatalog(adminUser?.email || 'admin-repair');
      showNotification(
        result.repaired > 0
          ? `Repaired variants for ${result.repaired} product(s). ${result.skipped} already complete.`
          : `All ${result.skipped} products already have both 400g and 1kg variants.`
      );
    } catch (err: any) {
      showNotification(err.message || 'Failed to repair variants.', 'error');
    } finally {
      setIsRepairing(false);
    }
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const queryLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      queryLower === '' ||
      (p.name || '').toLowerCase().includes(queryLower) ||
      (p.category || '').toLowerCase().includes(queryLower) ||
      (p.slug || '').toLowerCase().includes(queryLower) ||
      (p.variants ?? []).some((v) => (v.sku ?? '').toLowerCase().includes(queryLower));

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    const isActive = p.active ?? p.available ?? true;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && isActive) ||
      (statusFilter === 'INACTIVE' && !isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Authentic Metrics
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active ?? p.available ?? true).length;
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  const totalStockCount = products.reduce(
    (sum, p) =>
      sum +
      (p.variants?.reduce(
        (vSum, v) => vSum + Number(v.stock ?? (v as any).stockOnHand ?? (v as any).quantity ?? 0),
        0
      ) || 0),
    0
  );

  // Check if any product is missing its expected 2 variants (400g and 1kg)
  const hasIncompleteVariants =
    products.length > 0 &&
    products.some((p) => !p.variants || p.variants.length < 2);

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  // Compute price range helper
  const getPriceRange = (p: ProductDocument) => {
    if (!p.variants || p.variants.length === 0) return '₹0';
    const prices = p.variants.map((v) => v.price).filter((pr) => typeof pr === 'number' && !isNaN(pr));
    if (prices.length === 0) return '₹0';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `₹${min}`;
    return `₹${min} – ₹${max}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-md transition-all duration-200 animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]'
              : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{notification.type === 'success' ? '✓' : '⚠'}</span>
            <span className="font-medium">{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs opacity-60 hover:opacity-100 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Editorial Page Header */}
      <AdminPageHeader
        breadcrumb="Store / Products"
        title="Product Catalog"
        description="Authoritative master catalog synchronized with Firestore. Manage floral honey varieties, weights (400g and 1kg), pricing, and active status."
        actions={
          <>
            <AdminButton
              variant="outline"
              size="md"
              onClick={handleImportAllProducts}
              isLoading={isImporting}
              disabled={isImporting}
              icon={<AdminIcons.Refresh className="w-4 h-4 text-[#C9892E]" />}
            >
              {isImporting ? 'Importing...' : 'Import All Products'}
            </AdminButton>

            {hasIncompleteVariants && (
              <AdminButton
                variant="outline"
                size="md"
                onClick={handleRepairVariants}
                isLoading={isRepairing}
                icon={<AdminIcons.AlertTriangle className="w-4 h-4 text-[#D97706]" />}
                className="border-[#FDE68A] text-[#92400E] bg-[#FFFBEB] hover:bg-[#FEF3C7]"
              >
                Repair Variants (Missing 1kg)
              </AdminButton>
            )}

            <AdminButton
              variant="primary"
              size="md"
              onClick={handleOpenAddModal}
              icon={<AdminIcons.Plus className="w-4 h-4" />}
            >
              Add Product
            </AdminButton>
          </>
        }
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Catalog SKUs
          </span>
          <span className="font-serif text-2xl font-semibold text-[#2C241E] block">
            {totalProducts}
          </span>
          <span className="text-[11px] text-[#73665C] block">Unique varieties</span>
        </AdminCard>

        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Active Online
          </span>
          <span className="font-serif text-2xl font-semibold text-[#166534] block">
            {activeProducts}
          </span>
          <span className="text-[11px] text-[#73665C] block">Visible to customers</span>
        </AdminCard>

        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Total Variants
          </span>
          <span className="font-serif text-2xl font-semibold text-[#C9892E] block">
            {totalVariants}
          </span>
          <span className="text-[11px] text-[#73665C] block">400g & 1kg jars</span>
        </AdminCard>

        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Physical Stock
          </span>
          <span className="font-serif text-2xl font-semibold text-[#2C241E] block">
            {totalStockCount} <span className="text-xs font-mono font-normal text-[#8C8075]">units</span>
          </span>
          <span className="text-[11px] text-[#73665C] block">In warehouse inventory</span>
        </AdminCard>
      </div>

      {/* Search & Filter Bar */}
      <AdminCard padding="sm" className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, category, or SKU..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <div className="w-44">
            <AdminSelect
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </AdminSelect>
          </div>

          <div className="w-36">
            <AdminSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </AdminSelect>
          </div>

          {(searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-xs font-mono text-[#C9892E] hover:underline px-2 py-1 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </AdminCard>

      {/* Loading State */}
      {loading && <AdminLoadingState message="Loading catalog products from Firestore..." />}

      {/* Error State */}
      {error && !loading && (
        <AdminCard className="bg-[#FEF2F2] border-[#FECACA] text-[#991B1B] text-center p-6 space-y-2">
          <span className="text-xl block">⚠</span>
          <p className="font-semibold text-sm">{error}</p>
          <p className="text-xs text-[#991B1B]/80">Please check your Firebase connectivity or administrative permissions.</p>
        </AdminCard>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.HoneyJar className="w-7 h-7 text-[#C9892E]" />}
          title="No Products in Firestore Yet"
          description="Your products collection is currently empty. Click 'Import All Products' to import the authentic Himalayan Harvest catalog with all 400g and 1kg variants, or add a custom product."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <AdminButton
                variant="primary"
                size="md"
                onClick={handleImportAllProducts}
                isLoading={isImporting}
                disabled={isImporting}
                icon={<AdminIcons.Refresh className="w-4 h-4" />}
              >
                {isImporting ? 'Importing...' : 'Import All Products'}
              </AdminButton>
              <AdminButton
                variant="outline"
                size="md"
                onClick={handleOpenAddModal}
                icon={<AdminIcons.Plus className="w-4 h-4" />}
              >
                Add Custom Product
              </AdminButton>
            </div>
          }
        />
      )}

      {/* Products Table (Desktop) & Cards (Mobile) */}
      {!loading && !error && products.length > 0 && (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Product</AdminTableHeaderCell>
                <AdminTableHeaderCell>Category</AdminTableHeaderCell>
                <AdminTableHeaderCell>Variants & Pricing</AdminTableHeaderCell>
                <AdminTableHeaderCell>Total Stock</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableHead>

              <AdminTableBody>
                {filteredProducts.map((product) => {
                  const isActive = product.active ?? product.available ?? true;
                  const totalStock = (product.variants || []).reduce(
                    (sum, v) => sum + Number(v.stock ?? (v as any).stockOnHand ?? (v as any).quantity ?? 0),
                    0
                  );
                  const priceRange = getPriceRange(product);

                  return (
                    <AdminTableRow key={product.id}>
                      {/* Product Thumbnail & Name */}
                      <AdminTableCell>
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as any).src = '/images/hero_honey_jar.jpg';
                              }}
                            />
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm font-semibold text-[#2C241E]">
                                {product.name}
                              </span>
                              {product.badge && (
                                <AdminBadge variant="honey" size="sm">
                                  {product.badge}
                                </AdminBadge>
                              )}
                            </div>
                            <span className="font-mono text-[11px] text-[#8C8075] block">
                              /{product.slug}
                            </span>
                          </div>
                        </div>
                      </AdminTableCell>

                      {/* Category */}
                      <AdminTableCell>
                        <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EBE6DD] text-[11px] font-mono text-[#5A4F46] whitespace-nowrap">
                          {product.category}
                        </span>
                      </AdminTableCell>

                      {/* ALL Variants Displayed Clearly */}
                      <AdminTableCell>
                        <div className="space-y-1.5 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-semibold text-[#2C241E]">
                              {priceRange}
                            </span>
                            <span className="text-[11px] text-[#8C8075]">
                              ({product.variants?.length || 0} variants)
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {product.variants?.map((v) => (
                              <span
                                key={v.id || v.sku}
                                className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE6DD] text-[10.5px] font-mono text-[#2C241E] whitespace-nowrap"
                              >
                                <strong className="text-[#C9892E] font-semibold">{v.weight || v.size}</strong>: ₹{v.price} ({Number(v.stock ?? (v as any).stockOnHand ?? (v as any).quantity ?? 0)} jars)
                              </span>
                            ))}
                          </div>
                        </div>
                      </AdminTableCell>

                      {/* Total Stock */}
                      <AdminTableCell>
                        <div className="flex items-center gap-1.5 font-mono text-xs">
                          <span
                            className={`font-semibold ${
                              totalStock === 0
                                ? 'text-[#C53030]'
                                : totalStock <= 20
                                ? 'text-[#D97706]'
                                : 'text-[#166534]'
                            }`}
                          >
                            {totalStock}
                          </span>
                          <span className="text-[#8C8075] text-[11px]">units</span>
                        </div>
                      </AdminTableCell>

                      {/* Status Toggle */}
                      <AdminTableCell>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={togglingId === product.id}
                            onClick={() => handleToggleActive(product)}
                            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
                              togglingId === product.id
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer'
                            } ${
                              isActive ? 'bg-[#166534]' : 'bg-[#D5CBBC]'
                            }`}
                            title={`Click to ${isActive ? 'Deactivate' : 'Activate'}`}
                          >
                            <span
                              className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${
                                isActive ? 'right-[3px]' : 'left-[3px]'
                              }`}
                            />
                          </button>
                          <AdminStatusBadge
                            status={isActive ? 'Active' : 'Inactive'}
                            size="sm"
                          />
                        </div>
                      </AdminTableCell>

                      {/* Actions */}
                      <AdminTableCell align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg text-[#5A4F46] hover:text-[#2C241E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <AdminIcons.Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingProduct(product)}
                            className="p-1.5 rounded-lg text-[#8C8075] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <AdminIcons.Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
              </AdminTableBody>
            </AdminTable>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredProducts.map((product) => {
              const isActive = product.active ?? product.available ?? true;
              const totalStock = (product.variants || []).reduce(
                (sum, v) => sum + Number(v.stock ?? (v as any).stockOnHand ?? (v as any).quantity ?? 0),
                0
              );
              const priceRange = getPriceRange(product);

              return (
                <AdminCard key={product.id} padding="md" className="space-y-4">
                  {/* Top: Image, Name, Category */}
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.target as any).src = '/images/hero_honey_jar.jpg';
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif text-base font-semibold text-[#2C241E] truncate">
                          {product.name}
                        </h3>
                        <AdminStatusBadge
                          status={isActive ? 'Active' : 'Inactive'}
                          size="sm"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#8C8075] block mt-0.5">
                        {product.category}
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#C9892E] block mt-1">
                        {priceRange} • {totalStock} units
                      </span>
                    </div>
                  </div>

                  {/* ALL Variants displayed explicitly */}
                  <div className="pt-3 border-t border-[#EBE6DD] space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C8075] font-semibold block">
                      Variants ({product.variants?.length || 0}):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants?.map((v) => (
                        <div
                          key={v.id || v.sku}
                          className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EBE6DD] text-xs font-mono"
                        >
                          <span className="font-bold text-[#C9892E] block">{v.weight || v.size}</span>
                          <span className="text-[#2C241E] block">₹{v.price}</span>
                          <span className="text-[10px] text-[#8C8075] block">{Number(v.stock ?? (v as any).stockOnHand ?? (v as any).quantity ?? 0)} jars in stock</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="pt-3 border-t border-[#EBE6DD] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={togglingId === product.id}
                      onClick={() => handleToggleActive(product)}
                      className={`text-xs font-mono text-[#5A4F46] hover:text-[#2C241E] ${
                        togglingId === product.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      Status: <strong>{isActive ? 'Active' : 'Inactive'}</strong> {togglingId === product.id ? '(Updating...)' : '(Toggle)'}
                    </button>

                    <div className="flex items-center gap-2">
                      <AdminButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenEditModal(product)}
                        icon={<AdminIcons.Edit className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        size="sm"
                        onClick={() => setDeletingProduct(product)}
                        icon={<AdminIcons.Trash className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                </AdminCard>
              );
            })}
          </div>
        </>
      )}

      {/* Product Form Modal (Create / Edit) */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialProduct={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(deletingProduct)}
        onClose={() => !isDeleting && setDeletingProduct(null)}
        title="Confirm Product Deletion"
        subtitle="This action permanently removes the product document from Firestore."
        maxWidth="sm"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="md"
              disabled={isDeleting}
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="danger"
              size="md"
              isLoading={isDeleting}
              onClick={handleConfirmDelete}
            >
              Delete Permanently
            </AdminButton>
          </>
        }
      >
        <div className="space-y-3 py-2 text-sm text-[#5A4F46]">
          <p>
            Are you sure you want to delete{' '}
            <strong className="text-[#2C241E] font-semibold">
              "{deletingProduct?.name}"
            </strong>
            ?
          </p>
          <div className="p-3 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] text-xs text-[#C53030]">
            <p className="font-semibold mb-0.5">Warning: Permanent action</p>
            <p>
              This will remove this product variety and all associated variant stock records from the public storefront and admin catalog.
            </p>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

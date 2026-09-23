import React, { useState, useEffect } from 'react';
import { ProductDocument, ProductVariant } from '../../types/admin';
import { subscribeAdminProducts, updateAdminProduct } from '../services/productService';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminBadge,
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

interface InventoryRow {
  productId: string;
  productName: string;
  productImage: string;
  variantIndex: number;
  variant: ProductVariant;
  updatedAt?: any;
}

export const AdminInventoryPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HEALTHY' | 'LOW' | 'OUT'>('ALL');
  const [notification, setNotification] = useState<string | null>(null);

  // Quick Edit Modal
  const [adjustingItem, setAdjustingItem] = useState<InventoryRow | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeAdminProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Flatten product variants into inventory rows
  const inventoryRows: InventoryRow[] = products.flatMap((p) =>
    (p.variants || []).map((v, vIndex) => ({
      productId: p.id,
      productName: p.name,
      productImage: p.image,
      variantIndex: vIndex,
      variant: v,
      updatedAt: p.updatedAt,
    }))
  );

  const filteredRows = inventoryRows.filter((row) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      row.productName.toLowerCase().includes(q) ||
      (row.variant.sku || '').toLowerCase().includes(q) ||
      (row.variant.size || row.variant.weight || '').toLowerCase().includes(q);

    const stock = Number(row.variant.stock ?? (row.variant as any).stockOnHand ?? (row.variant as any).quantity ?? 0);
    const isOut = stock === 0;
    const isLow = stock > 0 && stock <= 20;
    const isHealthy = stock > 20;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'HEALTHY' && isHealthy) ||
      (statusFilter === 'LOW' && isLow) ||
      (statusFilter === 'OUT' && isOut);

    return matchesSearch && matchesStatus;
  });

  // Inventory Metrics
  const totalStockUnits = inventoryRows.reduce(
    (sum, r) => sum + Number(r.variant.stock ?? (r.variant as any).stockOnHand ?? (r.variant as any).quantity ?? 0),
    0
  );
  const lowStockCount = inventoryRows.filter((r) => {
    const s = Number(r.variant.stock ?? (r.variant as any).stockOnHand ?? (r.variant as any).quantity ?? 0);
    return s > 0 && s <= 20;
  }).length;
  const outOfStockCount = inventoryRows.filter(
    (r) => Number(r.variant.stock ?? (r.variant as any).stockOnHand ?? (r.variant as any).quantity ?? 0) === 0
  ).length;

  const handleOpenAdjust = (row: InventoryRow) => {
    setAdjustingItem(row);
    setNewStockValue(Number(row.variant.stock ?? (row.variant as any).stockOnHand ?? (row.variant as any).quantity ?? 0));
  };

  const handleSaveStock = async () => {
    if (!adjustingItem) return;
    const product = products.find((p) => p.id === adjustingItem.productId);
    if (!product || !product.variants) return;

    setIsUpdating(true);
    try {
      const updatedVariants = [...product.variants];
      updatedVariants[adjustingItem.variantIndex] = {
        ...updatedVariants[adjustingItem.variantIndex],
        stock: Math.max(0, Math.floor(newStockValue)),
      };

      await updateAdminProduct(
        product.id,
        { variants: updatedVariants },
        adminUser?.email || 'admin'
      );
      showToast(`Stock for ${adjustingItem.productName} (${adjustingItem.variant.size}) updated to ${newStockValue}.`);
      setAdjustingItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Synced';
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return 'Synced';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {notification && (
        <div className="p-4 rounded-xl border bg-[#F0FDF4] border-[#DCFCE7] text-[#166534] text-xs sm:text-sm shadow-md animate-in fade-in">
          {notification}
        </div>
      )}

      <AdminPageHeader
        breadcrumb="Store / Inventory"
        title="Inventory Matrix"
        description="Physical jar warehouse counts tracked per variant SKU. Real-time stock levels synced with customer checkout limits."
        actions={
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-white border border-[#EBE6DD] text-[#73665C]">
            Total Variants: <strong>{inventoryRows.length}</strong>
          </span>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Total Stock On Hand
          </span>
          <span className="font-serif text-2xl font-semibold text-[#2C241E] block">
            {totalStockUnits} <span className="text-xs font-mono font-normal text-[#8C8075]">jars</span>
          </span>
          <span className="text-[11px] text-[#73665C] block">Across all 4 catalog honey varieties</span>
        </AdminCard>

        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Low Stock Watchlist
          </span>
          <span className={`font-serif text-2xl font-semibold block ${lowStockCount > 0 ? 'text-[#D97706]' : 'text-[#2C241E]'}`}>
            {lowStockCount} <span className="text-xs font-mono font-normal text-[#8C8075]">variants</span>
          </span>
          <span className="text-[11px] text-[#73665C] block">Variants with 20 or fewer jars</span>
        </AdminCard>

        <AdminCard padding="sm" className="space-y-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] block">
            Out of Stock
          </span>
          <span className={`font-serif text-2xl font-semibold block ${outOfStockCount > 0 ? 'text-[#C53030]' : 'text-[#166534]'}`}>
            {outOfStockCount} <span className="text-xs font-mono font-normal text-[#8C8075]">variants</span>
          </span>
          <span className="text-[11px] text-[#73665C] block">Requiring immediate apiary bottling</span>
        </AdminCard>
      </div>

      {/* Search & Filter Bar */}
      <AdminCard padding="sm" className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by variety or SKU..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-48">
          <AdminSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="ALL">All Stock Levels</option>
            <option value="HEALTHY">Healthy (&gt;20)</option>
            <option value="LOW">Low Stock (≤20)</option>
            <option value="OUT">Out of Stock (0)</option>
          </AdminSelect>
        </div>
      </AdminCard>

      {/* Loading State */}
      {loading && <AdminLoadingState message="Loading inventory matrix from Firestore..." />}

      {/* Empty State */}
      {!loading && inventoryRows.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.Inventory className="w-7 h-7 text-[#C9892E]" />}
          title="No Inventory Records Yet"
          description="Your catalog products collection contains no variants to track. Add or import products from the Product Catalog."
        />
      )}

      {/* Table */}
      {!loading && inventoryRows.length > 0 && (
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Product</AdminTableHeaderCell>
            <AdminTableHeaderCell>Variant Size</AdminTableHeaderCell>
            <AdminTableHeaderCell>SKU</AdminTableHeaderCell>
            <AdminTableHeaderCell>Price</AdminTableHeaderCell>
            <AdminTableHeaderCell>Current Stock</AdminTableHeaderCell>
            <AdminTableHeaderCell>Status</AdminTableHeaderCell>
            <AdminTableHeaderCell>Updated</AdminTableHeaderCell>
            <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
          </AdminTableHead>

          <AdminTableBody>
            {filteredRows.map((row) => {
              const stock = Number(row.variant.stock ?? (row.variant as any).stockOnHand ?? (row.variant as any).quantity ?? 0);
              const isOut = stock === 0;
              const isLow = stock > 0 && stock <= 20;

              return (
                <AdminTableRow key={`${row.productId}-${row.variant.id || row.variant.sku}`}>
                  {/* Product */}
                  <AdminTableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                        <img
                          src={row.productImage}
                          alt={row.productName}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as any).src = '/images/hero_honey_jar.jpg';
                          }}
                        />
                      </div>
                      <span className="font-serif text-xs font-semibold text-[#2C241E]">
                        {row.productName}
                      </span>
                    </div>
                  </AdminTableCell>

                  {/* Variant Size */}
                  <AdminTableCell>
                    <span className="font-mono text-xs font-semibold text-[#C9892E]">
                      {row.variant.size || row.variant.weight}
                    </span>
                  </AdminTableCell>

                  {/* SKU */}
                  <AdminTableCell>
                    <span className="font-mono text-xs text-[#73665C]">
                      {row.variant.sku}
                    </span>
                  </AdminTableCell>

                  {/* Price */}
                  <AdminTableCell>
                    <span className="font-serif text-xs font-semibold text-[#2C241E]">
                      ₹{row.variant.price}
                    </span>
                  </AdminTableCell>

                  {/* Current Stock */}
                  <AdminTableCell>
                    <span className="font-mono text-xs font-bold text-[#2C241E]">
                      {stock} <span className="text-[10.5px] font-normal text-[#8C8075]">jars</span>
                    </span>
                  </AdminTableCell>

                  {/* Status */}
                  <AdminTableCell>
                    {isOut ? (
                      <AdminBadge variant="danger" size="sm" dot>
                        Out of Stock
                      </AdminBadge>
                    ) : isLow ? (
                      <AdminBadge variant="warning" size="sm" dot>
                        Low Stock ({stock})
                      </AdminBadge>
                    ) : (
                      <AdminBadge variant="success" size="sm" dot>
                        In Stock
                      </AdminBadge>
                    )}
                  </AdminTableCell>

                  {/* Updated */}
                  <AdminTableCell>
                    <span className="font-mono text-[11px] text-[#8C8075]">
                      {formatDate(row.updatedAt)}
                    </span>
                  </AdminTableCell>

                  {/* Actions */}
                  <AdminTableCell align="right">
                    <AdminButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenAdjust(row)}
                      icon={<AdminIcons.Edit className="w-3.5 h-3.5" />}
                    >
                      Adjust
                    </AdminButton>
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTableBody>
        </AdminTable>
      )}

      {/* Adjust Stock Modal */}
      <AdminModal
        isOpen={Boolean(adjustingItem)}
        onClose={() => setAdjustingItem(null)}
        title={`Adjust Stock: ${adjustingItem?.productName}`}
        subtitle={`Variant: ${adjustingItem?.variant.size || adjustingItem?.variant.weight} (SKU: ${adjustingItem?.variant.sku})`}
        maxWidth="sm"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="md"
              disabled={isUpdating}
              onClick={() => setAdjustingItem(null)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              size="md"
              isLoading={isUpdating}
              onClick={handleSaveStock}
            >
              Update Stock
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <AdminInput
            label="New Stock Quantity (Jars)"
            type="number"
            min="0"
            value={newStockValue}
            onChange={(e) => setNewStockValue(parseInt(e.target.value, 10) || 0)}
            hint="Enter physical units available in warehouse."
          />

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-[#73665C]">Quick Presets:</span>
            {[0, 15, 30, 50, 100].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNewStockValue(preset)}
                className="px-2 py-1 text-xs font-mono bg-[#FAF8F5] border border-[#EBE6DD] rounded-md hover:border-[#C9892E] text-[#2C241E] cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

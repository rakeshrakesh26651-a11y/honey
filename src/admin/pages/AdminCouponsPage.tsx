import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CouponDocument, CouponDiscountType } from '../../types/admin';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminSelect,
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

export const AdminCouponsPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [coupons, setCoupons] = useState<CouponDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'active' | 'inactive'>('ALL');

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponDocument | null>(null);
  const [couponToDelete, setReviewToDelete] = useState<CouponDocument | null>(null);
  const [operatingCode, setOperatingCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<CouponDiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(500);
  const [maxDiscount, setMaxDiscount] = useState<string>('');
  const [startDateStr, setStartDateStr] = useState<string>('');
  const [expirationDateStr, setExpirationDateStr] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const showToast = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      if (isMountedRef.current) setNotification(null);
    }, 4000);
  };

  const parseTimestamp = (ts: any): number => {
    if (!ts) return 0;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (typeof ts.seconds === 'number') return ts.seconds * 1000;
    const parsed = new Date(ts).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatDateToInput = (date: Date): string => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const resetForm = () => {
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 90);

    setCode('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinOrder(500);
    setMaxDiscount('');
    setStartDateStr(formatDateToInput(now));
    setExpirationDateStr(formatDateToInput(expiry));
    setUsageLimit(100);
    setDescription('');
    setFormError(null);
    setEditingCoupon(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: CouponDocument) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType || 'percentage');
    setDiscountValue(coupon.discountValue || 10);
    setMinOrder(coupon.minimumOrderAmount || 0);
    setMaxDiscount(coupon.maximumDiscountAmount !== undefined ? String(coupon.maximumDiscountAmount) : '');

    const startMs = parseTimestamp(coupon.startDate);
    const endMs = parseTimestamp(coupon.expirationDate);
    setStartDateStr(startMs ? formatDateToInput(new Date(startMs)) : formatDateToInput(new Date()));
    setExpirationDateStr(endMs ? formatDateToInput(new Date(endMs)) : formatDateToInput(new Date(Date.now() + 90 * 86400000)));

    setUsageLimit(coupon.usageLimit || 100);
    setDescription(coupon.description || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Real-time Firestore sync with infinite-loading protection
  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    setError(null);

    const safetyTimeout = setTimeout(() => {
      if (isMountedRef.current && loading) {
        setLoading(false);
      }
    }, 5000);

    let unsubscribe = () => {};
    try {
      const q = query(collection(db, 'coupons'));
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          clearTimeout(safetyTimeout);
          if (!isMountedRef.current) return;

          const loaded = snapshot.docs.map(
            (d) => ({ code: d.id, ...d.data() } as CouponDocument)
          );

          // Client-side sort by createdAt desc
          loaded.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));

          setCoupons(loaded);
          setLoading(false);
          setError(null);
        },
        (err) => {
          clearTimeout(safetyTimeout);
          console.warn('[AdminCouponsPage] Snapshot listener notice:', err.message);
          if (!isMountedRef.current) return;
          setError(err.message || 'Failed to sync live promotional coupons.');
          setLoading(false);
        }
      );
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to initialize coupons listener.');
        setLoading(false);
      }
    }

    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const handleToggleActive = async (coupon: CouponDocument) => {
    if (operatingCode) return;
    setOperatingCode(coupon.code);

    try {
      await updateDoc(doc(db, 'coupons', coupon.code), {
        active: !coupon.active,
        updatedAt: serverTimestamp(),
        updatedBy: adminUser?.email || 'admin',
      });
      showToast(`Coupon ${coupon.code} is now ${!coupon.active ? 'ACTIVE' : 'INACTIVE'}.`);
    } catch (err: any) {
      console.error('[AdminCouponsPage] Toggle active failed:', err);
      showToast(err.message || 'Failed to toggle coupon status.', true);
    } finally {
      setOperatingCode(null);
    }
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, 'coupons', couponToDelete.code));
      showToast(`Coupon ${couponToDelete.code} deleted successfully.`);
      setReviewToDelete(null);
    } catch (err: any) {
      console.error('[AdminCouponsPage] Delete coupon failed:', err);
      showToast(err.message || 'Failed to delete coupon.', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      setFormError('Please enter a valid coupon code (letters, numbers, hyphens only).');
      return;
    }

    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      setFormError('Percentage discount must be between 1% and 100%.');
      return;
    }

    if (discountType === 'fixed' && discountValue <= 0) {
      setFormError('Fixed discount amount must be greater than ₹0.');
      return;
    }

    if (minOrder < 0) {
      setFormError('Minimum order amount cannot be negative.');
      return;
    }

    const start = startDateStr ? new Date(`${startDateStr}T00:00:00`) : new Date();
    const expiration = expirationDateStr ? new Date(`${expirationDateStr}T23:59:59`) : new Date(Date.now() + 90 * 86400000);

    if (expiration.getTime() < start.getTime()) {
      setFormError('Expiration date cannot be earlier than start date.');
      return;
    }

    const maxDiscNum = maxDiscount.trim() !== '' ? Math.max(0, parseFloat(maxDiscount)) : undefined;

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        // Updating existing coupon
        const updatePayload: Record<string, any> = {
          discountType,
          discountValue,
          minimumOrderAmount: minOrder,
          maximumDiscountAmount: maxDiscNum,
          usageLimit: Math.max(1, usageLimit),
          startDate: Timestamp.fromDate(start),
          expirationDate: Timestamp.fromDate(expiration),
          description: description.trim() || `${discountValue}${discountType === 'percentage' ? '%' : ' INR'} promotional discount`,
          updatedAt: serverTimestamp(),
          updatedBy: adminUser?.email || 'admin',
        };

        await updateDoc(doc(db, 'coupons', editingCoupon.code), updatePayload);
        showToast(`Coupon ${editingCoupon.code} updated successfully.`);
      } else {
        // Creating new coupon
        const newCouponPayload: CouponDocument = {
          code: cleanCode,
          discountType,
          discountValue,
          minimumOrderAmount: minOrder,
          maximumDiscountAmount: maxDiscNum,
          usageLimit: Math.max(1, usageLimit),
          usageCount: 0,
          startDate: Timestamp.fromDate(start),
          expirationDate: Timestamp.fromDate(expiration),
          active: true,
          description: description.trim() || `${discountValue}${discountType === 'percentage' ? '%' : ' INR'} promotional discount`,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          updatedBy: adminUser?.email || 'admin',
        };

        await setDoc(doc(db, 'coupons', cleanCode), newCouponPayload);
        showToast(`Coupon ${cleanCode} created successfully.`);
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('[AdminCouponsPage] Save failed:', err);
      setFormError(err.message || 'Failed to save coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const queryLower = searchQuery.toLowerCase().trim();
    const codeMatch = (c.code || '').toLowerCase().includes(queryLower);
    const descMatch = (c.description || '').toLowerCase().includes(queryLower);
    const matchesSearch = queryLower === '' || codeMatch || descMatch;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'active' && c.active) ||
      (statusFilter === 'inactive' && !c.active);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '--';
    try {
      const ms = parseTimestamp(timestamp);
      if (!ms) return '--';
      const d = new Date(ms);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    } catch {
      return '--';
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div
          className={`p-4 rounded-xl border text-xs sm:text-sm shadow-md animate-in fade-in ${
            notification.isError
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
              : 'bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]'
          }`}
        >
          {notification.message}
        </div>
      )}

      <AdminPageHeader
        breadcrumb="Marketing / Coupons"
        title="Promotional Coupons"
        description="Configure promotional codes with percentage deductions or fixed INR amounts, minimum cart subtotal rules, discount caps, and usage limits."
        actions={
          <AdminButton
            variant="primary"
            size="md"
            onClick={openCreateModal}
            icon={<AdminIcons.Plus className="w-4 h-4" />}
          >
            Create Coupon
          </AdminButton>
        }
      />

      {/* Search & Status Filters */}
      <AdminCard padding="sm" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code or note..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-mono">
          {(['ALL', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-white text-[#2C241E] font-bold shadow-2xs border border-[#EBE6DD]'
                  : 'text-[#73665C] hover:text-[#2C241E]'
              }`}
            >
              {status === 'ALL' ? 'All Coupons' : status}
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Loading */}
      {loading && <AdminLoadingState message="Loading coupons from Firestore..." />}

      {/* Error */}
      {error && !loading && (
        <AdminCard className="bg-[#FEF2F2] border-[#FECACA] text-[#991B1B] text-center p-6 space-y-3">
          <p className="font-semibold text-sm">{error}</p>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </AdminButton>
        </AdminCard>
      )}

      {/* Empty State */}
      {!loading && !error && coupons.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.Coupons className="w-7 h-7 text-[#C9892E]" />}
          title="No Coupons Yet"
          description="Your promotional discount codes collection is currently empty. Create your first coupon code to offer incentives on checkout."
          action={
            <AdminButton
              variant="primary"
              size="md"
              onClick={openCreateModal}
              icon={<AdminIcons.Plus className="w-4 h-4" />}
            >
              Create First Coupon
            </AdminButton>
          }
        />
      )}

      {/* Table */}
      {!loading && !error && coupons.length > 0 && (
        <>
          {filteredCoupons.length === 0 ? (
            <AdminCard className="text-center py-10 text-xs text-[#73665C]">
              No coupons found matching the active search or status filter.
            </AdminCard>
          ) : (
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Coupon Code</AdminTableHeaderCell>
                <AdminTableHeaderCell>Discount</AdminTableHeaderCell>
                <AdminTableHeaderCell>Min. Order</AdminTableHeaderCell>
                <AdminTableHeaderCell>Max. Cap</AdminTableHeaderCell>
                <AdminTableHeaderCell>Usage</AdminTableHeaderCell>
                <AdminTableHeaderCell>Validity Window</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableHead>

              <AdminTableBody>
                {filteredCoupons.map((c) => {
                  const isBusy = operatingCode === c.code;

                  return (
                    <AdminTableRow key={c.code}>
                      <AdminTableCell>
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-[#C9892E] px-2.5 py-1 rounded-md bg-[#FAF3E8] border border-[#F0DFC4] inline-block">
                            {c.code}
                          </span>
                          {c.description && (
                            <span className="text-[11px] text-[#8C8075] block truncate max-w-[160px]">
                              {c.description}
                            </span>
                          )}
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-semibold text-xs text-[#2C241E]">
                          {c.discountType === 'percentage'
                            ? `${c.discountValue}% OFF`
                            : `₹${c.discountValue} OFF`}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-xs text-[#5A4F46]">
                          ₹{(c.minimumOrderAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-xs text-[#73665C]">
                          {c.maximumDiscountAmount ? `₹${c.maximumDiscountAmount.toLocaleString('en-IN')}` : '--'}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-xs text-[#73665C]">
                          {c.usageCount || 0} / {c.usageLimit || '∞'}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <div className="font-mono text-[10.5px] text-[#73665C] space-y-0.5">
                          <span>{formatDate(c.startDate)}</span>
                          <span className="text-[#8C8075] block">to {formatDate(c.expirationDate)}</span>
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminStatusBadge status={c.active ? 'Active' : 'Inactive'} size="sm" />
                      </AdminTableCell>

                      <AdminTableCell align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          <AdminButton
                            variant="secondary"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => openEditModal(c)}
                            icon={<AdminIcons.Edit className="w-3.5 h-3.5" />}
                          >
                            Edit
                          </AdminButton>

                          <AdminButton
                            variant="outline"
                            size="sm"
                            disabled={isBusy}
                            isLoading={isBusy}
                            onClick={() => handleToggleActive(c)}
                          >
                            {c.active ? 'Deactivate' : 'Activate'}
                          </AdminButton>

                          <AdminButton
                            variant="danger"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => setReviewToDelete(c)}
                            icon={<AdminIcons.Trash className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </AdminButton>
                        </div>
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
              </AdminTableBody>
            </AdminTable>
          )}
        </>
      )}

      {/* Create / Edit Coupon Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isSubmitting) setIsModalOpen(false);
        }}
        title={editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create Promotional Coupon'}
        subtitle={
          editingCoupon
            ? 'Modify discount parameters, usage limits, or validity window.'
            : 'Generate a unique discount code enforced server-side during checkout.'
        }
        maxWidth="lg"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="md"
              disabled={isSubmitting}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleSaveCoupon}
              icon={<AdminIcons.Check className="w-4 h-4" />}
            >
              {editingCoupon ? 'Save Changes' : 'Create Code'}
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleSaveCoupon} className="space-y-4 py-2">
          {formError && (
            <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-medium">
              ⚠ {formError}
            </div>
          )}

          <AdminInput
            label="Coupon Code *"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. HARVEST10"
            hint={editingCoupon ? 'Coupon code key cannot be altered once created.' : 'Uppercase letters, numbers, hyphens only.'}
            disabled={Boolean(editingCoupon) || isSubmitting}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminSelect
              label="Discount Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              disabled={isSubmitting}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed INR (₹)</option>
            </AdminSelect>

            <AdminInput
              label={discountType === 'percentage' ? 'Percentage Discount (1-100) *' : 'Discount Amount (₹) *'}
              type="number"
              min="1"
              max={discountType === 'percentage' ? 100 : undefined}
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminInput
              label="Minimum Subtotal (₹)"
              type="number"
              min="0"
              value={minOrder}
              onChange={(e) => setMinOrder(parseFloat(e.target.value) || 0)}
              hint="Minimum cart subtotal required to qualify."
              disabled={isSubmitting}
            />

            <AdminInput
              label="Max Discount Cap (₹ Optional)"
              type="number"
              min="0"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              placeholder="e.g. 500"
              hint="Maximum ₹ deductible for percentage coupons."
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AdminInput
              label="Start Date *"
              type="date"
              value={startDateStr}
              onChange={(e) => setStartDateStr(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <AdminInput
              label="Expiration Date *"
              type="date"
              value={expirationDateStr}
              onChange={(e) => setExpirationDateStr(e.target.value)}
              disabled={isSubmitting}
              required
            />

            <AdminInput
              label="Usage Cap Limit"
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(parseInt(e.target.value, 10) || 1)}
              hint="Total global redemptions allowed."
              disabled={isSubmitting}
            />
          </div>

          <AdminInput
            label="Campaign Note"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Autumn seasonal harvest promo"
            hint="Internal administrative campaign reference."
            disabled={isSubmitting}
          />
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(couponToDelete)}
        onClose={() => {
          if (!isDeleting) setReviewToDelete(null);
        }}
        title="Delete Promotional Coupon"
        subtitle="This action permanently removes the coupon code from Firestore."
        maxWidth="sm"
        footer={
          <>
            <AdminButton
              variant="outline"
              size="md"
              disabled={isDeleting}
              onClick={() => setReviewToDelete(null)}
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="danger"
              size="md"
              isLoading={isDeleting}
              disabled={isDeleting}
              onClick={handleDeleteCoupon}
              icon={<AdminIcons.Trash className="w-4 h-4" />}
            >
              Confirm Delete
            </AdminButton>
          </>
        }
      >
        {couponToDelete && (
          <div className="space-y-3 text-xs text-[#2C241E] py-2">
            <p>
              Are you sure you want to permanently delete coupon{' '}
              <strong className="font-mono text-[#C9892E]">{couponToDelete.code}</strong>?
            </p>
            <div className="p-3 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl font-mono text-xs space-y-1">
              <div>Discount: {couponToDelete.discountType === 'percentage' ? `${couponToDelete.discountValue}%` : `₹${couponToDelete.discountValue}`}</div>
              <div>Min Order: ₹{couponToDelete.minimumOrderAmount || 0}</div>
              <div>Redemptions: {couponToDelete.usageCount || 0} used</div>
            </div>
            <p className="text-[#991B1B] text-[11px] font-medium">
              ⚠ Customers will immediately no longer be able to apply this coupon code.
            </p>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ReviewDocument, ReviewStatus } from '../../types/admin';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  AdminCard,
  AdminButton,
  AdminInput,
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

export const AdminReviewsPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ReviewStatus>('ALL');

  // Review Operations State
  const [operatingReviewId, setOperatingReviewId] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      const reviewsQuery = query(collection(db, 'reviews'));
      unsubscribe = onSnapshot(
        reviewsQuery,
        (snapshot) => {
          clearTimeout(safetyTimeout);
          if (!isMountedRef.current) return;

          const loaded = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as ReviewDocument)
          );

          // Client-side sort by createdAt desc
          loaded.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));

          setReviews(loaded);
          setLoading(false);
          setError(null);
        },
        (err) => {
          clearTimeout(safetyTimeout);
          console.warn('[AdminReviewsPage] Snapshot listener notice:', err.message);
          if (!isMountedRef.current) return;
          setError(err.message || 'Failed to sync live reviews from Firestore.');
          setLoading(false);
        }
      );
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to initialize reviews query.');
        setLoading(false);
      }
    }

    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const handleModerate = async (review: ReviewDocument, newStatus: ReviewStatus) => {
    if (operatingReviewId) return;
    setOperatingReviewId(review.id);

    try {
      await updateDoc(doc(db, 'reviews', review.id), {
        status: newStatus,
        moderatedAt: serverTimestamp(),
        moderatedBy: adminUser?.email || 'admin',
      });
      showToast(`Review from "${review.authorName}" marked as ${newStatus.toUpperCase()}.`);
    } catch (err: any) {
      console.error('[AdminReviewsPage] Moderate failed:', err);
      showToast(err.message || 'Failed to update review status.', true);
    } finally {
      setOperatingReviewId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete || isDeleting) return;
    setIsDeleting(true);

    try {
      await deleteDoc(doc(db, 'reviews', reviewToDelete.id));
      showToast(`Review by "${reviewToDelete.authorName}" deleted successfully.`);
      setReviewToDelete(null);
    } catch (err: any) {
      console.error('[AdminReviewsPage] Delete failed:', err);
      showToast(err.message || 'Failed to delete review.', true);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const queryLower = searchQuery.toLowerCase().trim();
    const author = (r.authorName || '').toLowerCase();
    const location = (r.authorLocation || '').toLowerCase();
    const product = (r.productName || '').toLowerCase();
    const title = (r.title || '').toLowerCase();
    const quote = (r.quote || '').toLowerCase();

    const matchesSearch =
      queryLower === '' ||
      author.includes(queryLower) ||
      location.includes(queryLower) ||
      product.includes(queryLower) ||
      title.includes(queryLower) ||
      quote.includes(queryLower);

    const matchesStatus =
      statusFilter === 'ALL' || r.status === statusFilter;

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
        breadcrumb="Customers / Reviews"
        title="Review Moderation"
        description="Customer honey ratings and testimonials submitted on your storefront. Inspect verified purchase badges and approve for public display."
        actions={
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-white border border-[#EBE6DD] text-[#73665C]">
            Total Reviews: <strong>{reviews.length}</strong>
          </span>
        }
      />

      {/* Filter & Search Bar */}
      <AdminCard padding="sm" className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search author, product, feedback..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-mono">
          {(['ALL', 'pending', 'approved', 'rejected'] as const).map((status) => (
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
              {status === 'ALL' ? 'All Reviews' : status}
            </button>
          ))}
        </div>
      </AdminCard>

      {/* Loading */}
      {loading && <AdminLoadingState message="Loading review queue from Firestore..." />}

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
      {!loading && !error && reviews.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.Reviews className="w-7 h-7 text-[#C9892E]" />}
          title="No Reviews Yet"
          description="Customer testimonials and ratings submitted for your pure honey varieties will appear here for administrative moderation."
        />
      )}

      {/* Table */}
      {!loading && !error && reviews.length > 0 && (
        <>
          {filteredReviews.length === 0 ? (
            <AdminCard className="text-center py-10 text-xs text-[#73665C]">
              No reviews found matching the search or "{statusFilter}" status filter.
            </AdminCard>
          ) : (
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
                <AdminTableHeaderCell>Rating</AdminTableHeaderCell>
                <AdminTableHeaderCell>Product</AdminTableHeaderCell>
                <AdminTableHeaderCell>Review Content</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell>Date</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableHead>

              <AdminTableBody>
                {filteredReviews.map((r) => {
                  const isBusy = operatingReviewId === r.id;

                  return (
                    <AdminTableRow key={r.id}>
                      <AdminTableCell>
                        <div className="space-y-0.5">
                          <span className="font-semibold text-xs text-[#2C241E] block">
                            {r.authorName}
                          </span>
                          <span className="font-mono text-[10.5px] text-[#8C8075] block">
                            {r.authorLocation || 'Tamil Nadu'}
                            {r.verifiedPurchase && ' • Verified Buyer'}
                          </span>
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <div className="flex items-center text-[#C9892E] text-xs">
                          {'★'.repeat(r.rating || 5)}
                          {'☆'.repeat(Math.max(0, 5 - (r.rating || 5)))}
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-xs text-[#5A4F46]">
                          {r.productName || 'Himalayan Honey'}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <div className="max-w-xs space-y-0.5">
                          {r.title && (
                            <span className="font-semibold text-xs text-[#2C241E] block truncate">
                              {r.title}
                            </span>
                          )}
                          <p className="text-xs text-[#73665C] line-clamp-2">
                            "{r.quote}"
                          </p>
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminStatusBadge status={r.status} size="sm" />
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-[11px] text-[#73665C]">
                          {formatDate(r.createdAt)}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell align="right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== 'approved' && (
                            <AdminButton
                              variant="secondary"
                              size="sm"
                              disabled={isBusy}
                              isLoading={isBusy}
                              onClick={() => handleModerate(r, 'approved')}
                            >
                              Approve
                            </AdminButton>
                          )}
                          {r.status !== 'rejected' && (
                            <AdminButton
                              variant="outline"
                              size="sm"
                              disabled={isBusy}
                              isLoading={isBusy}
                              onClick={() => handleModerate(r, 'rejected')}
                            >
                              Reject
                            </AdminButton>
                          )}
                          <AdminButton
                            variant="danger"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => setReviewToDelete(r)}
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

      {/* Confirmation Modal for Delete Review */}
      <AdminModal
        isOpen={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        title="Delete Customer Review"
        subtitle="This action permanently removes the review from Firestore."
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
              onClick={handleConfirmDelete}
              icon={<AdminIcons.Trash className="w-4 h-4" />}
            >
              Confirm Delete
            </AdminButton>
          </>
        }
      >
        {reviewToDelete && (
          <div className="space-y-3 text-xs text-[#2C241E] py-2">
            <p>
              Are you sure you want to delete the review by <strong>{reviewToDelete.authorName}</strong>?
            </p>
            <div className="p-3 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl space-y-1">
              <span className="font-semibold text-[#2C241E] block">
                {reviewToDelete.title || 'Customer Review'}
              </span>
              <p className="text-[#73665C] italic">
                "{reviewToDelete.quote}"
              </p>
            </div>
            <p className="text-[#991B1B] text-[11px] font-medium">
              ⚠ This operation is permanent and cannot be undone.
            </p>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

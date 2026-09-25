import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { ReviewDocument } from '../types/admin';
import { CustomerAvatar } from './CustomerAvatar';

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
}

// Star rating component (interactive for form, static for display)
const StarRating: React.FC<{
  rating: number;
  onRate?: (star: number) => void;
  size?: number;
  interactive?: boolean;
}> = ({ rating, onRate, size = 18, interactive = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hovered || rating) : star <= rating;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={filled ? '#DDAA55' : '#D9D7D0'}
              width={size}
              height={size}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

// Star breakdown bar
const StarBreakdownBar: React.FC<{
  star: number;
  count: number;
  total: number;
}> = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <span className="font-mono text-[12px] text-[#686863] w-6 text-right shrink-0">
        {star}★
      </span>
      <div className="flex-1 h-2 rounded-full bg-[#D9D7D0]/60 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#DDAA55] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[12px] text-[#686863] w-6 shrink-0">
        {count}
      </span>
    </div>
  );
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { user, userProfile } = useAuth();
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [purchaseCheckDone, setPurchaseCheckDone] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState('');
  const [formReview, setFormReview] = useState('');
  const [formMediaUrl, setFormMediaUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch approved reviews for this product
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe = () => {};

    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        where('status', '==', 'approved')
      );

      unsubscribe = onSnapshot(
        reviewsQuery,
        (snapshot) => {
          if (!isMountedRef.current) return;
          const loaded = snapshot.docs.map(
            (d) => ({ id: d.id, ...d.data() } as ReviewDocument)
          );
          // Sort by createdAt desc
          loaded.sort((a, b) => {
            const tsA = a.createdAt
              ? typeof (a.createdAt as any).toMillis === 'function'
                ? (a.createdAt as any).toMillis()
                : new Date(a.createdAt as any).getTime()
              : 0;
            const tsB = b.createdAt
              ? typeof (b.createdAt as any).toMillis === 'function'
                ? (b.createdAt as any).toMillis()
                : new Date(b.createdAt as any).getTime()
              : 0;
            return tsB - tsA;
          });
          setReviews(loaded);
          setLoading(false);
        },
        (err) => {
          console.warn('[ProductReviewsSection] Snapshot error:', err.message);
          if (isMountedRef.current) setLoading(false);
        }
      );
    } catch {
      if (isMountedRef.current) setLoading(false);
    }

    return () => unsubscribe();
  }, [productId]);

  // Check if logged-in user has purchased this product (by checking orders)
  useEffect(() => {
    if (!user?.uid || !productId) {
      setPurchaseCheckDone(true);
      return;
    }

    const checkPurchase = async () => {
      try {
        // Query orders for this user
        const ordersQuery = query(
          collection(db, 'orders'),
          where('customer.uid', '==', user.uid),
          where('paymentStatus', '==', 'paid')
        );
        const snapshot = await getDocs(ordersQuery);

        let purchased = false;
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach((item: any) => {
              if (item.productId === productId) {
                purchased = true;
              }
            });
          }
        });

        if (isMountedRef.current) {
          setHasPurchased(purchased);
          setPurchaseCheckDone(true);
        }
      } catch (err) {
        console.warn('[ProductReviewsSection] Purchase check error:', err);
        if (isMountedRef.current) setPurchaseCheckDone(true);
      }
    };

    checkPurchase();
  }, [user?.uid, productId]);

  // Check if user already submitted a review for this product (including pending)
  useEffect(() => {
    if (!user?.uid || !productId) return;

    const checkExisting = async () => {
      try {
        const existingQuery = query(
          collection(db, 'reviews'),
          where('productId', '==', productId),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(existingQuery);
        if (isMountedRef.current) {
          setHasReviewed(!snapshot.empty);
        }
      } catch (err) {
        console.warn('[ProductReviewsSection] Existing review check error:', err);
      }
    };

    checkExisting();
  }, [user?.uid, productId]);

  // Compute stats
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return { avg: 0, count: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    reviews.forEach((r) => {
      const s = Math.max(1, Math.min(5, Math.round(r.rating || 5)));
      breakdown[s] = (breakdown[s] || 0) + 1;
      sum += s;
    });
    return {
      avg: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
      breakdown,
    };
  }, [reviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !user) return;

    if (formRating === 0) {
      setSubmitError('Please select a star rating.');
      return;
    }
    if (!formReview.trim()) {
      setSubmitError('Please write your review.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const reviewData: Record<string, any> = {
        userId: user.uid,
        productId,
        productName,
        authorName:
          userProfile?.name?.trim() ||
          user.displayName?.trim() ||
          user.email?.split('@')[0] ||
          'Valued Customer',
        authorLocation: '',
        rating: formRating,
        title: formTitle.trim(),
        quote: formReview.trim(),
        status: 'pending',
        verifiedPurchase: hasPurchased,
        createdAt: serverTimestamp(),
      };

      // Add media URLs if provided
      if (formMediaUrl.trim()) {
        reviewData.mediaUrls = [formMediaUrl.trim()];
      }

      await addDoc(collection(db, 'reviews'), reviewData);

      if (isMountedRef.current) {
        setSubmitSuccess(true);
        setShowForm(false);
        setFormRating(0);
        setFormTitle('');
        setFormReview('');
        setFormMediaUrl('');
        setHasReviewed(true);
      }
    } catch (err: any) {
      console.error('[ProductReviewsSection] Submit error:', err);
      if (isMountedRef.current) {
        setSubmitError(
          err?.message?.includes('PERMISSION_DENIED')
            ? 'You must be logged in and have purchased this product to submit a review.'
            : err?.message || 'Failed to submit review. Please try again.'
        );
      }
    } finally {
      if (isMountedRef.current) setSubmitting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    try {
      const ms =
        typeof timestamp.toMillis === 'function'
          ? timestamp.toMillis()
          : typeof timestamp.seconds === 'number'
          ? timestamp.seconds * 1000
          : new Date(timestamp).getTime();
      if (isNaN(ms)) return '';
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(ms));
    } catch {
      return '';
    }
  };

  return (
    <section className="bg-[#FAF9F5] border border-[#D9D7D0] rounded-[24px] p-6 sm:p-8 md:p-10 mb-16 shadow-[0_4px_24px_rgba(36,36,36,0.03)]">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-3 h-[1.5px] bg-[#C9892E]" />
        <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#C9892E] font-semibold">
          CUSTOMER REVIEWS
        </span>
      </div>
      <h2 className="font-serif text-[22px] sm:text-[26px] font-semibold text-[#242424] mb-6">
        What Our Customers Say
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-[#C9892E] border-t-transparent animate-spin" />
          <span className="ml-3 font-mono text-[12px] text-[#686863]">
            Loading reviews...
          </span>
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8 pb-8 border-b border-[#D9D7D0]">
            {/* Left: Average Score */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-[18px] bg-[#F4F1EA]/80 border border-[#D9D7D0]/60">
              <span className="font-serif text-[48px] sm:text-[56px] font-bold text-[#242424] leading-none">
                {stats.count > 0 ? stats.avg.toFixed(1) : '—'}
              </span>
              <div className="mt-2 mb-1.5">
                <StarRating rating={Math.round(stats.avg)} size={20} />
              </div>
              <span className="font-mono text-[12px] text-[#686863] uppercase tracking-wider">
                {stats.count} {stats.count === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>

            {/* Right: Star Breakdown */}
            <div className="md:col-span-8 flex flex-col justify-center space-y-2 px-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <StarBreakdownBar
                  key={star}
                  star={star}
                  count={stats.breakdown[star] || 0}
                  total={stats.count}
                />
              ))}
            </div>
          </div>

          {/* Write Review Section */}
          {user && purchaseCheckDone && (
            <div className="mb-8">
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-sans text-[13px] mb-4 flex items-center gap-2"
                >
                  <span className="text-lg">✓</span>
                  <span>
                    Thank you for your review! It will appear here once our team approves it.
                  </span>
                </motion.div>
              )}

              {!hasReviewed && !submitSuccess ? (
                <>
                  {!hasPurchased ? (
                    <div className="p-4 rounded-[14px] bg-[#F4F1EA] border border-[#D9D7D0] font-sans text-[13px] text-[#686863]">
                      <span className="font-semibold text-[#242424]">
                        Purchase required:
                      </span>{' '}
                      Only customers who have purchased this product can write a
                      review.
                    </div>
                  ) : !showForm ? (
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 rounded-full bg-[#242424] hover:bg-[#383838] text-[#FAF9F5] font-sans text-[14px] font-bold transition-colors cursor-pointer"
                    >
                      Write a Review
                    </button>
                  ) : (
                    <AnimatePresence>
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmitReview}
                        className="p-5 sm:p-6 rounded-[18px] bg-white border border-[#D9D7D0] space-y-4 overflow-hidden"
                      >
                        <h3 className="font-serif text-[18px] font-semibold text-[#242424]">
                          Share Your Experience
                        </h3>

                        {/* Rating */}
                        <div>
                          <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                            Your Rating *
                          </label>
                          <StarRating
                            rating={formRating}
                            onRate={setFormRating}
                            size={28}
                            interactive
                          />
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                            Review Title
                          </label>
                          <input
                            type="text"
                            value={formTitle}
                            onChange={(e) => setFormTitle(e.target.value)}
                            placeholder="Sum up your experience in a few words"
                            maxLength={120}
                            className="w-full px-4 py-3 rounded-[12px] bg-[#FAF9F5] border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                          />
                        </div>

                        {/* Review */}
                        <div>
                          <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                            Your Review *
                          </label>
                          <textarea
                            value={formReview}
                            onChange={(e) => setFormReview(e.target.value)}
                            placeholder="Tell others about your experience with this honey..."
                            rows={4}
                            maxLength={1000}
                            className="w-full px-4 py-3 rounded-[12px] bg-[#FAF9F5] border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors resize-none"
                          />
                        </div>

                        {/* Photo/Video URL */}
                        <div>
                          <label className="block text-[12px] font-mono uppercase tracking-wider text-[#686863] mb-1.5 font-medium">
                            Photo / Video URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={formMediaUrl}
                            onChange={(e) => setFormMediaUrl(e.target.value)}
                            placeholder="https://example.com/your-photo.jpg"
                            className="w-full px-4 py-3 rounded-[12px] bg-[#FAF9F5] border border-[#D9D7D0] text-[#242424] font-sans text-[14px] outline-none focus:border-[#C9892E] transition-colors"
                          />
                          <p className="mt-1 text-[11px] font-sans text-[#686863]">
                            Paste a link to a photo or video of the product
                          </p>
                        </div>

                        {/* Error */}
                        {submitError && (
                          <p className="text-[13px] text-rose-600 font-sans">
                            {submitError}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-full bg-[#C9892E] hover:bg-[#DDAA55] text-[#242424] font-sans text-[14px] font-bold transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                          >
                            {submitting && (
                              <div className="w-4 h-4 border-2 border-[#242424] border-t-transparent rounded-full animate-spin" />
                            )}
                            {submitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForm(false);
                              setSubmitError(null);
                            }}
                            className="px-5 py-2.5 rounded-full border border-[#D9D7D0] hover:border-[#242424] text-[#242424] font-sans text-[13px] font-semibold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    </AnimatePresence>
                  )}
                </>
              ) : (
                !submitSuccess &&
                hasReviewed && (
                  <div className="p-4 rounded-[14px] bg-[#F4F1EA] border border-[#D9D7D0] font-sans text-[13px] text-[#686863]">
                    <span className="font-semibold text-[#242424]">
                      Review submitted:
                    </span>{' '}
                    You have already submitted a review for this product. It may be
                    pending moderation.
                  </div>
                )
              )}
            </div>
          )}

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-sans text-[15px] text-[#686863]">
                No reviews yet for this product. Be the first to share your
                experience!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-5 sm:p-6 rounded-[18px] bg-white border border-[#D9D7D0] hover:border-[#C9892E]/40 transition-colors"
                >
                  {/* Header: Avatar + Name + Date */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <CustomerAvatar
                        name={review.authorName}
                        size={40}
                      />
                      <div>
                        <h4 className="font-sans text-[14px] font-bold text-[#242424] leading-tight">
                          {review.authorName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          {review.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-3 h-3"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified Purchase
                            </span>
                          )}
                          {review.authorLocation && (
                            <span className="font-mono text-[11px] text-[#686863]">
                              {review.authorLocation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#686863] shrink-0">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  {/* Stars + Title */}
                  <div className="mb-2">
                    <StarRating rating={review.rating || 5} size={16} />
                  </div>
                  {review.title && (
                    <h5 className="font-sans text-[15px] font-semibold text-[#242424] mb-1.5">
                      {review.title}
                    </h5>
                  )}

                  {/* Review body */}
                  <p className="font-sans text-[14px] text-[#242424]/85 leading-[1.6]">
                    {review.quote}
                  </p>

                  {/* Media */}
                  {(review as any).mediaUrls &&
                    Array.isArray((review as any).mediaUrls) &&
                    (review as any).mediaUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(review as any).mediaUrls.map(
                          (url: string, idx: number) => {
                            const isVideo =
                              /\.(mp4|webm|mov)(\?|$)/i.test(url);
                            return isVideo ? (
                              <video
                                key={idx}
                                src={url}
                                controls
                                className="w-24 h-24 rounded-[10px] object-cover border border-[#D9D7D0]"
                              />
                            ) : (
                              <img
                                key={idx}
                                src={url}
                                alt={`Review media ${idx + 1}`}
                                className="w-24 h-24 rounded-[10px] object-cover border border-[#D9D7D0]"
                              />
                            );
                          }
                        )}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

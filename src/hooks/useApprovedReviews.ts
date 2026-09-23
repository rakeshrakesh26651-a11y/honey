import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TESTIMONIALS, Testimonial } from '../data/himalayanHarvest';
import { ReviewDocument } from '../types/admin';

export function useApprovedReviews() {
  const [reviews, setReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      // Query only approved reviews for public storefront display
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('status', '==', 'approved')
      );

      unsubscribe = onSnapshot(
        reviewsQuery,
        (snapshot) => {
          if (!snapshot.empty) {
            const liveReviews: Testimonial[] = snapshot.docs.map((docSnap) => {
              const data = docSnap.data() as ReviewDocument;
              return {
                id: docSnap.id,
                author: data.authorName || 'Valued Customer',
                quote: data.quote || data.title || '',
                role: data.verifiedPurchase ? 'VERIFIED BUYER' : 'CUSTOMER REVIEW',
                location: data.authorLocation || 'Tamil Nadu',
              };
            });

            // Combine live approved reviews ahead of baseline testimonials
            setReviews([...liveReviews, ...TESTIMONIALS]);
          } else {
            setReviews(TESTIMONIALS);
          }
          setLoading(false);
        },
        (err) => {
          console.warn('[useApprovedReviews] Falling back to baseline testimonials:', err.message);
          setReviews(TESTIMONIALS);
          setLoading(false);
        }
      );
    } catch {
      setReviews(TESTIMONIALS);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  return { reviews, loading };
}

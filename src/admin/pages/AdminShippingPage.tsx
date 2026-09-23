import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminPageHeader,
  AdminLoadingState,
  AdminIcons,
} from '../components/ui';

export const AdminShippingPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Shipping Rules State with standard production defaults
  const [freeThreshold, setFreeThreshold] = useState<number>(1000);
  const [tamilNaduFee, setTamilNaduFee] = useState<number>(50);
  const [nationalFee, setNationalFee] = useState<number>(100);
  const [deliveryTN, setDeliveryTN] = useState<string>('1–2 Business Days');
  const [deliveryNational, setDeliveryNational] = useState<string>('3–5 Business Days');

  const isMountedRef = useRef(true);

  const showToast = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      if (isMountedRef.current) setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);

    const safetyTimeout = setTimeout(() => {
      if (isMountedRef.current && loading) {
        setLoading(false);
      }
    }, 4000);

    const docRef = doc(db, 'settings', 'shipping');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        clearTimeout(safetyTimeout);
        if (!isMountedRef.current) return;

        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.freeShippingThreshold === 'number') setFreeThreshold(data.freeShippingThreshold);
          if (typeof data.tamilNaduFee === 'number') setTamilNaduFee(data.tamilNaduFee);
          if (typeof data.otherStatesFee === 'number') setNationalFee(data.otherStatesFee);
          if (data.estimatedDeliveryTN) setDeliveryTN(data.estimatedDeliveryTN);
          if (data.estimatedDeliveryNational) setDeliveryNational(data.estimatedDeliveryNational);
        }
        setLoading(false);
      },
      (err) => {
        clearTimeout(safetyTimeout);
        console.warn('[AdminShippingPage] Settings read notice:', err.message);
        if (isMountedRef.current) setLoading(false);
      }
    );

    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (isNaN(freeThreshold) || freeThreshold < 0) {
      setFormError('Free shipping cart threshold must be a non-negative number (₹0 or greater).');
      return;
    }

    if (isNaN(tamilNaduFee) || tamilNaduFee < 0) {
      setFormError('Tamil Nadu delivery charge must be a non-negative number (₹0 or greater).');
      return;
    }

    if (isNaN(nationalFee) || nationalFee < 0) {
      setFormError('Rest of India delivery charge must be a non-negative number (₹0 or greater).');
      return;
    }

    if (!deliveryTN.trim()) {
      setFormError('Please enter an estimated delivery timeline for Tamil Nadu.');
      return;
    }

    if (!deliveryNational.trim()) {
      setFormError('Please enter an estimated delivery timeline for Rest of India.');
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(
        doc(db, 'settings', 'shipping'),
        {
          id: 'shipping',
          freeShippingThreshold: Number(freeThreshold),
          tamilNaduFee: Number(tamilNaduFee),
          otherStatesFee: Number(nationalFee),
          estimatedDeliveryTN: deliveryTN.trim(),
          estimatedDeliveryNational: deliveryNational.trim(),
          updatedAt: serverTimestamp(),
          updatedBy: adminUser?.email || 'admin',
        },
        { merge: true }
      );
      showToast('Centralized shipping settings updated successfully in Firestore.');
    } catch (err: any) {
      console.error('[AdminShippingPage] Save failed:', err);
      showToast(err.message || 'Failed to save shipping settings.', true);
    } finally {
      setIsSaving(false);
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
        breadcrumb="Operations / Shipping"
        title="Shipping & Delivery Rates"
        description="Configure standard courier rates across Tamil Nadu and National delivery, free-shipping order threshold, and courier partner dispatch timelines."
        actions={
          <AdminButton
            variant="primary"
            size="md"
            isLoading={isSaving}
            disabled={isSaving}
            onClick={handleSave}
            icon={<AdminIcons.Check className="w-4 h-4" />}
          >
            Save Rules
          </AdminButton>
        }
      />

      {loading ? (
        <AdminLoadingState message="Reading shipping configuration..." />
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
          {formError && (
            <div className="p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-xs font-medium">
              ⚠ {formError}
            </div>
          )}

          {/* Free Shipping Tier */}
          <AdminCard padding="lg" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF3E8] border border-[#F0DFC4] flex items-center justify-center text-[#C9892E]">
                <AdminIcons.Shipping className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-[#2C241E]">
                  Free Delivery Threshold
                </h3>
                <p className="text-xs text-[#73665C]">
                  Orders exceeding this subtotal automatically qualify for 100% complimentary delivery across India.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <AdminInput
                label="Free Shipping Cart Subtotal (₹) *"
                type="number"
                min="0"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(parseFloat(e.target.value) || 0)}
                hint="Default is ₹1,000 for Himalayan Harvest Honey."
                disabled={isSaving}
                required
              />
            </div>
          </AdminCard>

          {/* Regional Rate Tiers */}
          <AdminCard padding="lg" className="space-y-4">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#2C241E]">
                Courier Rate Matrix
              </h3>
              <p className="text-xs text-[#73665C] mt-0.5">
                Standard delivery charges applied when cart subtotal is under the free delivery threshold.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#2C241E]">
                    Tamil Nadu (Intra-State)
                  </span>
                  <span className="font-mono text-xs text-[#C9892E] font-bold">₹{tamilNaduFee}</span>
                </div>
                <AdminInput
                  label="Delivery Charge (₹) *"
                  type="number"
                  min="0"
                  value={tamilNaduFee}
                  onChange={(e) => setTamilNaduFee(parseFloat(e.target.value) || 0)}
                  disabled={isSaving}
                  required
                />
                <AdminInput
                  label="Dispatch & Delivery Timeline *"
                  value={deliveryTN}
                  onChange={(e) => setDeliveryTN(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-[#2C241E]">
                    Rest of India (National)
                  </span>
                  <span className="font-mono text-xs text-[#C9892E] font-bold">₹{nationalFee}</span>
                </div>
                <AdminInput
                  label="Delivery Charge (₹) *"
                  type="number"
                  min="0"
                  value={nationalFee}
                  onChange={(e) => setNationalFee(parseFloat(e.target.value) || 0)}
                  disabled={isSaving}
                  required
                />
                <AdminInput
                  label="Dispatch & Delivery Timeline *"
                  value={deliveryNational}
                  onChange={(e) => setDeliveryNational(e.target.value)}
                  disabled={isSaving}
                  required
                />
              </div>
            </div>
          </AdminCard>

          {/* Courier Logistics Note */}
          <AdminCard padding="md" className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block">
              Integrated Logistics Partners
            </span>
            <p className="text-xs text-[#73665C] leading-relaxed">
              Glass jar parcels are cushioned in corrugated safety sleeves and dispatched via <strong>ST Courier</strong>, <strong>Professional Couriers</strong>, <strong>India Post</strong>, or <strong>Delhivery</strong>.
            </p>
          </AdminCard>
        </form>
      )}
    </div>
  );
};

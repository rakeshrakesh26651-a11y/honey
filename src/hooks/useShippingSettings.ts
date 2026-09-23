import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ShippingSettings {
  freeShippingThreshold: number;
  tamilNaduFee: number;
  otherStatesFee: number;
  estimatedDeliveryTN: string;
  estimatedDeliveryNational: string;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  freeShippingThreshold: 1000,
  tamilNaduFee: 50,
  otherStatesFee: 100,
  estimatedDeliveryTN: '1–2 Business Days',
  estimatedDeliveryNational: '3–5 Business Days',
};

export function isTamilNaduState(stateName?: string): boolean {
  if (!stateName) return false;
  const normalized = stateName.trim().toLowerCase().replace(/[^a-z]/g, '');
  return normalized === 'tamilnadu' || normalized === 'tn';
}

export function useShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const docRef = doc(db, 'settings', 'shipping');
      unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setSettings({
              freeShippingThreshold:
                typeof data.freeShippingThreshold === 'number'
                  ? data.freeShippingThreshold
                  : DEFAULT_SHIPPING_SETTINGS.freeShippingThreshold,
              tamilNaduFee:
                typeof data.tamilNaduFee === 'number'
                  ? data.tamilNaduFee
                  : DEFAULT_SHIPPING_SETTINGS.tamilNaduFee,
              otherStatesFee:
                typeof data.otherStatesFee === 'number'
                  ? data.otherStatesFee
                  : DEFAULT_SHIPPING_SETTINGS.otherStatesFee,
              estimatedDeliveryTN:
                data.estimatedDeliveryTN || DEFAULT_SHIPPING_SETTINGS.estimatedDeliveryTN,
              estimatedDeliveryNational:
                data.estimatedDeliveryNational || DEFAULT_SHIPPING_SETTINGS.estimatedDeliveryNational,
            });
          }
          setLoading(false);
        },
        (err) => {
          console.warn('[useShippingSettings] Using default shipping constants:', err.message);
          setLoading(false);
        }
      );
    } catch {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const calculateShippingFee = (subtotal: number, stateName?: string): number => {
    if (subtotal >= settings.freeShippingThreshold) {
      return 0;
    }
    return isTamilNaduState(stateName) ? settings.tamilNaduFee : settings.otherStatesFee;
  };

  return {
    settings,
    loading,
    calculateShippingFee,
    isTamilNaduState,
  };
}

import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
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

export const AdminSettingsPage: React.FC = () => {
  const { adminUser } = useAdminAuth();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Grouped Settings State
  const [brandName, setBrandName] = useState('Himalayan Harvest Honey');
  const [contactPhone, setContactPhone] = useState('+91 98400 12345');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98400 12345');
  const [supportEmail, setSupportEmail] = useState('care@himalayanharvest.com');
  const [instagramHandle, setInstagramHandle] = useState('@himalayanharvesthoney');
  const [announcementText, setAnnouncementText] = useState('Pure Raw Wild Honey Harvested Sustainably — Express Courier Delivery Across India');
  const [isStoreOnline, setIsStoreOnline] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'general'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.brandName) setBrandName(d.brandName);
          if (d.contactPhone) setContactPhone(d.contactPhone);
          if (d.whatsappNumber) setWhatsappNumber(d.whatsappNumber);
          if (d.supportEmail) setSupportEmail(d.supportEmail);
          if (d.instagramHandle) setInstagramHandle(d.instagramHandle);
          if (d.announcementText) setAnnouncementText(d.announcementText);
          if (typeof d.isStoreOnline === 'boolean') setIsStoreOnline(d.isStoreOnline);
        }
      } catch (err: any) {
        console.warn('[AdminSettingsPage] General settings fetch notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(
        doc(db, 'settings', 'general'),
        {
          id: 'general',
          brandName,
          contactPhone,
          whatsappNumber,
          supportEmail,
          instagramHandle,
          announcementText,
          isStoreOnline,
          updatedAt: serverTimestamp(),
          updatedBy: adminUser?.email || 'admin',
        },
        { merge: true }
      );
      setNotification('Store settings saved successfully.');
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      setNotification(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-4 rounded-xl border bg-[#F0FDF4] border-[#DCFCE7] text-[#166534] text-xs sm:text-sm shadow-md animate-in fade-in">
          {notification}
        </div>
      )}

      <AdminPageHeader
        breadcrumb="Settings / General"
        title="Store Settings"
        description="Configure master brand identity, customer care channels, announcement tickers, and emergency maintenance controls."
        actions={
          <AdminButton
            variant="primary"
            size="md"
            isLoading={isSaving}
            onClick={handleSave}
            icon={<AdminIcons.Check className="w-4 h-4" />}
          >
            Save Settings
          </AdminButton>
        }
      />

      {loading ? (
        <AdminLoadingState message="Loading store configuration..." />
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
          {/* General Identity */}
          <AdminCard padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE6DD]">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#2C241E]">
                  Store Identity & Availability
                </h3>
                <p className="text-xs text-[#73665C]">
                  Configure store operating status and customer announcement banner.
                </p>
              </div>

              {/* Maintenance Toggle */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-medium text-[#2C241E]">
                  Store Online:
                </span>
                <button
                  type="button"
                  onClick={() => setIsStoreOnline(!isStoreOnline)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    isStoreOnline ? 'bg-[#166534]' : 'bg-[#D5CBBC]'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${
                      isStoreOnline ? 'right-[3px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="Brand Trademark"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
              <AdminInput
                label="Instagram Handle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
              />
            </div>

            <AdminInput
              label="Storefront Announcement Bar Ticker"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              hint="Shown at the top of the customer-facing storefront."
            />
          </AdminCard>

          {/* Customer Care & Channels */}
          <AdminCard padding="lg" className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#2C241E] pb-2 border-b border-[#EBE6DD]">
              Customer Communication Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AdminInput
                label="WhatsApp Customer Care Desk"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                hint="Used for customer order dispatch messages and inquiries."
              />
              <AdminInput
                label="Support Email Address"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <AdminInput
              label="Official Contact Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
          </AdminCard>

          {/* Payments & Security Configuration (No secrets exposed) */}
          <AdminCard padding="lg" className="space-y-4">
            <h3 className="font-serif text-base font-semibold text-[#2C241E] pb-2 border-b border-[#EBE6DD]">
              Payment Gateway Security & Compliance
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8C8075] font-semibold block">
                  Payment Gateway
                </span>
                <span className="font-semibold text-sm text-[#2C241E] block">
                  Razorpay India (UPI, Cards, NetBanking)
                </span>
                <span className="font-mono text-[11px] text-[#166534] block">
                  ● Webhook Verification Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8C8075] font-semibold block">
                  Security Guard
                </span>
                <span className="font-semibold text-sm text-[#2C241E] block">
                  Firebase Locked Custom Claims RBAC v2
                </span>
                <span className="font-mono text-[11px] text-[#8C8075] block">
                  Private API secrets isolated on secure backend
                </span>
              </div>
            </div>
          </AdminCard>
        </form>
      )}
    </div>
  );
};

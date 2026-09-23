import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CustomerDocument } from '../../types/admin';
import {
  AdminCard,
  AdminInput,
  AdminStatusBadge,
  AdminTable,
  AdminTableHead,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
  AdminTableHeaderCell,
  AdminPageHeader,
  AdminEmptyState,
  AdminLoadingState,
  AdminIcons,
} from '../components/ui';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};
    try {
      const usersQuery = query(collection(db, 'users'), limit(50));
      unsubscribe = onSnapshot(
        usersQuery,
        (snapshot) => {
          const loaded = snapshot.docs.map(
            (doc) => ({ uid: doc.id, ...doc.data() } as CustomerDocument)
          );
          setCustomers(loaded);
          setLoading(false);
        },
        () => {
          setCustomers([]);
          setLoading(false);
        }
      );
    } catch {
      setCustomers([]);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    const name = (c.name || '').toLowerCase();
    const email = (c.email || '').toLowerCase();
    const phone = (c.phone || '').toLowerCase();
    return searchQuery === '' || name.includes(q) || email.includes(q) || phone.includes(q);
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '--';
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
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
      <AdminPageHeader
        breadcrumb="Customers / Directory"
        title="Customer Directory"
        description="Registered customer profiles, shipping destination records, and lifetime store order volumes."
        actions={
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-white border border-[#EBE6DD] text-[#73665C]">
            Live Registered: <strong>{customers.length}</strong>
          </span>
        }
      />

      {/* Search Bar */}
      <AdminCard padding="sm" className="flex items-center justify-between gap-3">
        <div className="w-full md:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>
      </AdminCard>

      {/* Loading */}
      {loading && <AdminLoadingState message="Loading customers from Firestore..." />}

      {/* Empty State */}
      {!loading && customers.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.Customers className="w-7 h-7 text-[#C9892E]" />}
          title="No Customers Yet"
          description="Your customer accounts directory is currently empty. Customer profiles will automatically register here as users sign up or place orders."
        />
      )}

      {/* Table */}
      {!loading && customers.length > 0 && (
        <AdminTable>
          <AdminTableHead>
            <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
            <AdminTableHeaderCell>Email</AdminTableHeaderCell>
            <AdminTableHeaderCell>Phone</AdminTableHeaderCell>
            <AdminTableHeaderCell>Orders</AdminTableHeaderCell>
            <AdminTableHeaderCell>Total Spent</AdminTableHeaderCell>
            <AdminTableHeaderCell>Last Order</AdminTableHeaderCell>
            <AdminTableHeaderCell align="right">Status</AdminTableHeaderCell>
          </AdminTableHead>

          <AdminTableBody>
            {filteredCustomers.map((c) => (
              <AdminTableRow key={c.uid}>
                <AdminTableCell>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#FAF3E8] border border-[#F0DFC4] text-[#9B6418] flex items-center justify-center font-serif text-xs font-bold">
                      {(c.name || c.email || 'CU').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs text-[#2C241E]">
                      {c.name || 'Anonymous Customer'}
                    </span>
                  </div>
                </AdminTableCell>

                <AdminTableCell>
                  <span className="font-mono text-xs text-[#5A4F46]">
                    {c.email || '--'}
                  </span>
                </AdminTableCell>

                <AdminTableCell>
                  <span className="font-mono text-xs text-[#73665C]">
                    {c.phone || '--'}
                  </span>
                </AdminTableCell>

                <AdminTableCell>
                  <span className="font-mono text-xs font-semibold text-[#2C241E]">
                    {c.metrics?.totalOrders ?? 0}
                  </span>
                </AdminTableCell>

                <AdminTableCell>
                  <span className="font-serif text-xs font-semibold text-[#2C241E]">
                    ₹{(c.metrics?.totalSpent ?? 0).toLocaleString('en-IN')}
                  </span>
                </AdminTableCell>

                <AdminTableCell>
                  <span className="font-mono text-[11px] text-[#73665C]">
                    {formatDate(c.metrics?.lastOrderDate)}
                  </span>
                </AdminTableCell>

                <AdminTableCell align="right">
                  <AdminStatusBadge status="Active" size="sm" />
                </AdminTableCell>
              </AdminTableRow>
            ))}
          </AdminTableBody>
        </AdminTable>
      )}
    </div>
  );
};

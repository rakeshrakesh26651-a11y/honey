import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ProductDocument, OrderDocument } from '../../types/admin';
import { subscribeAdminProducts } from '../services/productService';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminCard, AdminButton, AdminStatusBadge, AdminIcons, AdminEmptyState, AdminLoadingState } from '../components/ui';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { adminUser } = useAdminAuth();

  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Time-appropriate greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const adminName = adminUser?.email ? adminUser.email.split('@')[0] : 'Rakesh';
  const capitalizedName = adminName.charAt(0).toUpperCase() + adminName.slice(1);

  // Subscribe to live Firestore collections
  useEffect(() => {
    // 1. Live Products
    const unsubscribeProducts = subscribeAdminProducts(
      (items) => {
        setProducts(items);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    // 2. Live Orders (real collection)
    let unsubscribeOrders = () => {};
    try {
      const ordersQuery = query(collection(db, 'orders'), limit(20));
      unsubscribeOrders = onSnapshot(
        ordersQuery,
        (snapshot) => {
          const loadedOrders = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as OrderDocument)
          );
          setOrders(loadedOrders);
        },
        () => {
          // If orders collection is empty or permission denied, fallback to empty array
          setOrders([]);
        }
      );
    } catch {
      setOrders([]);
    }

    // 3. Live Customers (users collection)
    let unsubscribeUsers = () => {};
    try {
      const usersQuery = query(collection(db, 'users'), limit(100));
      unsubscribeUsers = onSnapshot(
        usersQuery,
        (snapshot) => {
          setCustomerCount(snapshot.size);
        },
        () => {
          setCustomerCount(0);
        }
      );
    } catch {
      setCustomerCount(0);
    }

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeUsers();
    };
  }, []);

  // Compute strictly authentic metrics
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentStatus === 'paid' || order.orderStatus === 'delivered') {
      return sum + (order.pricing?.totalAmount || 0);
    }
    return sum;
  }, 0);

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalVariantsCount = products.reduce(
    (sum, p) => sum + (p.variants?.length || 0),
    0
  );

  // Low stock products (any variant with <= 20 units)
  const lowStockItems = products.flatMap((p) =>
    (p.variants || [])
      .filter((v) => (v.stock ?? 0) <= 20)
      .map((v) => ({
        productId: p.id,
        productName: p.name,
        variantSize: v.size || v.weight,
        stock: v.stock ?? 0,
        sku: v.sku,
      }))
  );

  const kpiCards = [
    {
      label: 'REVENUE',
      value: totalRevenue > 0 ? `₹${totalRevenue.toLocaleString('en-IN')}` : '₹0',
      subtext: totalRevenue > 0 ? `From ${orders.filter(o => o.paymentStatus === 'paid').length} paid order(s)` : 'No revenue recorded yet',
      trend: orders.length > 0 ? 'Live from Orders' : 'Real-time Firestore',
      icon: <AdminIcons.Orders className="w-5 h-5 text-[#C9892E]" />,
    },
    {
      label: 'ORDERS',
      value: totalOrdersCount.toString(),
      subtext: totalOrdersCount > 0 ? `${orders.filter(o => o.orderStatus === 'placed').length} awaiting fulfillment` : 'No orders placed yet',
      trend: totalOrdersCount > 0 ? 'Live database' : 'Real-time Firestore',
      icon: <AdminIcons.Orders className="w-5 h-5 text-[#C9892E]" />,
    },
    {
      label: 'PRODUCTS',
      value: totalProductsCount.toString(),
      subtext: `${totalVariantsCount} total SKU variants`,
      trend: `${products.filter(p => p.active ?? p.available ?? true).length} active online`,
      icon: <AdminIcons.Products className="w-5 h-5 text-[#C9892E]" />,
    },
    {
      label: 'CUSTOMERS',
      value: customerCount !== null ? customerCount.toString() : '--',
      subtext: customerCount !== null && customerCount > 0 ? 'Registered store accounts' : 'No customers yet',
      trend: 'Real-time Firestore',
      icon: <AdminIcons.Customers className="w-5 h-5 text-[#C9892E]" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Luméra Editorial Hero Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#EBE6DD]">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2C241E] tracking-tight">
            {getGreeting()}, {capitalizedName}
          </h1>
          <p className="font-sans text-sm text-[#73665C]">
            Here's what's happening with your store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AdminButton
            variant="outline"
            size="md"
            icon={<AdminIcons.Products className="w-4 h-4" />}
            onClick={() => onNavigate('/admin/products')}
          >
            Manage Products
          </AdminButton>
          <AdminButton
            variant="primary"
            size="md"
            icon={<AdminIcons.Orders className="w-4 h-4" />}
            onClick={() => onNavigate('/admin/orders')}
          >
            View Orders
          </AdminButton>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <AdminLoadingState message="Connecting to Firestore..." />
      ) : (
        <>
          {/* 2. KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {kpiCards.map((kpi) => (
          <AdminCard key={kpi.label} padding="md" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#8C8075] font-semibold">
                {kpi.label}
              </span>
              <div className="p-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE6DD]">
                {kpi.icon}
              </div>
            </div>

            <div className="font-serif text-2xl sm:text-3xl font-semibold text-[#2C241E] tracking-tight">
              {kpi.value}
            </div>

            <div className="pt-2 border-t border-[#EBE6DD] flex items-center justify-between text-xs text-[#73665C]">
              <span className="truncate max-w-[150px]">{kpi.subtext}</span>
              <span className="font-mono text-[10px] text-[#C9892E] font-medium whitespace-nowrap">
                {kpi.trend}
              </span>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* 3. Mid Section: Revenue Overview & Low-Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Overview (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2C241E]">
              Revenue Overview
            </h2>
            <span className="font-mono text-[11px] text-[#8C8075]">
              Real-time Firestore
            </span>
          </div>

          <AdminCard padding="lg" className="min-h-[260px] flex flex-col justify-between">
            {totalRevenue > 0 ? (
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-[#2C241E]">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#73665C]">Total gross volume</span>
                </div>
                <div className="h-40 flex items-end gap-3 pt-6 pb-2 border-b border-[#EBE6DD]">
                  {orders.map((o, idx) => (
                    <div key={o.id || idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <div
                        style={{
                          height: `${Math.max(20, Math.min(130, ((o.pricing?.totalAmount || 0) / (totalRevenue || 1)) * 130))}px`,
                        }}
                        className="w-full bg-[#FAF3E8] border border-[#F0DFC4] group-hover:bg-[#C9892E] transition-all rounded-t-md"
                        title={`Order ${o.orderNumber || o.id}: ₹${o.pricing?.totalAmount || 0}`}
                      />
                      <span className="text-[10px] font-mono text-[#8C8075] truncate w-full text-center">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2 m-auto">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DD] flex items-center justify-center text-[#C9892E] mx-auto">
                  <AdminIcons.Dashboard className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#2C241E]">
                  No Revenue Recorded Yet
                </h3>
                <p className="font-sans text-xs text-[#73665C] max-w-sm mx-auto">
                  Revenue analytics will automatically graph and display here once real customer checkout orders are received.
                </p>
              </div>
            )}
          </AdminCard>
        </div>

        {/* Low-Stock Watchlist (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2C241E]">
              Inventory Watchlist
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/admin/inventory')}
              className="text-xs font-mono text-[#C9892E] hover:underline cursor-pointer"
            >
              View Matrix →
            </button>
          </div>

          <AdminCard padding="md" className="space-y-3">
            {lowStockItems.length > 0 ? (
              <div className="divide-y divide-[#EBE6DD]">
                {lowStockItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#2C241E] block truncate max-w-[140px]">
                        {item.productName}
                      </span>
                      <span className="text-[11px] font-mono text-[#8C8075]">
                        {item.variantSize} • SKU: {item.sku}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                      {item.stock} left
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-1.5">
                <span className="text-lg">🌿</span>
                <p className="font-sans text-xs font-medium text-[#2C241E]">
                  All variants healthy
                </p>
                <p className="font-sans text-[11px] text-[#73665C]">
                  No product variants currently below the 20-jar threshold.
                </p>
              </div>
            )}
          </AdminCard>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Orders & Catalog Varieties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2C241E]">
              Recent Orders
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/admin/orders')}
              className="text-xs font-mono text-[#C9892E] hover:underline cursor-pointer"
            >
              All Orders ({orders.length}) →
            </button>
          </div>

          {orders.length > 0 ? (
            <AdminCard padding="none" className="overflow-hidden">
              <div className="divide-y divide-[#EBE6DD]">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#2C241E]">
                          {order.orderNumber || order.id}
                        </span>
                        <AdminStatusBadge status={order.orderStatus} size="sm" />
                      </div>
                      <span className="font-sans text-xs text-[#73665C] block mt-0.5">
                        {order.customer?.name || order.customer?.email || 'Guest Customer'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-semibold text-[#2C241E] block">
                        ₹{(order.pricing?.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="font-mono text-[10px] text-[#8C8075] uppercase">
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
          ) : (
            <AdminEmptyState
              icon={<AdminIcons.Orders className="w-6 h-6 text-[#C9892E]" />}
              title="No Orders Yet"
              description="Orders placed on your storefront will automatically appear in this feed with live status and fulfillment controls."
              action={
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/')}
                >
                  Visit Storefront
                </AdminButton>
              }
            />
          )}
        </div>

        {/* Top Catalog Varieties (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-[#2C241E]">
              Catalog Varieties
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('/admin/products')}
              className="text-xs font-mono text-[#C9892E] hover:underline cursor-pointer"
            >
              Catalog ({products.length}) →
            </button>
          </div>

          <AdminCard padding="none" className="overflow-hidden">
            {products.length > 0 ? (
              <div className="divide-y divide-[#EBE6DD]">
                {products.slice(0, 4).map((p) => {
                  const isActive = p.active ?? p.available ?? true;
                  const totalStock = (p.variants || []).reduce(
                    (s, v) => s + (v.stock || 0),
                    0
                  );

                  return (
                    <div
                      key={p.id}
                      className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as any).src = '/images/hero_honey_jar.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <span className="font-serif text-xs font-semibold text-[#2C241E] block">
                            {p.name}
                          </span>
                          <span className="font-mono text-[10.5px] text-[#8C8075]">
                            {p.variants?.length || 0} variants • {totalStock} units
                          </span>
                        </div>
                      </div>

                      <AdminStatusBadge
                        status={isActive ? 'Active' : 'Inactive'}
                        size="sm"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#73665C]">
                Loading catalog...
              </div>
            )}
          </AdminCard>
          </div>
        </div>
      </>
    )}
  </div>
);
};

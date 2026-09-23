import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { OrderDocument, OrderStatus, PaymentStatus } from '../../types/admin';
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

interface AdminOrdersPageProps {
  onNavigate?: (path: string) => void;
}

const COURIER_OPTIONS = [
  'ST Courier',
  'Professional Couriers',
  'India Post',
  'Delhivery',
  'BlueDart',
  'Other',
];

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = () => {
  const { adminUser } = useAdminAuth();

  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<'ALL' | PaymentStatus>('ALL');

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderDocument | null>(null);

  // Fulfillment and Status update form state inside modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('placed');
  const [courierPartner, setCourierPartner] = useState<string>('ST Courier');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [trackingUrl, setTrackingUrl] = useState<string>('');
  const [dispatchNotes, setDispatchNotes] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const isMountedRef = useRef(true);

  // Helper to parse timestamps safely
  const parseTimestamp = (ts: any): number => {
    if (!ts) return 0;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (typeof ts.seconds === 'number') return ts.seconds * 1000;
    const parsed = new Date(ts).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  const showToast = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      if (isMountedRef.current) setNotification(null);
    }, 4000);
  };

  // Sync selected order form fields whenever selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.orderStatus || 'placed');
      setCourierPartner(selectedOrder.fulfillment?.courierPartner || 'ST Courier');
      setTrackingNumber(selectedOrder.fulfillment?.trackingNumber || '');
      setTrackingUrl(selectedOrder.fulfillment?.trackingUrl || '');
      setDispatchNotes(selectedOrder.fulfillment?.dispatchNotes || '');
    }
  }, [selectedOrder]);

  // Real-time Firestore subscription with infinite-loading protection
  useEffect(() => {
    isMountedRef.current = true;
    setLoading(true);
    setError(null);

    // Guard: Maximum 5000ms before forcing loading state to resolve, eliminating infinite loading
    const safetyTimeout = setTimeout(() => {
      if (isMountedRef.current && loading) {
        setLoading(false);
      }
    }, 5000);

    let unsubscribe = () => {};

    try {
      // Query without composite index dependency to prevent Firestore query stalling
      const ordersQuery = query(collection(db, 'orders'));

      unsubscribe = onSnapshot(
        ordersQuery,
        (snapshot) => {
          clearTimeout(safetyTimeout);
          if (!isMountedRef.current) return;

          const loaded = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
            } as OrderDocument;
          });

          // Sort in memory client-side safely by createdAt desc
          loaded.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));

          setOrders(loaded);
          setLoading(false);
          setError(null);

          // If modal is currently viewing an order, refresh its data in place
          setSelectedOrder((prev) => {
            if (!prev) return null;
            const updated = loaded.find((o) => o.id === prev.id);
            return updated || prev;
          });
        },
        (err) => {
          clearTimeout(safetyTimeout);
          console.warn('[AdminOrdersPage] Snapshot listener notice:', err.message);
          if (!isMountedRef.current) return;
          setError(err.message || 'Failed to sync live orders from Firestore.');
          setLoading(false);
        }
      );
    } catch (err: any) {
      clearTimeout(safetyTimeout);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to initialize orders listener.');
        setLoading(false);
      }
    }

    return () => {
      isMountedRef.current = false;
      clearTimeout(safetyTimeout);
      unsubscribe();
    };
  }, []);

  // Update order fulfillment and status workflow
  const handleUpdateStatusAndLogistics = async (targetStatus?: OrderStatus) => {
    if (!selectedOrder || isUpdating) return;
    const finalStatus = targetStatus || editStatus;

    setIsUpdating(true);
    try {
      const orderRef = doc(db, 'orders', selectedOrder.id);

      const fulfillmentData: Record<string, any> = {
        courierPartner: courierPartner.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        trackingUrl: trackingUrl.trim() || undefined,
        dispatchNotes: dispatchNotes.trim() || undefined,
        dispatchedAt:
          finalStatus === 'dispatched' || selectedOrder.fulfillment?.dispatchedAt
            ? selectedOrder.fulfillment?.dispatchedAt || serverTimestamp()
            : undefined,
        deliveredAt:
          finalStatus === 'delivered'
            ? serverTimestamp()
            : selectedOrder.fulfillment?.deliveredAt || undefined,
      };

      await updateDoc(orderRef, {
        orderStatus: finalStatus,
        fulfillment: fulfillmentData,
        updatedAt: serverTimestamp(),
        lastUpdatedBy: adminUser?.email || 'admin',
      });

      setEditStatus(finalStatus);
      showToast(`Order status updated to "${finalStatus.toUpperCase()}" successfully.`);
    } catch (err: any) {
      console.error('[AdminOrdersPage] Status update failed:', err);
      showToast(err.message || 'Failed to update order status.', true);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const queryLower = searchQuery.toLowerCase().trim();
    const orderNum = (order.orderNumber || order.id || '').toLowerCase();
    const customerName = (order.customer?.name || '').toLowerCase();
    const customerEmail = (order.customer?.email || '').toLowerCase();
    const customerPhone = (order.customer?.phone || '').toLowerCase();

    const matchesSearch =
      queryLower === '' ||
      orderNum.includes(queryLower) ||
      customerName.includes(queryLower) ||
      customerEmail.includes(queryLower) ||
      customerPhone.includes(queryLower);

    const matchesStatus =
      statusFilter === 'ALL' || order.orderStatus === statusFilter;

    const matchesPayment =
      paymentFilter === 'ALL' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '--';
    try {
      const ms = parseTimestamp(timestamp);
      if (!ms) return '--';
      const date = new Date(ms);
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
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
        breadcrumb="Store / Orders"
        title="Orders & Fulfillment"
        description="Live customer order records from Firestore. Monitor dispatch states, customer shipping addresses, and payment settlements."
        actions={
          <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-white border border-[#EBE6DD] text-[#73665C]">
            Live sync: <strong>{orders.length} order(s)</strong>
          </span>
        }
      />

      {/* Filter & Search Bar */}
      <AdminCard padding="sm" className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="w-full lg:w-80">
          <AdminInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, name, email, phone..."
            icon={<AdminIcons.Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#FAF8F5] border border-[#EBE6DD] rounded-xl text-xs font-mono">
            {(['ALL', 'placed', 'packed', 'dispatched', 'delivered', 'cancelled'] as const).map(
              (status) => (
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
                  {status === 'ALL' ? 'All Orders' : status}
                </button>
              )
            )}
          </div>

          {/* Payment Filter */}
          <div className="w-36">
            <AdminSelect
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="py-1.5 text-xs"
            >
              <option value="ALL">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </AdminSelect>
          </div>
        </div>
      </AdminCard>

      {/* Loading State */}
      {loading && <AdminLoadingState message="Loading orders from Firestore..." />}

      {/* Error State */}
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
      {!loading && !error && orders.length === 0 && (
        <AdminEmptyState
          icon={<AdminIcons.Orders className="w-7 h-7 text-[#C9892E]" />}
          title="No Orders Yet"
          description="Your store has not received any customer checkout orders yet. Incoming orders will appear in this table in real-time."
        />
      )}

      {/* Orders Table */}
      {!loading && !error && orders.length > 0 && (
        <>
          {filteredOrders.length === 0 ? (
            <AdminCard className="text-center py-10 text-xs text-[#73665C]">
              No orders found matching the active search or status filters.
            </AdminCard>
          ) : (
            <AdminTable>
              <AdminTableHead>
                <AdminTableHeaderCell>Order ID</AdminTableHeaderCell>
                <AdminTableHeaderCell>Customer</AdminTableHeaderCell>
                <AdminTableHeaderCell>Destination</AdminTableHeaderCell>
                <AdminTableHeaderCell>Items</AdminTableHeaderCell>
                <AdminTableHeaderCell>Amount</AdminTableHeaderCell>
                <AdminTableHeaderCell>Payment</AdminTableHeaderCell>
                <AdminTableHeaderCell>Status</AdminTableHeaderCell>
                <AdminTableHeaderCell>Date</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableHead>

              <AdminTableBody>
                {filteredOrders.map((order) => {
                  const totalItems = (order.items || []).reduce(
                    (s, i) => s + (i.quantity || 1),
                    0
                  );

                  return (
                    <AdminTableRow key={order.id}>
                      <AdminTableCell>
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-[#2C241E] block">
                            {order.orderNumber || order.id.slice(0, 10)}
                          </span>
                          {order.paymentGateway && (
                            <span className="font-mono text-[10px] text-[#8C8075] uppercase block">
                              {order.paymentGateway.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <div className="space-y-0.5">
                          <span className="font-semibold text-xs text-[#2C241E] block">
                            {order.customer?.name || 'Guest Customer'}
                          </span>
                          <span className="font-mono text-[10.5px] text-[#8C8075] block truncate max-w-[140px]">
                            {order.customer?.email || order.customer?.phone || '--'}
                          </span>
                        </div>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-sans text-xs text-[#5A4F46] block truncate max-w-[130px]">
                          {order.customer?.city ? `${order.customer.city}, ${order.customer.state}` : '--'}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="text-xs text-[#5A4F46]">
                          {totalItems} jar{totalItems === 1 ? '' : 's'}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-serif text-sm font-semibold text-[#2C241E]">
                          ₹{(order.pricing?.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminStatusBadge status={order.paymentStatus} size="sm" />
                      </AdminTableCell>

                      <AdminTableCell>
                        <AdminStatusBadge status={order.orderStatus} size="sm" />
                      </AdminTableCell>

                      <AdminTableCell>
                        <span className="font-mono text-[11px] text-[#73665C]">
                          {formatDate(order.createdAt)}
                        </span>
                      </AdminTableCell>

                      <AdminTableCell align="right">
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          Manage
                        </AdminButton>
                      </AdminTableCell>
                    </AdminTableRow>
                  );
                })}
              </AdminTableBody>
            </AdminTable>
          )}
        </>
      )}

      {/* Order Details & Fulfillment Workflow Modal */}
      <AdminModal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details: ${selectedOrder?.orderNumber || selectedOrder?.id}`}
        subtitle={`Placed on ${formatDate(selectedOrder?.createdAt)} • Payment: ${(selectedOrder?.paymentStatus || '').toUpperCase()}`}
        maxWidth="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-xs text-[#73665C]">
              Doc ID: <span className="text-[#2C241E]">{selectedOrder?.id}</span>
            </span>
            <AdminButton
              variant="outline"
              size="md"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </AdminButton>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-[#2C241E]">
            {/* 1. Status Workflow Stepper */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block">
                  Status Workflow: Placed → Packed → Dispatched → Delivered
                </span>
                <AdminStatusBadge status={selectedOrder.orderStatus} size="sm" />
              </div>

              {/* Workflow Stepper Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {selectedOrder.orderStatus === 'placed' && (
                  <AdminButton
                    variant="primary"
                    size="sm"
                    isLoading={isUpdating}
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatusAndLogistics('packed')}
                    icon={<AdminIcons.Check className="w-3.5 h-3.5" />}
                  >
                    Advance to Packed
                  </AdminButton>
                )}

                {selectedOrder.orderStatus === 'packed' && (
                  <AdminButton
                    variant="primary"
                    size="sm"
                    isLoading={isUpdating}
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatusAndLogistics('dispatched')}
                    icon={<AdminIcons.Shipping className="w-3.5 h-3.5" />}
                  >
                    Advance to Dispatched
                  </AdminButton>
                )}

                {selectedOrder.orderStatus === 'dispatched' && (
                  <AdminButton
                    variant="primary"
                    size="sm"
                    isLoading={isUpdating}
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatusAndLogistics('delivered')}
                    icon={<AdminIcons.Check className="w-3.5 h-3.5" />}
                  >
                    Mark as Delivered
                  </AdminButton>
                )}

                {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'delivered' && (
                  <AdminButton
                    variant="danger"
                    size="sm"
                    disabled={isUpdating}
                    onClick={() => {
                      if (window.confirm('Are you sure you want to cancel this order?')) {
                        handleUpdateStatusAndLogistics('cancelled');
                      }
                    }}
                  >
                    Cancel Order
                  </AdminButton>
                )}
              </div>

              {/* Status Override and Tracking Input Controls */}
              <div className="pt-3 border-t border-[#EBE6DD] grid grid-cols-1 md:grid-cols-2 gap-3">
                <AdminSelect
                  label="Update Order Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                  disabled={isUpdating}
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="packed">Packed</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </AdminSelect>

                <AdminSelect
                  label="Courier Partner"
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  disabled={isUpdating}
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </AdminSelect>

                <AdminInput
                  label="Tracking Number / AWB"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. STC94827103"
                  disabled={isUpdating}
                />

                <AdminInput
                  label="Tracking URL (Optional)"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="e.g. https://www.stcourier.com/track/..."
                  disabled={isUpdating}
                />
              </div>

              <div className="pt-1">
                <AdminInput
                  label="Dispatch / Administrative Notes"
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="e.g. Fragile glass packaging, dispatched via morning batch."
                  disabled={isUpdating}
                />
              </div>

              <div className="flex justify-end pt-2">
                <AdminButton
                  variant="primary"
                  size="sm"
                  isLoading={isUpdating}
                  disabled={isUpdating}
                  onClick={() => handleUpdateStatusAndLogistics()}
                  icon={<AdminIcons.Check className="w-3.5 h-3.5" />}
                >
                  Save Status & Tracking
                </AdminButton>
              </div>
            </div>

            {/* 2. Customer & Shipping Destination */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block">
                Customer & Shipping Destination
              </span>
              <p className="font-semibold text-sm text-[#2C241E]">
                {selectedOrder.customer?.name || 'Customer'}
              </p>
              <p className="text-[#5A4F46] leading-relaxed">
                {selectedOrder.customer?.address}, {selectedOrder.customer?.city},{' '}
                {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
              </p>
              <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[#73665C] font-mono text-[11px]">
                <span>Phone: <strong>{selectedOrder.customer?.phone || '--'}</strong></span>
                <span>Email: <strong>{selectedOrder.customer?.email || '--'}</strong></span>
                {selectedOrder.customer?.uid && (
                  <span>UID: <strong className="text-[10px]">{selectedOrder.customer.uid}</strong></span>
                )}
              </div>
            </div>

            {/* 3. Line Items */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block">
                Order Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="divide-y divide-[#EBE6DD] border border-[#EBE6DD] rounded-xl overflow-hidden bg-white">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 object-contain rounded-lg bg-[#FAF8F5] border border-[#EBE6DD] p-0.5"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-xs text-[#2C241E] block">
                          {item.productName}
                        </span>
                        <span className="font-mono text-[11px] text-[#8C8075]">
                          Size: {item.variantSize} • Qty: {item.quantity} • Unit: ₹{(item.unitPrice || 0).toLocaleString('en-IN')}
                          {item.sku && ` • SKU: ${item.sku}`}
                        </span>
                      </div>
                    </div>
                    <span className="font-serif text-sm font-semibold text-[#2C241E]">
                      ₹{(item.lineTotal || (item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Financial Summary & Payment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1.5 font-mono text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block mb-2">
                  Pricing Breakdown
                </span>
                <div className="flex justify-between text-[#73665C]">
                  <span>Subtotal</span>
                  <span>₹{(selectedOrder.pricing?.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#73665C]">
                  <span>Delivery / Shipping Fee</span>
                  <span>
                    {(selectedOrder.pricing?.shippingFee || 0) === 0
                      ? 'FREE'
                      : `₹${(selectedOrder.pricing?.shippingFee || 0).toLocaleString('en-IN')}`}
                  </span>
                </div>
                {Boolean(selectedOrder.pricing?.discountAmount) && (
                  <div className="flex justify-between text-[#166534]">
                    <span>Discount ({selectedOrder.pricing?.couponCode || 'Promo'})</span>
                    <span>-₹{(selectedOrder.pricing?.discountAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#EBE6DD] flex justify-between font-bold text-sm text-[#2C241E]">
                  <span>Total Amount</span>
                  <span className="font-serif">₹{(selectedOrder.pricing?.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1.5 font-mono text-xs">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#8C8075] font-semibold block mb-2">
                  Payment Details
                </span>
                <div className="flex justify-between items-center text-[#73665C]">
                  <span>Payment Status</span>
                  <AdminStatusBadge status={selectedOrder.paymentStatus} size="sm" />
                </div>
                <div className="flex justify-between text-[#73665C]">
                  <span>Gateway</span>
                  <span className="uppercase text-[#2C241E]">{selectedOrder.paymentGateway || 'Razorpay'}</span>
                </div>
                {selectedOrder.razorpayOrderId && (
                  <div className="flex justify-between text-[#73665C] truncate">
                    <span>Razorpay Order</span>
                    <span className="text-[10px] text-[#2C241E] font-mono">{selectedOrder.razorpayOrderId}</span>
                  </div>
                )}
                {selectedOrder.razorpayPaymentId && (
                  <div className="flex justify-between text-[#73665C] truncate">
                    <span>Payment ID</span>
                    <span className="text-[10px] text-[#2C241E] font-mono">{selectedOrder.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

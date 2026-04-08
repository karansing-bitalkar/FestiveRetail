import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiChevronLeft, FiChevronRight, FiTrendingUp } from 'react-icons/fi';
import { MdLocalShipping, MdCheck } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { ORDERS } from '@/constants/data';
import { Order } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 10;

export default function VendorOrders() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [confirmUpdate, setConfirmUpdate] = useState(false);

  const filtered = useMemo(() => orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [orders, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Revenue calculations
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayRevenue = orders.filter(o => o.status === 'delivered' && o.createdAt === today).reduce((s, o) => s + o.total, 0);

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const weeklyRevenue = orders.filter(o => o.status === 'delivered' && o.createdAt >= weekAgo).reduce((s, o) => s + o.total, 0);

  const handleConfirmUpdate = () => {
    if (selectedOrder && newStatus) {
      setOrders(os => os.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus as Order['status'] } : o));
      toast.success(`Order #${selectedOrder.id} updated to "${newStatus}"!`);
      setSelectedOrder(null);
      setConfirmUpdate(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Orders Management</h2>
        <p className="text-gray-500 text-sm">{orders.length} total orders · {orders.filter(o => o.status === 'pending').length} pending</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: 'bg-orange-50 text-orange-700', icon: HiSparkles },
          { label: "Weekly Revenue", value: `₹${weeklyRevenue.toLocaleString()}`, color: 'bg-green-50 text-green-700', icon: FiTrendingUp },
          { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString()}`, color: 'bg-blue-50 text-blue-700', icon: MdCheck },
          { label: "Avg Order Value", value: orders.length ? `₹${Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length).toLocaleString()}` : '₹0', color: 'bg-purple-50 text-purple-700', icon: MdLocalShipping },
        ].map((s) => {
          const Icon = s.icon as any;
          return (
            <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="text-lg" />
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <div className="text-2xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by order ID or customer..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize whitespace-nowrap border transition-all ${filterStatus === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Products', 'Revenue', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : paginated.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-orange-500 text-sm">#{order.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 font-medium">{order.customerName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[180px] truncate">
                    {order.products[0].name}{order.products.length > 1 ? ` +${order.products.length - 1}` : ''}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 text-sm">₹{order.total.toLocaleString()}</div>
                    {order.status === 'delivered' && (
                      <div className="text-xs text-green-600 font-medium">Credited</div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="text-xs text-red-500 font-medium">Refunded</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{order.createdAt}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-500 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-all whitespace-nowrap">
                      <MdLocalShipping className="text-sm" /> Update
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      <Modal isOpen={!!selectedOrder && !confirmUpdate} onClose={() => setSelectedOrder(null)} title={`Update Order #${selectedOrder?.id}`}>
        <div className="flex flex-col gap-4">
          <div className="bg-orange-50 rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-500">Customer:</span> <strong>{selectedOrder?.customerName}</strong></div>
              <div><span className="text-gray-500">Amount:</span> <strong className="text-orange-500">₹{selectedOrder?.total.toLocaleString()}</strong></div>
              <div><span className="text-gray-500">Items:</span> <strong>{selectedOrder?.products.length}</strong></div>
              <div><span className="text-gray-500">Date:</span> <strong>{selectedOrder?.createdAt}</strong></div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select New Status</label>
            <div className="grid grid-cols-2 gap-2">
              {STATUSES.map(s => (
                <button key={s} onClick={() => setNewStatus(s)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 capitalize transition-all ${newStatus === s ? 'fest-gradient text-white border-transparent shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setConfirmUpdate(true)} disabled={newStatus === selectedOrder?.status}
            className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Update to "{newStatus}"
          </button>
        </div>
      </Modal>

      {/* Confirm Update Modal */}
      <ConfirmModal
        isOpen={confirmUpdate}
        title="Confirm Status Update"
        message={`Update order #${selectedOrder?.id} status to "${newStatus}"? Customer will be notified.`}
        confirmText="Yes, Update Status"
        onConfirm={handleConfirmUpdate}
        onCancel={() => setConfirmUpdate(false)}
      />
    </div>
  );
}

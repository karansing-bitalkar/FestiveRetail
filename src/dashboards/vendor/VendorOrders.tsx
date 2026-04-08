import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, TrendingUp, Truck, Check, Eye } from 'lucide-react';
import { Sparkles } from 'lucide-react';
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
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter(o => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [orders, search, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
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
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Orders Management</h2>
        <p className="text-gray-500 text-sm">{orders.length} total orders · {orders.filter(o => o.status === 'pending').length} pending</p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: Sparkles, color: 'bg-orange-50 text-orange-700' },
          { label: 'Weekly Revenue', value: `₹${weeklyRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-700' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: Check, color: 'bg-blue-50 text-blue-700' },
          { label: 'Avg Order', value: orders.length ? `₹${Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length).toLocaleString()}` : '₹0', icon: Truck, color: 'bg-purple-50 text-purple-700' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1"><Icon size={14} /><span className="text-xs font-semibold">{s.label}</span></div>
              <div className="text-xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Search order ID or customer..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize whitespace-nowrap border-2 transition-all ${filterStatus === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
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
              <tr>{['Order ID', 'Customer', 'Items', 'Revenue', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : paginated.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-orange-500 text-sm">#{order.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-700 font-semibold">{order.customerName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[160px] truncate">
                    {order.products[0].name}{order.products.length > 1 ? ` +${order.products.length - 1}` : ''}
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 text-sm">₹{order.total.toLocaleString()}</div>
                    {order.status === 'delivered' && <div className="text-xs text-green-600 font-medium">Credited</div>}
                    {order.status === 'cancelled' && <div className="text-xs text-red-500 font-medium">Refunded</div>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{order.createdAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setViewOrder(order)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all">
                        <Eye size={12} /> View
                      </button>
                      <button onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-orange-500 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-all">
                        <Truck size={12} /> Update
                      </button>
                    </div>
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
          <p className="text-sm text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order #${viewOrder?.id}`}>
        {viewOrder && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Customer', v: viewOrder.customerName },
                { l: 'Status', v: viewOrder.status },
                { l: 'Date', v: viewOrder.createdAt },
                { l: 'Total', v: `₹${viewOrder.total.toLocaleString()}` },
              ].map(item => (
                <div key={item.l} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-0.5">{item.l}</div>
                  <div className="font-bold text-gray-900 text-sm capitalize">{item.v}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Delivery Address</p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{viewOrder.address}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Items ({viewOrder.products.length})</p>
              <div className="flex flex-col gap-2">
                {viewOrder.products.map(p => (
                  <div key={p.productId} className="flex items-center justify-between bg-orange-50 rounded-xl px-3 py-2.5">
                    <span className="text-sm text-gray-800">{p.name} × {p.qty}</span>
                    <span className="font-bold text-orange-500 text-sm">₹{(p.price * p.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={!!selectedOrder && !confirmUpdate} onClose={() => setSelectedOrder(null)} title={`Update Order #${selectedOrder?.id}`}>
        <div className="flex flex-col gap-4">
          <div className="bg-orange-50 rounded-2xl p-4 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Customer:</span> <strong>{selectedOrder?.customerName}</strong></div>
            <div><span className="text-gray-500">Amount:</span> <strong className="text-orange-500">₹{selectedOrder?.total.toLocaleString()}</strong></div>
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

      <ConfirmModal isOpen={confirmUpdate} title="Confirm Status Update"
        message={`Update order #${selectedOrder?.id} to "${newStatus}"? Customer will be notified.`}
        confirmText="Yes, Update Status" onConfirm={handleConfirmUpdate} onCancel={() => setConfirmUpdate(false)} />
    </div>
  );
}

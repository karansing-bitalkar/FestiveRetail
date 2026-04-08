import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEye } from 'react-icons/fi';
import { MdLocalShipping } from 'react-icons/md';
import { ORDERS } from '@/constants/data';
import { Order } from '@/types';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersMonitoring() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [updateOrder, setUpdateOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const handleUpdate = () => {
    if (updateOrder && newStatus) {
      setOrders((os) => os.map((o) => o.id === updateOrder.id ? { ...o, status: newStatus as Order['status'] } : o));
      toast.success(`Order #${updateOrder.id} status updated to ${newStatus}!`);
      setUpdateOrder(null);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const TIMELINE = ['pending', 'processing', 'shipped', 'delivered'];
  const getTimelineIdx = (status: string) => TIMELINE.indexOf(status);

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Orders Monitoring</h2>
        <p className="text-gray-500 text-sm">Monitor and manage all platform orders</p>
      </div>

      {/* Status counts */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUSES.map((s) => (
          <div key={s} className={`${STATUS_COLORS[s]} rounded-xl p-3 text-center border border-current/20`}>
            <div className="text-2xl font-black">{orders.filter((o) => o.status === s).length}</div>
            <div className="text-xs font-medium capitalize">{s}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by order ID or customer..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${filter === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
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
                {['Order ID', 'Customer', 'Product(s)', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
              ) : filtered.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4 font-bold text-orange-500 text-sm">#{o.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-700">{o.customerName}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 max-w-[140px] truncate">{o.products[0].name}{o.products.length > 1 ? ` +${o.products.length - 1}` : ''}</td>
                  <td className="px-5 py-4 font-bold text-gray-900 text-sm">₹{o.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{o.createdAt}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setViewOrder(o)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all">
                        <FiEye className="text-sm" /> View
                      </button>
                      <button onClick={() => { setUpdateOrder(o); setNewStatus(o.status); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-500 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-all">
                        <MdLocalShipping className="text-sm" /> Update
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order #${viewOrder?.id} Details`} size="lg">
        {viewOrder && (
          <div className="flex flex-col gap-5">
            {/* Timeline */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Order Progress</p>
              <div className="flex items-center gap-0">
                {TIMELINE.map((step, idx) => {
                  const current = getTimelineIdx(viewOrder.status);
                  const isDone = viewOrder.status === 'cancelled' ? false : idx <= current;
                  return (
                    <div key={step} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isDone ? 'fest-gradient text-white border-transparent' : 'bg-white border-gray-200 text-gray-400'}`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] mt-1 capitalize font-medium ${isDone ? 'text-orange-500' : 'text-gray-400'}`}>{step}</span>
                      </div>
                      {idx < TIMELINE.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 rounded transition-all ${isDone && idx < current ? 'fest-gradient' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              {viewOrder.status === 'cancelled' && (
                <div className="mt-3 text-center text-xs font-bold text-red-500 bg-red-50 rounded-xl py-2">Order Cancelled</div>
              )}
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Customer</p>
                <p className="font-bold text-gray-900">{viewOrder.customerName}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {viewOrder.customerId}</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Address</p>
                <p className="text-sm text-gray-700">{viewOrder.address}</p>
              </div>
            </div>

            {/* Products */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Products Ordered</p>
              <div className="flex flex-col gap-2">
                {viewOrder.products.map((p) => (
                  <div key={p.productId} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500">Qty: {p.qty}</p>
                    </div>
                    <p className="font-bold text-orange-500">₹{(p.price * p.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl px-5 py-4">
              <span className="font-bold text-gray-700">Order Total</span>
              <span className="text-2xl font-black text-orange-500">₹{viewOrder.total.toLocaleString()}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setViewOrder(null); setUpdateOrder(viewOrder); setNewStatus(viewOrder.status); }}
                className="flex-1 py-2.5 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
                Update Status
              </button>
              <button onClick={() => setViewOrder(null)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal isOpen={!!updateOrder} onClose={() => setUpdateOrder(null)} title={`Update Order #${updateOrder?.id}`}>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setNewStatus(s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 capitalize transition-all ${newStatus === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={handleUpdate} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Update Order
          </button>
        </div>
      </Modal>
    </div>
  );
}

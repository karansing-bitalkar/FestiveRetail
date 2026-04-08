import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { ORDERS } from '@/constants/data';
import Modal from '@/components/features/Modal';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 10;

export default function OrdersMonitoring() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<typeof ORDERS[0] | null>(null);

  const filtered = ORDERS.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customerName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Orders Monitoring</h2>
        <p className="text-gray-500 text-sm">{ORDERS.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search orders..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${filter === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Order ID', 'Customer', 'Product', 'Total', 'Date', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-4 py-4 text-sm font-bold text-gray-900">#{order.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{order.customerName}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 max-w-[140px] truncate">{order.products[0]?.name}</td>
                  <td className="px-4 py-4 text-sm font-bold text-orange-500">₹{order.total.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{order.createdAt}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => setViewOrder(order)} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-all"><Eye size={13} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <Modal isOpen={!!viewOrder} onClose={() => setViewOrder(null)} title={`Order #${viewOrder?.id}`}>
        {viewOrder && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Customer</p><p className="font-bold text-gray-900">{viewOrder.customerName}</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Status</p><span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[viewOrder.status]}`}>{viewOrder.status}</span></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Order Date</p><p className="font-bold text-gray-900">{viewOrder.createdAt}</p></div>
              <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Total</p><p className="font-black text-orange-500">₹{viewOrder.total.toLocaleString()}</p></div>
            </div>
            <div><p className="text-xs text-gray-400 mb-2">Delivery Address</p><p className="bg-gray-50 rounded-xl p-3 text-gray-700">{viewOrder.address}</p></div>
            <div>
              <p className="text-xs text-gray-400 mb-2">Products</p>
              {viewOrder.products.map(p => (
                <div key={p.productId} className="flex justify-between bg-gray-50 rounded-xl p-3 mb-2">
                  <span className="text-gray-700">{p.name} ×{p.qty}</span>
                  <span className="font-bold text-orange-500">₹{(p.price * p.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

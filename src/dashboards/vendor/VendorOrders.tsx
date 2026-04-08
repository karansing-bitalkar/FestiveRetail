import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ChevronDown, DollarSign, TrendingUp } from 'lucide-react';
import { ORDERS } from '@/constants/data';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAGE_SIZE = 10;

export default function VendorOrders() {
  const [orders, setOrders] = useState(ORDERS.map(o => ({ ...o })));
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);

  const filtered = orders.filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
  const pendingRevenue = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const confirmUpdate = () => {
    if (!pendingUpdate) return;
    setOrders(os => os.map(o => o.id === pendingUpdate.id ? { ...o, status: pendingUpdate.status as any } : o));
    toast.success(`Order status updated to ${pendingUpdate.status}`);
    setPendingUpdate(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Orders</h2>
        <p className="text-gray-500 text-sm">{orders.length} total orders</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-50 text-green-700' },
          { label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-orange-50 text-orange-700' },
          { label: 'Total Orders', value: orders.length, icon: ChevronDown, color: 'bg-blue-50 text-blue-700' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
            <div className="text-2xl font-black mb-0.5">{s.value}</div>
            <div className="text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by order ID or customer..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Order ID', 'Customer', 'Product', 'Total', 'Date', 'Status', 'Update Status'].map(h => (
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
                    <select
                      value={order.status}
                      onChange={e => setPendingUpdate({ id: order.id, status: e.target.value })}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-400 bg-white"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <ConfirmModal isOpen={!!pendingUpdate}
        title="Update Order Status"
        message={`Change order status to "${pendingUpdate?.status}"?`}
        confirmText="Update Status"
        onConfirm={confirmUpdate}
        onCancel={() => setPendingUpdate(null)} />
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Truck, Package, CheckCircle2, Clock, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORDERS } from '@/constants/data';

const STATUS_CONFIG: Record<string, { color: string; icon: any; progress: number }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Clock, progress: 20 },
  processing: { color: 'bg-blue-100 text-blue-700', icon: Package, progress: 40 },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, progress: 75 },
  delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, progress: 100 },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, progress: 0 },
};

const PAGE_SIZE = 5;

export default function MyOrders() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = ORDERS.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.products[0]?.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">My Orders</h2>
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

      <div className="flex flex-col gap-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No orders found</div>
        ) : paginated.map((order, i) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = cfg.icon;
          return (
            <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-gray-900">#{order.id}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize flex items-center gap-1 ${cfg.color}`}>
                      <StatusIcon size={11} /> {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{order.products[0]?.name}{order.products.length > 1 ? ` + ${order.products.length - 1} more` : ''}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.createdAt}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-orange-500 text-lg">₹{order.total.toLocaleString()}</p>
                </div>
              </div>

              {/* Mini progress bar */}
              {order.status !== 'cancelled' && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    {['Placed', 'Processing', 'Shipped', 'Delivered'].map((label, idx) => (
                      <span key={label} className={idx * 33 <= cfg.progress ? 'text-orange-500 font-semibold' : ''}>{label}</span>
                    ))}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cfg.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                      className="h-full fest-gradient rounded-full"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {(order.status === 'shipped' || order.status === 'processing') && (
                  <Link to={`/track/${order.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 fest-gradient text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all">
                    <Truck size={13} /> Track Order
                  </Link>
                )}
                {order.status === 'delivered' && (
                  <Link to={`/product/${order.products[0]?.productId}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-xl hover:bg-yellow-200 transition-all">
                    Rate Product
                  </Link>
                )}
                <Link to={`/track/${order.id}`} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all">
                  View Details
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import { MdLocalShipping, MdCheck, MdRadar } from 'react-icons/md';
import { ORDERS } from '@/constants/data';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

// Progress % per status
const STATUS_PROGRESS: Record<string, number> = {
  pending: 20,
  processing: 40,
  shipped: 70,
  delivered: 100,
  cancelled: 0,
};

const STATUS_STAGES = ['pending', 'processing', 'shipped', 'delivered'];

function MiniProgressBar({ status }: { status: string }) {
  const pct = STATUS_PROGRESS[status] ?? 0;
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <div className="mt-3">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full w-full bg-red-300 rounded-full" />
        </div>
        <p className="text-[10px] text-red-400 font-medium mt-1">Order Cancelled</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex justify-between mb-1">
        {STATUS_STAGES.map((s, i) => {
          const stagePct = STATUS_PROGRESS[s];
          const done = pct >= stagePct;
          const isCurrent = status === s;
          return (
            <div key={s} className="flex flex-col items-center gap-0.5">
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${done ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'} ${isCurrent ? 'ring-2 ring-orange-200 scale-125' : ''}`} />
              <span className={`text-[8px] font-medium capitalize hidden sm:block ${done ? 'text-orange-500' : 'text-gray-400'}`}>{s}</span>
            </div>
          );
        })}
      </div>
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 fest-gradient rounded-full"
        />
      </div>
      <p className="text-[10px] text-gray-400 mt-1 capitalize font-medium">{pct}% complete · Status: <span className="text-orange-500">{status}</span></p>
    </div>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [cancelOrder, setCancelOrder] = useState<string | null>(null);
  const myOrders = ORDERS.filter(o => o.customerId === 'c1');

  const filtered = myOrders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.products[0].name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCancel = () => {
    toast.success(`Order #${cancelOrder} cancellation requested!`);
    setCancelOrder(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">My Orders</h2>
        <p className="text-gray-500 text-sm">Track and manage all your orders</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: myOrders.length, color: 'bg-orange-50 text-orange-600' },
          { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-50 text-green-600' },
          { label: 'In Transit', value: myOrders.filter(o => o.status === 'shipped').length, color: 'bg-purple-50 text-purple-600' },
          { label: 'Pending', value: myOrders.filter(o => o.status === 'pending' || o.status === 'processing').length, color: 'bg-yellow-50 text-yellow-600' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-all border ${filter === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="font-bold text-gray-700">No orders found</h3>
          </div>
        ) : filtered.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <span className="font-bold text-orange-500">#{order.id}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="text-xs text-gray-400">{order.createdAt}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">{order.products.map(p => p.name).join(', ')}</h4>
                <p className="text-gray-400 text-xs line-clamp-1">{order.address}</p>

                {/* ── Mini Progress Bar ── */}
                <MiniProgressBar status={order.status} />
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xl font-black text-gray-900">₹{order.total.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{order.products.reduce((s, p) => s + p.qty, 0)} item(s)</div>
                </div>
                <div className="flex flex-col gap-2">
                  {/* ── Track Order Button ── */}
                  <button
                    onClick={() => navigate(`/track/${order.id}`)}
                    className="flex items-center gap-1 px-3 py-2 bg-orange-50 text-orange-500 rounded-lg text-xs font-semibold hover:bg-orange-100 transition-all whitespace-nowrap"
                  >
                    <MdRadar className="text-sm" /> Track
                  </button>
                  {order.status === 'shipped' && (
                    <button className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold hover:bg-purple-100 transition-all">
                      <MdLocalShipping className="text-sm" /> Live
                    </button>
                  )}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <button onClick={() => setCancelOrder(order.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg text-xs font-semibold hover:bg-red-100 transition-all">
                      <FiXCircle className="text-sm" /> Cancel
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-all">
                      <MdCheck className="text-sm" /> Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal isOpen={!!cancelOrder} title="Cancel Order" message={`Are you sure you want to cancel order #${cancelOrder}? This action cannot be undone.`}
        confirmText="Yes, Cancel Order" onConfirm={handleCancel} onCancel={() => setCancelOrder(null)} />
    </div>
  );
}

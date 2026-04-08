import { motion } from 'framer-motion';
import { Users, Store, ShoppingBag, DollarSign, TrendingUp, ArrowRight, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ORDERS, PRODUCTS } from '@/constants/data';

const STATS = [
  { label: 'Total Users', value: '2,847', icon: Users, color: 'bg-blue-100 text-blue-600', change: '+12 today' },
  { label: 'Active Vendors', value: '142', icon: Store, color: 'bg-green-100 text-green-600', change: '+3 this week' },
  { label: 'Total Orders', value: '18,432', icon: ShoppingBag, color: 'bg-orange-100 text-orange-600', change: '+48 today' },
  { label: 'Revenue', value: '₹28.4L', icon: DollarSign, color: 'bg-purple-100 text-purple-600', change: '+₹42K today' },
];

export default function AdminDashboard() {
  const totalRevenue = ORDERS.reduce((s, o) => s + o.total, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="fest-gradient rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp size={20} />
          <span className="text-white/80">Admin Overview</span>
        </div>
        <h1 className="text-2xl font-black mb-1">FestiveRetail Dashboard</h1>
        <p className="text-white/70 text-sm">Monitor your platform performance</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><ArrowUp size={10} />{s.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Recent Orders</h3>
            <Link to="orders" className="text-sm text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {ORDERS.slice(0, 5).map((order, i) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-gray-900">#{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500 text-sm">₹{order.total.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Top Products</h3>
            <Link to="products" className="text-sm text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {PRODUCTS.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&q=60')} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">⭐ {p.rating} · {p.reviews} reviews</p>
                </div>
                <span className="text-sm font-bold text-orange-500 flex-shrink-0">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

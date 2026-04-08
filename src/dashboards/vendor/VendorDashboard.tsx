import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Truck, BarChart2, DollarSign, ArrowRight, ArrowUp, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ORDERS } from '@/constants/data';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SALES_DATA = [
  { month: 'May', sales: 12000 }, { month: 'Jun', sales: 18000 }, { month: 'Jul', sales: 15000 },
  { month: 'Aug', sales: 22000 }, { month: 'Sep', sales: 28000 }, { month: 'Oct', sales: 45000 },
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const stats = [
    { label: 'Total Products', value: 24, icon: Package, color: 'from-orange-400 to-red-400', link: '/dashboard/vendor/products', change: '+3 this week' },
    { label: 'Pending Orders', value: 8, icon: Truck, color: 'from-blue-400 to-purple-400', link: '/dashboard/vendor/orders', change: '2 urgent' },
    { label: 'Low Stock', value: 3, icon: BarChart2, color: 'from-yellow-400 to-orange-400', link: '/dashboard/vendor/inventory', change: 'Needs restock' },
    { label: 'Total Earnings', value: '₹1.2L', icon: DollarSign, color: 'from-green-400 to-teal-400', link: '/dashboard/vendor/earnings', change: '+18% this month' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(4)].map((_, i) => <div key={i} className="absolute w-40 h-40 rounded-full border border-white" style={{ right: `${i*15}%`, top: '-30%' }} />)}</div>
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2"><Sparkles size={14} /> Diwali Season is Peak Time!</div>
          <h2 className="text-2xl font-black mb-1">Welcome, {user?.name}! 🚀</h2>
          <p className="text-white/80 mb-5">Your store is performing 18% better than last month. Keep it up!</p>
          <Link to="/dashboard/vendor/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-600 rounded-xl font-bold text-sm hover:bg-purple-50 transition-all">
            Add Products <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={s.link} className={`block p-5 bg-gradient-to-br ${s.color} rounded-2xl text-white hover:opacity-90 transition-all shadow-sm hover:shadow-md`}>
                <Icon size={28} className="mb-3 opacity-80" />
                <div className="text-3xl font-black mb-0.5">{s.value}</div>
                <div className="text-white/80 text-sm font-medium mb-1">{s.label}</div>
                <div className="text-white/60 text-xs">{s.change}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Sales chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sales Overview</h3>
            <p className="text-gray-400 text-sm">Monthly revenue (₹)</p>
          </div>
          <div className="flex items-center gap-1 text-green-500 font-semibold text-sm"><ArrowUp size={14} /><span>+18% vs last month</span></div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={SALES_DATA}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Sales']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="sales" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(25 100% 52%)" />
                <stop offset="100%" stopColor="hsl(330 85% 55%)" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <Link to="/dashboard/vendor/orders" className="text-orange-500 text-sm font-semibold flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              {['Order', 'Customer', 'Amount', 'Status'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {ORDERS.slice(0, 4).map(o => (
                <tr key={o.id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-orange-500 text-sm">#{o.id}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{o.customerName}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">₹{o.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdPeople, MdStore, MdShoppingBag, MdAttachMoney, MdVerifiedUser, MdBlock } from 'react-icons/md';
import { FiArrowRight, FiArrowUp, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { ORDERS } from '@/constants/data';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts';

const MONTHLY_REVENUE = [
  { month: 'Jul', v: 85000 }, { month: 'Aug', v: 125000 }, { month: 'Sep', v: 180000 }, { month: 'Oct', v: 320000 },
];
const PIE_DATA = [
  { name: 'Diwali', value: 45 }, { name: 'Holi', value: 20 }, { name: 'Wedding', value: 18 }, { name: 'Others', value: 17 },
];
const PIE_COLORS = ['#f97316', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const stats = [
    { label: 'Total Users', value: '24,891', icon: MdPeople, color: 'from-blue-400 to-cyan-400', link: '/dashboard/admin/users', change: '+124 today' },
    { label: 'Active Vendors', value: '589', icon: MdStore, color: 'from-purple-400 to-pink-400', link: '/dashboard/admin/vendors', change: '+12 this week' },
    { label: 'Total Orders', value: '1,24,567', icon: MdShoppingBag, color: 'from-orange-400 to-red-400', link: '/dashboard/admin/orders', change: '+843 today' },
    { label: 'Revenue (MTD)', value: '₹32L', icon: MdAttachMoney, color: 'from-green-400 to-teal-400', link: '/dashboard/admin/analytics', change: '+23% vs last month' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(4)].map((_, i) => <div key={i} className="absolute w-40 h-40 rounded-full border border-white" style={{ right: `${i*15}%`, top: '-30%' }} />)}</div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-white/80 text-sm mb-1">Admin Control Panel</div>
            <h2 className="text-2xl font-black mb-1">Good day, {user?.name}! 👑</h2>
            <p className="text-white/80">Platform is running smoothly. 3 vendor approvals pending. Diwali traffic is 3x normal.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard/admin/vendors" className="px-4 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all whitespace-nowrap">
              Approve Vendors
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={s.link} className={`block p-5 bg-gradient-to-br ${s.color} rounded-2xl text-white hover:opacity-90 transition-all shadow-sm hover:shadow-md`}>
                <Icon className="text-3xl mb-3 opacity-80" />
                <div className="text-3xl font-black mb-0.5">{s.value}</div>
                <div className="text-white/80 text-sm font-medium mb-1">{s.label}</div>
                <div className="text-white/60 text-xs flex items-center gap-1"><FiArrowUp className="text-[10px]" />{s.change}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={MONTHLY_REVENUE}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="v" fill="url(#adminBarGrad)" radius={[6, 6, 0, 0]} />
              <defs><linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Sales by Festival</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, index) => <Cell key={index} fill={PIE_COLORS[index]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {PIE_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-sm text-gray-600">{d.name}</span>
                  <span className="text-sm font-bold text-gray-900 ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Recent Platform Orders</h3>
          <Link to="/dashboard/admin/orders" className="text-orange-500 text-sm font-semibold flex items-center gap-1">View All <FiArrowRight /></Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Order ID', 'Customer', 'Products', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {ORDERS.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-orange-500 text-sm">#{o.id}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">{o.customerName}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{o.products[0].name}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">₹{o.total.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span></td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{o.createdAt}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

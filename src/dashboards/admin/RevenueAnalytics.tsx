import { motion } from 'framer-motion';
import { FiTrendingUp, FiArrowUp } from 'react-icons/fi';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const MONTHLY = [
  { month: 'Jan', revenue: 45000, orders: 189 }, { month: 'Feb', revenue: 52000, orders: 213 },
  { month: 'Mar', revenue: 48000, orders: 198 }, { month: 'Apr', revenue: 61000, orders: 245 },
  { month: 'May', revenue: 55000, orders: 221 }, { month: 'Jun', revenue: 72000, orders: 289 },
  { month: 'Jul', revenue: 85000, orders: 341 }, { month: 'Aug', revenue: 125000, orders: 502 },
  { month: 'Sep', revenue: 180000, orders: 720 }, { month: 'Oct', revenue: 320000, orders: 1280 },
];
const TOP_CATS = [{ name: 'Diwali', v: 125000 }, { name: 'Wedding', v: 85000 }, { name: 'Holi', v: 62000 }, { name: 'Birthday', v: 48000 }, { name: 'Other', v: 35000 }];
const PIE = [{ name: 'Products', v: 65 }, { name: 'Shipping', v: 15 }, { name: 'Commission', v: 20 }];
const PIE_COLORS = ['#f97316', '#8b5cf6', '#06b6d4'];
const VENDORS_TOP = [{ name: 'Raj Enterprises', rev: 120000 }, { name: 'Diwali Hub', rev: 98000 }, { name: 'Color Carnival', rev: 75000 }];

export default function RevenueAnalytics() {
  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Revenue Analytics</h2><p className="text-gray-500 text-sm">Comprehensive platform revenue insights</p></div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue (YTD)', value: `₹${(totalRevenue/100000).toFixed(1)}L`, change: '+42%', color: 'from-orange-400 to-red-400' },
          { label: 'Avg Order Value', value: '₹2,847', change: '+12%', color: 'from-purple-400 to-pink-400' },
          { label: 'Conversion Rate', value: '3.8%', change: '+0.5%', color: 'from-blue-400 to-cyan-400' },
          { label: 'Repeat Customers', value: '42%', change: '+8%', color: 'from-green-400 to-teal-400' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 text-white`}>
            <div className="text-3xl font-black mb-0.5">{k.value}</div>
            <div className="text-white/80 text-sm font-medium mb-1">{k.label}</div>
            <div className="flex items-center gap-1 text-white/70 text-xs"><FiArrowUp />{k.change} vs last year</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div><h3 className="font-bold text-gray-900">Revenue & Orders Trend</h3><p className="text-gray-400 text-sm">Monthly overview 2024</p></div>
          <div className="flex items-center gap-1 text-green-500 font-semibold text-sm"><FiTrendingUp /><span>Peak in Oct (Diwali)</span></div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={MONTHLY}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis hide />
            <Tooltip formatter={(v, n) => [n === 'revenue' ? `₹${Number(v).toLocaleString()}` : v, n === 'revenue' ? 'Revenue' : 'Orders']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top categories */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Revenue by Festival</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TOP_CATS} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} width={70} />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="v" fill="url(#catGrad)" radius={[0, 6, 6, 0]} />
              <defs><linearGradient id="catGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart><Pie data={PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="v">
                {PIE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {PIE.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-sm text-gray-600">{d.name}</span>
                  <span className="text-sm font-bold text-gray-900 ml-auto">{d.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top vendors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Top Performing Vendors</h3>
        <div className="flex flex-col gap-3">
          {VENDORS_TOP.map((v, i) => (
            <div key={v.name} className="flex items-center gap-4">
              <span className="text-lg font-black text-gray-400 w-6">#{i + 1}</span>
              <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm">{v.name.charAt(0)}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">{v.name}</div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full fest-gradient rounded-full" style={{ width: `${(v.rev / 120000) * 100}%` }} />
                </div>
              </div>
              <span className="font-bold text-green-600 text-sm">₹{v.rev.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

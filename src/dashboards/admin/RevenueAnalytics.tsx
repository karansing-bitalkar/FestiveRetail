import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp, Package, ShoppingBag, Users, DollarSign } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useProductStore } from '@/stores/productStore';
import { ORDERS } from '@/constants/data';

const MONTHLY = [
  { month: 'Jan', revenue: 45000, orders: 189, vendors: 8 },
  { month: 'Feb', revenue: 52000, orders: 213, vendors: 10 },
  { month: 'Mar', revenue: 48000, orders: 198, vendors: 12 },
  { month: 'Apr', revenue: 61000, orders: 245, vendors: 14 },
  { month: 'May', revenue: 55000, orders: 221, vendors: 15 },
  { month: 'Jun', revenue: 72000, orders: 289, vendors: 17 },
  { month: 'Jul', revenue: 85000, orders: 341, vendors: 20 },
  { month: 'Aug', revenue: 125000, orders: 502, vendors: 23 },
  { month: 'Sep', revenue: 180000, orders: 720, vendors: 28 },
  { month: 'Oct', revenue: 320000, orders: 1280, vendors: 35 },
  { month: 'Nov', revenue: 210000, orders: 840, vendors: 38 },
  { month: 'Dec', revenue: 95000, orders: 380, vendors: 40 },
];

const PIE_COLORS = ['#f97316', '#8b5cf6', '#06b6d4', '#10b981'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-3">
        <p className="text-xs font-bold text-gray-600 mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-600">{p.name}:</span>
            <span className="font-bold text-gray-900">
              {p.name === 'revenue' || p.name === 'Revenue' ? `₹${Number(p.value).toLocaleString()}` : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenueAnalytics() {
  const { products } = useProductStore();

  const totalRevenue = MONTHLY.reduce((s, m) => s + m.revenue, 0);
  const totalOrders = ORDERS.length;
  const deliveredRevenue = ORDERS.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);

  // Top 5 products by reviews (proxy for sales)
  const topProducts = useMemo(() => [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 5).map(p => ({
    name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name,
    sales: p.reviews * 2,
    revenue: p.price * Math.floor(p.reviews / 3),
  })), [products]);

  // Revenue by festival
  const byFestival = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.festival] = (map[p.festival] || 0) + (p.price * Math.floor((p.reviews || 1) / 3));
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name, value }));
  }, [products]);

  // Vendor commission breakdown
  const vendorCommission = [
    { name: 'Product Revenue', v: 65 },
    { name: 'Platform Fee', v: 15 },
    { name: 'Vendor Payout', v: 72 },
    { name: 'Shipping', v: 8 },
  ];

  const kpis = [
    { label: 'Total Revenue (YTD)', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: '+42%', icon: DollarSign, color: 'from-orange-400 to-red-400' },
    { label: 'Total Orders', value: totalRevenue > 0 ? MONTHLY.reduce((s, m) => s + m.orders, 0).toLocaleString() : totalOrders, change: '+38%', icon: ShoppingBag, color: 'from-purple-400 to-pink-400' },
    { label: 'Avg Order Value', value: '₹2,847', change: '+12%', icon: TrendingUp, color: 'from-blue-400 to-cyan-400' },
    { label: 'Active Products', value: products.length, change: `+${products.length - 10}`, icon: Package, color: 'from-green-400 to-teal-400' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Revenue Analytics</h2>
        <p className="text-gray-500 text-sm">Comprehensive platform revenue insights — live data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${k.color} rounded-2xl p-5 text-white relative overflow-hidden`}>
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full" />
              <Icon size={20} className="mb-3 opacity-80" />
              <div className="text-2xl font-black mb-0.5">{k.value}</div>
              <div className="text-white/80 text-xs font-medium mb-1">{k.label}</div>
              <div className="flex items-center gap-1 text-white/70 text-xs"><ArrowUp size={10} />{k.change} vs last year</div>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue + Orders Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900">Monthly Revenue Trend</h3>
            <p className="text-gray-400 text-sm">Full year 2024 — revenue + order volume</p>
          </div>
          <div className="flex items-center gap-1 text-green-500 font-semibold text-sm">
            <TrendingUp size={14} /> Peak in Oct (Diwali)
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MONTHLY}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f97316" strokeWidth={3} fill="url(#revGrad)" />
            <Area type="monotone" dataKey="orders" name="Orders" stroke="#8b5cf6" strokeWidth={2} fill="url(#ordGrad)" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Top 5 Selling Products</h3>
          <p className="text-gray-400 text-xs mb-4">By estimated sales volume</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <Bar dataKey="sales" name="Est. Sales" fill="url(#prodGrad)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Festival */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-2">Revenue by Festival</h3>
          <p className="text-gray-400 text-xs mb-4">Estimated revenue per festival category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byFestival}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f9f9f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <defs>
                <linearGradient id="festGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <Bar dataKey="value" name="Revenue" fill="url(#festGrad)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Commission Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">Revenue Split</h3>
          <p className="text-gray-400 text-xs mb-4">Platform vs vendor commission breakdown (%)</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie data={[{ name: 'Products', v: 65 }, { name: 'Commission', v: 20 }, { name: 'Shipping', v: 15 }]}
                  cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="v">
                  {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 flex-1">
              {[{ label: 'Product Revenue', pct: 65, color: PIE_COLORS[0] }, { label: 'Vendor Payout', pct: 20, color: PIE_COLORS[1] }, { label: 'Shipping', pct: 15, color: PIE_COLORS[2] }].map(d => (
                <div key={d.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-gray-600 flex-1">{d.label}</span>
                  <span className="text-sm font-black text-gray-900">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Vendor Growth Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-1">Vendor Growth</h3>
          <p className="text-gray-400 text-xs mb-4">Cumulative vendor onboarding 2024</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="vendorLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <Line type="monotone" dataKey="vendors" name="Vendors" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

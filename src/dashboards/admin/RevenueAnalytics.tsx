import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jun', revenue: 85000, orders: 120 },
  { month: 'Jul', revenue: 92000, orders: 138 },
  { month: 'Aug', revenue: 78000, orders: 105 },
  { month: 'Sep', revenue: 110000, orders: 164 },
  { month: 'Oct', revenue: 245000, orders: 312 },
  { month: 'Nov', revenue: 189000, orders: 248 },
];

const TOP_PRODUCTS = [
  { name: 'Diwali Hamper', sales: 312 },
  { name: 'Puja Thali', sales: 234 },
  { name: 'Holi Combo', sales: 198 },
  { name: 'Ganesh Idol', sales: 167 },
  { name: 'Garba Dress', sales: 142 },
];

const FESTIVAL_REVENUE = [
  { name: 'Diwali', value: 45, color: '#f97316' },
  { name: 'Holi', value: 18, color: '#ec4899' },
  { name: 'Wedding', value: 22, color: '#8b5cf6' },
  { name: 'Others', value: 15, color: '#fbbf24' },
];

export default function RevenueAnalytics() {
  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-gray-900">Revenue Analytics</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L` },
          { label: 'This Month', value: '₹1.89L' },
          { label: 'Total Orders', value: '1,287' },
          { label: 'Avg Order Value', value: '₹1,472' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-orange-500 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v / 1000}K`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">Top 5 Products by Sales</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TOP_PRODUCTS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="sales" fill="#ec4899" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 mb-4">Revenue by Festival</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={FESTIVAL_REVENUE} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {FESTIVAL_REVENUE.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, 'Share']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

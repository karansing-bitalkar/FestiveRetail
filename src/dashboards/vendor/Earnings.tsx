import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EARNINGS_DATA = [
  { month: 'May', earnings: 8500 }, { month: 'Jun', earnings: 12000 }, { month: 'Jul', earnings: 9800 },
  { month: 'Aug', earnings: 15500 }, { month: 'Sep', earnings: 21000 }, { month: 'Oct', earnings: 38000 },
];

const TRANSACTIONS = [
  { id: 'TXN001', order: 'ORD001', amount: 1198, commission: 120, net: 1078, date: '2024-10-20', status: 'paid' },
  { id: 'TXN002', order: 'ORD002', amount: 2499, commission: 250, net: 2249, date: '2024-10-25', status: 'paid' },
  { id: 'TXN003', order: 'ORD004', amount: 2499, commission: 250, net: 2249, date: '2024-10-28', status: 'pending' },
  { id: 'TXN004', order: 'ORD003', amount: 1047, commission: 105, net: 942, date: '2024-11-01', status: 'pending' },
];

export default function Earnings() {
  const totalEarnings = EARNINGS_DATA.reduce((s, d) => s + d.earnings, 0);
  const pending = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.net, 0);
  const paid = TRANSACTIONS.filter(t => t.status === 'paid').reduce((s, t) => s + t.net, 0);

  const stats = [
    { label: 'Total Earnings (YTD)', value: `₹${totalEarnings.toLocaleString()}`, icon: DollarSign, color: 'from-orange-400 to-red-400', change: '+18% vs last month' },
    { label: 'Pending Payout', value: `₹${pending.toLocaleString()}`, icon: Clock, color: 'from-yellow-400 to-orange-400', change: 'Next payout: Mon' },
    { label: 'Total Paid Out', value: `₹${paid.toLocaleString()}`, icon: CheckCircle, color: 'from-green-400 to-teal-400', change: 'Last: Oct 25, 2024' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Earnings & Payouts</h2><p className="text-gray-500 text-sm">Track your revenue and payouts</p></div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}>
              <Icon size={28} className="opacity-80 mb-3" />
              <div className="text-3xl font-black mb-0.5">{s.value}</div>
              <div className="text-white/80 text-sm font-medium mb-1">{s.label}</div>
              <div className="flex items-center gap-1 text-white/60 text-xs"><TrendingUp size={10} /><span>{s.change}</span></div>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-5">Earnings Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={EARNINGS_DATA}>
            <defs>
              <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(25 100% 52%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(25 100% 52%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Earnings']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Area type="monotone" dataKey="earnings" stroke="hsl(25 100% 52%)" strokeWidth={3} fill="url(#earningsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Transactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50"><h3 className="font-bold text-gray-900">Transaction History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Txn ID', 'Order', 'Gross', 'Commission', 'Net Amount', 'Date', 'Status'].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {TRANSACTIONS.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-3.5 text-xs font-bold text-gray-500">{t.id}</td>
                  <td className="px-5 py-3.5 font-bold text-orange-500 text-sm">#{t.order}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-700">₹{t.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-red-500">-₹{t.commission}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900 text-sm">₹{t.net.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">{t.date}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

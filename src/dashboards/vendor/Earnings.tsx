import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, CheckCircle2, ArrowUp } from 'lucide-react';

const PAYOUT_HISTORY = [
  { id: 'PAY001', amount: 28500, date: '2024-10-31', status: 'paid', orders: 12 },
  { id: 'PAY002', amount: 19200, date: '2024-10-24', status: 'paid', orders: 8 },
  { id: 'PAY003', amount: 35800, date: '2024-11-07', status: 'pending', orders: 15 },
];

export default function Earnings() {
  const totalEarned = PAYOUT_HISTORY.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const pending = PAYOUT_HISTORY.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-gray-900">Earnings</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Earned', value: `₹${totalEarned.toLocaleString()}`, icon: DollarSign, color: 'from-green-400 to-teal-500' },
          { label: 'Pending Payout', value: `₹${pending.toLocaleString()}`, icon: Clock, color: 'from-orange-400 to-red-500' },
          { label: 'This Month', value: '₹35,800', icon: TrendingUp, color: 'from-purple-400 to-pink-500' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white`}>
            <s.icon size={20} className="mb-3 opacity-80" />
            <div className="text-2xl font-black mb-0.5">{s.value}</div>
            <div className="text-white/80 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-black text-gray-900 mb-4">Payout History</h3>
        <div className="flex flex-col gap-3">
          {PAYOUT_HISTORY.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-orange-200 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {p.status === 'paid' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">#{p.id}</p>
                  <p className="text-xs text-gray-500">{p.orders} orders · {p.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-gray-900">₹{p.amount.toLocaleString()}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${p.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {p.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-sm text-orange-700 flex items-start gap-3">
        <ArrowUp size={16} className="mt-0.5 flex-shrink-0" />
        <p>Payouts are processed every Friday. Ensure your bank account details are up to date in your profile settings.</p>
      </div>
    </div>
  );
}

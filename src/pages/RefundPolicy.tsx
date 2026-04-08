import { motion } from 'framer-motion';
import { RefreshCw, Check, X } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 fest-gradient rounded-2xl flex items-center justify-center">
            <RefreshCw size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Refund Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: November 2024</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h3 className="font-black text-green-800 mb-3 flex items-center gap-2"><Check size={16} className="text-green-600" /> Eligible for Refund</h3>
            <ul className="text-sm text-green-700 space-y-1.5">{['Damaged/defective products', 'Wrong item delivered', 'Missing items in order', 'Quality not as described', 'Return within 7 days'].map(i => <li key={i} className="flex items-start gap-2"><Check size={12} className="mt-0.5 flex-shrink-0" />{i}</li>)}</ul>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <h3 className="font-black text-red-800 mb-3 flex items-center gap-2"><X size={16} className="text-red-600" /> Not Eligible</h3>
            <ul className="text-sm text-red-700 space-y-1.5">{['Change of mind', 'Used/opened items', 'After 7 days of delivery', 'Customized products', 'Digital products'].map(i => <li key={i} className="flex items-start gap-2"><X size={12} className="mt-0.5 flex-shrink-0" />{i}</li>)}</ul>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: 'How to Request a Refund', body: 'To initiate a refund, log in to your account, go to My Orders, select the order, and click "Request Return". Fill in the reason and upload photos if required. Our team will review within 24-48 hours.' },
            { title: 'Refund Processing Time', body: 'Once approved, refunds are processed within 5-7 business days. The amount will be credited to your original payment method. UPI refunds are typically faster (1-2 days).' },
            { title: 'Exchange Policy', body: 'We offer exchanges for defective or wrong items. Contact us within 7 days of delivery. Exchange shipping is free for our fault; standard rates apply for other reasons.' },
            { title: 'Combo Bundle Refunds', body: 'For combo bundles, if one item is defective, we refund the proportional value of that item. Full bundle refunds are available only if all items are defective.' },
          ].map(s => (
            <div key={s.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-base font-black text-gray-900 mb-3">{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';

const RETURN_ELIGIBLE = ['Damaged or defective products', 'Wrong product delivered', 'Products not matching description', 'Missing items in combo bundles', 'Expired products (if applicable)', 'Quality issues verified by support team'];
const RETURN_INELIGIBLE = ['Products after 7-day return window', 'Used/consumed products', 'Products without original packaging', 'Customized/personalized items', 'Digital products', 'Perishable items (sweets, flowers)'];

const PROCESS_STEPS = [
  { step: 1, title: 'Raise a Request', desc: 'Login to your account, go to My Orders, select the order and click "Return/Refund".' },
  { step: 2, title: 'Verification', desc: 'Our team verifies your request within 24 hours. You may be asked to share photos of the product.' },
  { step: 3, title: 'Pickup Arranged', desc: 'Once approved, we arrange a free pickup from your delivery address within 2-3 business days.' },
  { step: 4, title: 'Quality Check', desc: 'Returned product undergoes quality inspection at our warehouse (2-3 business days).' },
  { step: 5, title: 'Refund Processed', desc: 'Refund is processed within 5-7 business days to your original payment method.' },
];

const REFUND_TIMELINES = [
  { method: 'UPI / Net Banking', timeline: '3-5 business days' },
  { method: 'Credit / Debit Card', timeline: '5-7 business days' },
  { method: 'Wallet (PhonePe, Paytm)', timeline: '1-3 business days' },
  { method: 'FestiveRetail Credits', timeline: 'Instant' },
  { method: 'Cash on Delivery', timeline: '7-10 business days (NEFT)' },
];

const fadeInUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };

export default function RefundPolicy() {
  return (
    <div>
      <section className="py-16 bg-gradient-to-br from-green-600 to-teal-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><FiRefreshCw className="text-3xl" /></div>
            <h1 className="text-4xl font-black mb-3">Return & Refund Policy</h1>
            <p className="text-white/80">Last updated: October 2024</p>
            <p className="text-white/80 mt-3 text-lg">We offer hassle-free returns and fast refunds. Your satisfaction is our priority.</p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Overview */}
        <motion.div {...fadeInUp} className="bg-green-50 border border-green-200 rounded-2xl p-7 mb-10 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">7-Day Easy Returns</h2>
          <p className="text-gray-600">Return most products within 7 days of delivery for a full refund. No questions asked for quality issues.</p>
        </motion.div>

        {/* Eligible / Not eligible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div {...fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiCheck className="text-green-500" /> Return Eligible</h3>
            <ul className="flex flex-col gap-2">{RETURN_ELIGIBLE.map(i => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><FiCheck className="text-green-500 mt-0.5 flex-shrink-0" />{i}</li>
            ))}</ul>
          </motion.div>
          <motion.div {...fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiX className="text-red-500" /> Not Eligible for Return</h3>
            <ul className="flex flex-col gap-2">{RETURN_INELIGIBLE.map(i => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><FiX className="text-red-400 mt-0.5 flex-shrink-0" />{i}</li>
            ))}</ul>
          </motion.div>
        </div>

        {/* Return process */}
        <motion.div {...fadeInUp} className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Return Process</h2>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 to-teal-500" />
            <div className="flex flex-col gap-6">
              {PROCESS_STEPS.map(s => (
                <motion.div key={s.step} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: s.step * 0.08 }}
                  className="flex gap-5 items-start">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{s.step}</div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Refund timelines */}
        <motion.div {...fadeInUp} className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Refund Timelines</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Payment Method</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-gray-700">Refund Timeline</th>
                </tr>
              </thead>
              <tbody>
                {REFUND_TIMELINES.map((r, i) => (
                  <tr key={r.method} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-3.5 text-sm text-gray-700">{r.method}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-green-600">{r.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Special cases */}
        {[
          { title: 'Combo Bundle Returns', content: 'For combo bundles, all items must be returned together in original packaging for a full refund. Partial returns from combos are evaluated case-by-case and may result in partial refunds based on individual item values.' },
          { title: 'Damaged in Transit', content: 'If your order arrives damaged, please: Take photos/videos immediately, report within 24 hours of delivery, do not discard packaging, and contact support@festiveretail.com. Replacement or full refund is processed within 3-5 business days.' },
          { title: 'Festival-Specific Policy', content: 'For festival-themed products (Diwali, Holi, etc.), return requests must be raised at least 7 days before the festival date. Post-festival returns for festive items may be subject to a 20% restocking fee.' },
          { title: 'Vendor-Specific Returns', content: 'Some vendors may have specific return policies that are more flexible than our standard policy. These are clearly mentioned on the product page. In case of conflict, the more favorable policy for the customer applies.' },
        ].map((s, i) => (
          <motion.div key={s.title} {...fadeInUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4">
            <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}

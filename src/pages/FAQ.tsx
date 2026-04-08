import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FAQ_CATEGORIES = {
  'Orders & Delivery': [
    { q: 'How do I track my order?', a: 'After placing an order, you will receive a confirmation email with tracking details. Login to your account, navigate to My Orders, and click Track Order for real-time updates. You can also use the tracking number on our logistics partner\'s website.' },
    { q: 'What is the delivery timeline?', a: 'Standard delivery: 3-5 business days for most cities. Express delivery: 1-2 business days (available for select cities). Same-day delivery is available in Pune, Mumbai, Delhi, Bangalore, and Hyderabad for orders placed before 12 PM.' },
    { q: 'Do you deliver PAN India?', a: 'Yes! FestiveRetail delivers to 19,000+ pin codes across India. Remote areas may have extended delivery times of 7-10 business days. Check delivery availability during checkout by entering your pin code.' },
    { q: 'Can I change my delivery address after ordering?', a: 'Address changes are possible within 1 hour of placing the order, provided the order hasn\'t been processed. Contact support immediately at support@festiveretail.com or call 1800 123 4567.' },
    { q: 'What if my order is delayed?', a: 'If your order is delayed beyond the estimated date, you will receive an automatic notification. You can also check the updated ETA in your order tracking. Significant delays (5+ days) qualify for delivery fee refund.' },
  ],
  'Payments': [
    { q: 'What payment methods are accepted?', a: 'We accept UPI (GPay, PhonePe, Paytm), all major credit/debit cards, net banking, EMI (on cards above ₹3000), and Cash on Delivery (available for orders below ₹10,000 in select cities).' },
    { q: 'Is it safe to save my card/UPI details?', a: 'Yes, completely safe. FestiveRetail uses PCI-DSS compliant payment processing. Card details are tokenized and never stored on our servers. UPI details are managed by your bank/UPI app.' },
    { q: 'Why was my payment declined?', a: 'Possible reasons: Insufficient balance, card limit exceeded, bank server issues, or suspicious activity flag. Try: Different payment method, contacting your bank, or clearing app cache. Contact support if issue persists.' },
    { q: 'Can I pay in installments?', a: 'EMI options are available on credit cards for orders above ₹3,000 (3/6/9/12 month options). No-cost EMI is available on select cards. EMI charges (if applicable) are displayed before payment confirmation.' },
  ],
  'Products & Combos': [
    { q: 'Are all products authentic?', a: 'Yes! All vendors on FestiveRetail go through a verification process. Products are quality-checked before being listed. We have a zero-tolerance policy for counterfeit products. Report any concerns to quality@festiveretail.com.' },
    { q: 'How are combo bundles assembled?', a: 'Combo bundles are assembled by our expert curation team based on festive traditions, complementary products, and maximum value. Some combos are pre-packaged by vendors with beautiful festive packaging.' },
    { q: 'Can I customize a combo bundle?', a: 'Yes! Use our "Build Your Bundle" feature on the Combos page. Select products from different categories and we\'ll combine them with special pricing. Minimum 3 items required for custom bundle pricing.' },
    { q: 'What if a product in my combo is out of stock?', a: 'If a component is out of stock, we will: Notify you via email/SMS, offer a substitute of equal or higher value, or provide a partial refund for the unavailable component. You can choose or cancel the entire order.' },
  ],
  'Account & Profile': [
    { q: 'How do I create an account?', a: 'Click Register on the top right. Fill in your name, email, and password. Verify your email (check spam folder). You\'re ready to shop! Registration is free and takes less than 2 minutes.' },
    { q: 'Can I have multiple addresses?', a: 'Yes! You can save up to 10 delivery addresses in your account under Address Management. Set a default address for faster checkout. Addresses can be added, edited, or deleted at any time.' },
    { q: 'How do I delete my account?', a: 'To delete your account, email privacy@festiveretail.com with subject "Account Deletion Request". We\'ll process it within 7 business days. Note: Active orders must be completed before account deletion.' },
  ],
  'Vendors': [
    { q: 'How do I register as a vendor?', a: 'Register on FestiveRetail and select "Vendor" as your account type. Complete your profile with business details, GST number, bank account, and product catalog. Our team reviews and approves within 24-48 hours.' },
    { q: 'What commission does FestiveRetail charge?', a: 'We charge a platform fee of 5-15% based on product category. Combo listings have special commission structures. There are no listing fees. Payouts are processed weekly to your registered bank account.' },
    { q: 'What are the requirements to sell on FestiveRetail?', a: 'Requirements: Valid GST registration (for businesses), bank account for payouts, product catalog with minimum 5 products, ability to ship within 48 hours of order, and compliance with our quality standards.' },
  ],
};

const CATEGORY_COLORS = ['bg-orange-100 text-orange-600 border-orange-200', 'bg-blue-100 text-blue-600 border-blue-200', 'bg-purple-100 text-purple-600 border-purple-200', 'bg-green-100 text-green-600 border-green-200', 'bg-pink-100 text-pink-600 border-pink-200'];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState(Object.keys(FAQ_CATEGORIES)[0]);
  const [search, setSearch] = useState('');

  const toggleFaq = (key: string) => setOpenFaq(openFaq === key ? null : key);

  const allFaqs = Object.entries(FAQ_CATEGORIES).flatMap(([cat, items]) => items.map(i => ({ ...i, cat })));
  const filtered = search ? allFaqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : null;
  const displayFaqs = filtered || (FAQ_CATEGORIES as any)[activeCategory] || [];

  return (
    <div>
      <section className="py-16 fest-gradient text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black mb-3">Frequently Asked Questions</h1>
            <p className="text-white/80 text-lg mb-6">Find answers to the most common questions about FestiveRetail</p>
            <div className="relative max-w-lg mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/90 text-gray-800 placeholder-gray-400 rounded-xl focus:outline-none shadow-lg" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(FAQ_CATEGORIES).map((cat, i) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${activeCategory === cat && !search ? CATEGORY_COLORS[i % CATEGORY_COLORS.length] : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}
        {search && <p className="text-gray-500 mb-5">Found {(filtered?.length || 0)} results for "<strong className="text-gray-900">{search}</strong>"</p>}

        <div className="flex flex-col gap-3">
          {(search ? filtered || [] : (FAQ_CATEGORIES as any)[activeCategory] || []).map((item: any, i: number) => {
            const key = `${item.q}`;
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => toggleFaq(key)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-orange-50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm pr-4">{item.q}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === key ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {openFaq === key ? <FiMinus className="text-sm" /> : <FiPlus className="text-sm" />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === key && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-12 bg-orange-50 text-center">
        <div className="max-w-xl mx-auto px-4">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-5">Our support team is available 24/7 to help you</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const SECTIONS = [
  { title: '1. Acceptance of Terms', content: 'By accessing and using FestiveRetail\'s platform, mobile application, and services, you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services. These terms apply to all visitors, users, customers, vendors, and all others who access or use our services.' },
  { title: '2. Account Registration', content: 'To use certain features of FestiveRetail, you must register for an account. You agree to: Provide accurate, current, and complete information during registration, maintain and promptly update your account information, keep your password confidential and secure, notify us immediately of any unauthorized use of your account, accept responsibility for all activities that occur under your account, and not create accounts for other people without their consent.' },
  { title: '3. Products and Services', content: 'FestiveRetail acts as a marketplace connecting buyers and vendors. We make reasonable efforts to ensure product information is accurate, but: Product colors may vary due to screen settings, product descriptions are provided by vendors, prices are subject to change without prior notice, product availability is not guaranteed, and combo bundles are subject to component availability.' },
  { title: '4. Ordering and Payment', content: 'When you place an order on FestiveRetail: You enter into a contract with the vendor, not FestiveRetail, payment is processed securely through our payment partners, orders are confirmed only upon successful payment, FestiveRetail charges a platform fee from vendors (not customers), all prices are inclusive of applicable GST, and receipt of payment confirmation does not guarantee product availability.' },
  { title: '5. Vendor Terms', content: 'Vendors on FestiveRetail must: Provide accurate product information and images, maintain adequate inventory to fulfill orders, ship products within the committed timeframe, respond to customer queries within 24 hours, maintain product quality as described, comply with all applicable laws and regulations, and not engage in deceptive pricing or practices.' },
  { title: '6. Intellectual Property', content: 'All content on FestiveRetail, including but not limited to logos, product images, written content, design elements, and software, is the property of FestiveRetail or its content suppliers. You may not reproduce, distribute, modify, or create derivative works without express written permission.' },
  { title: '7. Limitation of Liability', content: 'FestiveRetail shall not be liable for: Indirect, incidental, or consequential damages, loss of profits or business opportunities, vendor delays or product issues beyond our control, third-party service failures, force majeure events including natural disasters and pandemics, and unauthorized account access due to user negligence. Our maximum liability shall not exceed the order value.' },
  { title: '8. Governing Law', content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Pune, Maharashtra. We encourage resolution through our internal dispute resolution process before pursuing legal action. Consumer disputes may be addressed through the National Consumer Dispute Redressal Commission (NCDRC).' },
];

export default function TermsConditions() {
  return (
    <div>
      <section className="py-16 fest-gradient-dark text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4"><FileText size={26} /></div>
            <h1 className="text-4xl font-black mb-3">Terms & Conditions</h1>
            <p className="text-gray-400">Last updated: October 2024 · Effective immediately</p>
            <p className="text-gray-300 mt-3 text-lg">Please read these terms carefully before using FestiveRetail's services.</p>
          </motion.div>
        </div>
      </section>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col gap-8">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h2>
              <p className="text-gray-600 leading-relaxed">{s.content}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

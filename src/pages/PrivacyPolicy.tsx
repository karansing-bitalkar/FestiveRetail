import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const SECTIONS = [
  { title: '1. Information We Collect', content: 'We collect information you provide directly to us, including when you create an account, place an order, or contact our support team. This includes: Full name, email address, phone number, shipping and billing addresses, payment information (processed securely via payment gateway), order history and preferences, device information and usage data for improving our services, and communication preferences.' },
  { title: '2. How We Use Your Information', content: 'Your information is used to: Process and fulfill your orders efficiently, send order confirmations and tracking updates, provide customer support and respond to inquiries, personalize your shopping experience and recommend relevant products, send promotional emails and festive offers (you can opt out anytime), improve our platform based on usage patterns, comply with legal obligations and prevent fraud, and facilitate vendor transactions and payouts.' },
  { title: '3. Information Sharing', content: 'We do not sell your personal information. We may share data with: Trusted vendors who fulfill your orders (only necessary details), payment processors for secure transaction handling, logistics partners for order delivery, analytics providers to improve our services (anonymized data), legal authorities when required by law, and business partners with your explicit consent.' },
  { title: '4. Data Security', content: 'FestiveRetail employs industry-standard security measures to protect your data: SSL/TLS encryption for all data transmission, PCI-DSS compliant payment processing, regular security audits and vulnerability assessments, access controls and employee data handling training, secure data storage with encryption at rest, and regular backups to prevent data loss.' },
  { title: '5. Cookies and Tracking', content: 'We use cookies and similar technologies to enhance your experience: Essential cookies for site functionality, preference cookies to remember your settings, analytics cookies to understand usage patterns, marketing cookies for personalized advertising, and third-party cookies from Google Analytics, Facebook Pixel, etc. You can manage cookie preferences through your browser settings.' },
  { title: '6. Your Rights', content: 'Under applicable data protection laws, you have the right to: Access your personal data held by us, correct inaccurate information, request deletion of your data (right to be forgotten), object to processing of your data, data portability (receive your data in a machine-readable format), and withdraw consent at any time. To exercise these rights, contact privacy@festiveretail.com.' },
  { title: '7. Data Retention', content: 'We retain your personal information for as long as necessary to: Fulfill the purposes outlined in this policy, comply with legal and regulatory requirements (typically 7 years for financial records), resolve disputes and enforce agreements, and maintain your account if active. When data is no longer needed, it is securely deleted or anonymized.' },
  { title: '8. Contact Us', content: 'For privacy-related concerns, data requests, or to exercise your rights, contact our Data Protection Officer at: Email: privacy@festiveretail.com, Address: FestiveRetail Pvt. Ltd., 4th Floor, Tech Park, Baner, Pune 411045, Phone: +91 20 1234 5678. We will respond to all requests within 30 days.' },
];

export default function PrivacyPolicy() {
  return (
    <div>
      <section className="py-16 fest-gradient text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"><Shield size={28} /></div>
            <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
            <p className="text-white/80">Last updated: October 2024</p>
            <p className="text-white/80 mt-3 text-lg">Your privacy matters to us. This policy explains how FestiveRetail collects, uses, and protects your personal information.</p>
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

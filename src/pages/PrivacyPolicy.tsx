import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 fest-gradient rounded-2xl flex items-center justify-center">
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-gray-500 text-sm">Last updated: November 2024</p>
          </div>
        </div>
        <div className="prose prose-gray max-w-none space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: '1. Information We Collect', body: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, phone number, delivery addresses, and payment information.' },
            { title: '2. How We Use Your Information', body: 'We use the information we collect to process your orders, send you order confirmations and updates, provide customer service, send promotional communications (with your consent), and improve our platform.' },
            { title: '3. Information Sharing', body: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with vendors to fulfill your orders and with logistics partners for delivery.' },
            { title: '4. Data Security', body: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
            { title: '5. Cookies', body: 'We use cookies and similar tracking technologies to track activity on our platform and store certain information to enhance your browsing experience.' },
            { title: '6. Your Rights', body: 'You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us at privacy@festiveretail.com.' },
            { title: '7. Contact Us', body: 'If you have any questions about this Privacy Policy, please contact us at privacy@festiveretail.com or write to us at FestiveRetail, 4th Floor, Tech Park, Baner, Pune 411045.' },
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

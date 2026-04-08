import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 fest-gradient rounded-2xl flex items-center justify-center">
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Terms & Conditions</h1>
            <p className="text-gray-500 text-sm">Last updated: November 2024</p>
          </div>
        </div>
        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          {[
            { title: '1. Acceptance of Terms', body: 'By accessing and using FestiveRetail, you accept and agree to be bound by the terms and provisions of this agreement.' },
            { title: '2. Use of Platform', body: 'You agree to use FestiveRetail only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the platform.' },
            { title: '3. Account Registration', body: 'To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials.' },
            { title: '4. Products and Pricing', body: 'All prices are in Indian Rupees (INR). We reserve the right to modify prices at any time. Product descriptions are provided by vendors and we do not guarantee their accuracy.' },
            { title: '5. Orders and Payment', body: 'By placing an order, you confirm that you are authorized to use the payment method. All transactions are processed securely through our payment gateway partners.' },
            { title: '6. Intellectual Property', body: 'All content on FestiveRetail, including text, graphics, logos, and images, is the property of FestiveRetail and protected by applicable intellectual property laws.' },
            { title: '7. Limitation of Liability', body: 'FestiveRetail shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform.' },
            { title: '8. Governing Law', body: 'These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Pune, Maharashtra.' },
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

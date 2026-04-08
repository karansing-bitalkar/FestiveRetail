import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiCheck } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { BsWhatsapp } from 'react-icons/bs';
import { MdSupportAgent } from 'react-icons/md';
import { toast } from 'sonner';

const CONTACT_REASONS = ['Order Issue', 'Product Query', 'Vendor Registration', 'Returns & Refunds', 'Bulk/Corporate Orders', 'Partnership', 'Technical Support', 'Other'];
const OFFICES = [
  { city: 'Pune (HQ)', address: '4th Floor, Tech Park, Baner, Pune 411045', phone: '+91 20 1234 5678', email: 'pune@festiveretail.com' },
  { city: 'Mumbai', address: '12th Floor, Business Hub, BKC, Mumbai 400051', phone: '+91 22 1234 5678', email: 'mumbai@festiveretail.com' },
  { city: 'Delhi', address: '8th Floor, Cyber City, Gurugram 122002', phone: '+91 11 1234 5678', email: 'delhi@festiveretail.com' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', reason: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast.success('Message sent! We\'ll get back to you within 24 hours.', { icon: '✉️' });
    }, 1200);
  };

  return (
    <div>
      {/* Hero */}
      <section className="py-20 fest-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(5)].map((_, i) => <div key={i} className="absolute w-80 h-80 rounded-full border border-white" style={{ left: `${i*25-10}%`, top: '-30%' }} />)}</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><HiSparkles /> Get In Touch</div>
            <h1 className="text-5xl font-black mb-4">We'd Love to Hear from You!</h1>
            <p className="text-xl text-white/80">Our support team is available 24/7 to help you have the best festive shopping experience.</p>
          </motion.div>
        </div>
      </section>

      {/* Quick support */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FiPhone, label: 'Call Us', value: '1800 123 4567', sub: 'Toll Free · Mon–Sun', color: 'bg-orange-50 text-orange-500' },
            { icon: FiMail, label: 'Email Us', value: 'support@festiveretail.com', sub: 'Reply within 4 hours', color: 'bg-blue-50 text-blue-500' },
            { icon: BsWhatsapp, label: 'WhatsApp', value: '+91 98765 43210', sub: 'Quick responses', color: 'bg-green-50 text-green-500' },
            { icon: MdSupportAgent, label: 'Live Chat', value: 'Available 24/7', sub: 'Instant support', color: 'bg-purple-50 text-purple-500' },
          ].map((c, i) => (
            <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center mx-auto mb-3`}><c.icon className="text-xl" /></div>
              <div className="font-semibold text-gray-900 text-sm mb-0.5">{c.label}</div>
              <div className="text-gray-700 text-sm font-medium">{c.value}</div>
              <div className="text-gray-400 text-xs">{c.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact form + info */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-7">Fill out the form and we'll get back to you within 24 hours.</p>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck className="text-green-500 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">Thank you for reaching out. Our team will respond within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', reason: '', message: '' }); }}
                  className="px-6 py-2.5 fest-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-all text-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How can we help?</label>
                  <select name="reason" value={form.reason} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
                    <option value="">Select a reason</option>
                    {CONTACT_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={4} placeholder="Describe your query in detail..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="py-4 fest-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-60">
                  <FiSend /> {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info side */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-black text-gray-900 mb-2">Our Offices</h2>
            <p className="text-gray-500 mb-7">Visit us at any of our locations across India</p>
            <div className="flex flex-col gap-4 mb-8">
              {OFFICES.map(o => (
                <div key={o.city} className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3">{o.city}</h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-start gap-2 text-gray-600"><FiMapPin className="text-orange-400 mt-0.5 flex-shrink-0" />{o.address}</div>
                    <div className="flex items-center gap-2 text-gray-600"><FiPhone className="text-orange-400 flex-shrink-0" />{o.phone}</div>
                    <div className="flex items-center gap-2 text-gray-600"><FiMail className="text-orange-400 flex-shrink-0" />{o.email}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <h4 className="font-bold mb-3 flex items-center gap-2"><FiClock className="text-orange-400" /> Support Hours</h4>
              <div className="flex flex-col gap-2 text-sm">
                {[['Mon – Fri', '9:00 AM – 9:00 PM IST'], ['Saturday', '10:00 AM – 8:00 PM IST'], ['Sunday', '10:00 AM – 6:00 PM IST'], ['Festival Days', '24/7 Emergency Support']].map(([d, t]) => (
                  <div key={d} className="flex justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-400">{d}</span>
                    <span className="font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ quick */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Quick Answers</h2>
            <p className="text-gray-500">Most common questions answered instantly</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: 'How do I track my order?', a: 'Login to your account, go to My Orders and click on Track. You\'ll see real-time updates.' },
              { q: 'What is the return policy?', a: 'We offer 7-day hassle-free returns for most products. Check our Refund Policy for details.' },
              { q: 'How can I become a vendor?', a: 'Register as a vendor on our platform. Our team will review and approve your account within 24-48 hours.' },
              { q: 'Do you offer bulk/corporate orders?', a: 'Yes! Contact our corporate team at corporate@festiveretail.com for special pricing and branding.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-1.5 text-sm">Q: {item.q}</h4>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="py-16 fest-gradient text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-black mb-3">Connect on Social Media</h2>
            <p className="text-white/80 mb-8">Follow us for festive tips, exclusive deals, and behind-the-scenes content</p>
            <div className="flex justify-center gap-4">
              {['Instagram', 'Facebook', 'Twitter', 'YouTube', 'WhatsApp'].map(s => (
                <button key={s} className="px-5 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl font-medium text-sm hover:bg-white/30 transition-all">{s}</button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

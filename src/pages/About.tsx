import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Sparkles, BadgeCheck, Leaf, Star } from 'lucide-react';

const TEAM = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', desc: 'Visionary entrepreneur with 10+ years in e-commerce' },
  { name: 'Priya Sharma', role: 'Head of Curation', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', desc: 'Expert in festive trends and product curation' },
  { name: 'Rahul Desai', role: 'CTO', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', desc: 'Tech innovator building scalable platforms' },
  { name: 'Ananya Patel', role: 'Head of Vendor Relations', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', desc: 'Building strong vendor partnerships across India' },
];

const VALUES = [
  { icon: Heart, title: 'Customer First', desc: 'Every decision we make starts with "how does this help our customers celebrate better?"', color: 'bg-red-100 text-red-500' },
  { icon: BadgeCheck, title: 'Authenticity', desc: 'We verify every product and vendor to ensure you receive only genuine, quality items.', color: 'bg-blue-100 text-blue-500' },
  { icon: Leaf, title: 'Sustainability', desc: 'We prioritize eco-friendly products and sustainable packaging for a greener future.', color: 'bg-green-100 text-green-500' },
  { icon: Star, title: 'Excellence', desc: 'From product quality to customer service, we strive for excellence in everything.', color: 'bg-yellow-100 text-yellow-500' },
];

const MILESTONES = [
  { year: '2021', event: 'FestiveRetail Founded', desc: 'Started with just 50 products and a dream to redefine festive shopping.' },
  { year: '2022', event: '10K Customers', desc: 'Crossed 10,000 happy customers milestone within first year.' },
  { year: '2023', event: 'Vendor Network', desc: 'Onboarded 500+ verified vendors from across India.' },
  { year: '2024', event: '2L+ Orders', desc: 'Delivered over 2 lakh orders across 500+ cities in India.' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="py-24 fest-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(5)].map((_, i) => <div key={i} className="absolute w-80 h-80 rounded-full border border-white" style={{ right: `${i*20}%`, top: '-30%' }} />)}</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><Sparkles size={14} /> Our Story</div>
            <h1 className="text-5xl font-black mb-4">Celebrating India's Festivals<br />One Order at a Time</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">Born from the love of festivals, FestiveRetail is India's most trusted festive shopping platform, connecting buyers with the finest festive products from across the country.</p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeInUp}>
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-3 block">Our Mission</span>
            <h2 className="text-4xl font-black text-gray-900 mb-5">Making Every Celebration Unforgettable</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              We believe that festivals are more than just dates on a calendar — they're opportunities to connect, celebrate, and create memories. FestiveRetail was born from the vision to make every festive occasion special through thoughtfully curated products and seamless shopping experiences.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our platform bridges the gap between talented local artisans, vendors, and millions of customers who seek authentic, quality festive products. We're not just a marketplace — we're a celebration partner.
            </p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-all">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '2L+', l: 'Happy Customers', color: 'from-orange-400 to-red-500' },
                { v: '500+', l: 'Verified Vendors', color: 'from-purple-400 to-pink-500' },
                { v: '5000+', l: 'Products Listed', color: 'from-blue-400 to-cyan-500' },
                { v: '500+', l: 'Cities Covered', color: 'from-green-400 to-teal-500' },
              ].map(s => (
                <div key={s.l} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white text-center`}>
                  <div className="text-4xl font-black mb-1">{s.v}</div>
                  <div className="text-white/80 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Our Core Values</h2>
            <p className="text-gray-500 text-lg">What drives us every single day</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
                <div className={`w-14 h-14 ${v.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <v.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Our Journey</h2>
          <p className="text-gray-500">From a small startup to India's festive shopping leader</p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-pink-500" />
          <div className="flex flex-col gap-10">
            {MILESTONES.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`flex-1 bg-white rounded-2xl p-5 shadow-sm border border-orange-50 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="text-orange-500 font-bold text-sm mb-1">{m.year}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{m.event}</h3>
                  <p className="text-gray-500 text-sm">{m.desc}</p>
                </div>
                <div className="w-10 h-10 fest-gradient rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">{i + 1}</div>
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-500">The passionate people behind FestiveRetail</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm text-center hover:shadow-md transition-shadow group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-gray-900 mb-0.5">{m.name}</h3>
                <div className="text-orange-500 text-sm font-medium mb-2">{m.role}</div>
                <p className="text-gray-500 text-xs">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm font-medium mb-6 uppercase tracking-wider">Featured In</p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Economic Times', 'YourStory', 'Inc42', 'Mint', 'Business Standard'].map(pub => (
              <div key={pub} className="text-gray-400 font-bold text-lg hover:text-orange-500 transition-colors cursor-pointer">{pub}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-20 fest-gradient text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl font-black mb-4">Join the FestiveRetail Family 🎉</h2>
            <p className="text-white/80 text-lg mb-8">Be part of India's fastest-growing festive shopping community</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-8 py-4 bg-white text-orange-500 rounded-2xl font-bold hover:bg-orange-50 transition-all shadow-lg">Create Account</Link>
              <Link to="/contact" className="px-8 py-4 bg-white/20 border border-white/30 text-white rounded-2xl font-bold hover:bg-white/30 transition-all">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}

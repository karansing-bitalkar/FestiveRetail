import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Check, Sparkles, Zap, Gift } from 'lucide-react';
import { COMBO_PRODUCTS, PRODUCTS } from '@/constants/data';
import { toast } from 'sonner';

const COMBO_REASONS = [
  'Save 30–50% vs buying individually',
  'Beautifully curated by experts',
  'Premium packaging included',
  'Free personalized greeting card',
  'Same-day dispatch available',
  'Easy returns within 7 days',
];

const CUSTOM_BUNDLES = [
  { title: 'Build Your Own Diwali Hamper', steps: ['Choose sweets box', 'Add puja items', 'Select dry fruits', 'Pick decoration items'], color: 'from-orange-500 to-yellow-400', emoji: '🪔' },
  { title: 'Custom Wedding Gift Bundle', steps: ['Select shagun envelope', 'Add premium gift', 'Choose wrapping', 'Add personal message'], color: 'from-red-500 to-pink-500', emoji: '💍' },
  { title: 'Corporate Festive Kit', steps: ['Choose quantity (5–500)', 'Select products', 'Add company branding', 'Schedule delivery'], color: 'from-purple-500 to-blue-500', emoji: '🏢' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Combos() {
  const handleAddCombo = (name: string) => toast.success(`${name} added to cart!`);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 fest-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(5)].map((_, i) => <div key={i} className="absolute w-96 h-96 rounded-full border border-orange-400" style={{ left: `${i*20-5}%`, top: '-30%' }} />)}</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm font-medium mb-5">
              <Zap size={14} /> Our #1 USP — Exclusive Combo Bundles
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Festive <span className="fest-text-gradient">Combo Offers</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Save up to 50% with our expertly curated festive bundles. Everything you need for the perfect celebration, packed together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {['Save 30–50%', 'Premium Packaging', 'Free Card', 'Fast Delivery'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm">
                  <Check size={13} className="text-green-400" /> {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Combos */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Why Choose Our Combos?</h2>
            <p className="text-gray-500">The smarter way to gift this festive season</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {COMBO_REASONS.map((r, i) => (
              <motion.div key={r} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={13} className="text-green-500" />
                </div>
                <span className="text-gray-700 text-sm font-medium">{r}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Hot Combo Deals</h2>
          <p className="text-gray-500">Handpicked bundles for maximum value</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COMBO_PRODUCTS.map((product, i) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-orange-50 transition-all group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 left-3 fest-gradient text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles size={11} /> COMBO -{discount}% OFF
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">{product.rating}</span>
                    <span className="text-white/70 text-xs">({product.reviews})</span>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">{product.festival}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-2 mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-black text-orange-500">₹{product.price.toLocaleString()}</div>
                      <div className="text-gray-400 text-sm line-through">₹{product.originalPrice.toLocaleString()}</div>
                    </div>
                    <div className="bg-green-100 text-green-600 text-sm font-bold px-3 py-1 rounded-full">
                      Save ₹{(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  </div>
                  <button onClick={() => handleAddCombo(product.name)}
                    className="w-full py-3 fest-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                    <Gift size={16} /> Add to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom bundles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Build Custom Bundles</h2>
            <p className="text-gray-500">Create your own personalized festive bundle</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOM_BUNDLES.map((bundle, i) => (
              <motion.div key={bundle.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 bg-gradient-to-br ${bundle.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>{bundle.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-3">{bundle.title}</h3>
                <ol className="flex flex-col gap-2 mb-5">
                  {bundle.steps.map((s, j) => (
                    <li key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className={`w-5 h-5 bg-gradient-to-br ${bundle.color} text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>{j + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                <button onClick={() => toast.info('Custom bundle builder coming soon!')}
                  className={`w-full py-2.5 bg-gradient-to-br ${bundle.color} text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all`}>
                  Start Building
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings stats */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">{[...Array(4)].map((_, i) => <div key={i} className="absolute w-48 h-48 rounded-full border border-white" style={{ right: `${i*20}%`, bottom: '-30%' }} />)}</div>
          <motion.div {...fadeInUp} className="relative">
            <h2 className="text-3xl font-black mb-3">Total Savings This Season</h2>
            <p className="text-white/80 mb-8">Our customers have saved over ₹2 crore by choosing combos vs individual products!</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[{ v: '₹2Cr+', l: 'Customer Savings' }, { v: '50%', l: 'Max Discount' }, { v: '10K+', l: 'Combos Sold' }, { v: '4.9★', l: 'Avg Rating' }].map(s => (
                <div key={s.l} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-black mb-1">{s.v}</div>
                  <div className="text-white/70 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* More products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-1">Also Available in Combos</h2>
              <p className="text-gray-500">Individual products that pair perfectly together</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-orange-400 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-all text-sm">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{p.name}</h4>
                  <div className="text-orange-500 font-bold">₹{p.price.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Combo FAQs</h2>
        </motion.div>
        <div className="flex flex-col gap-4">
          {[
            { q: 'Can I customize combo products?', a: 'Yes! Many of our combos allow substitutions. Use the custom bundle builder or contact support.' },
            { q: 'Are combos available for corporate gifting?', a: 'Absolutely! We offer bulk pricing for 5–500+ units with custom branding options.' },
            { q: 'What is the return policy for combos?', a: 'All combos come with a 7-day return policy. Individual items from opened combos follow standard policy.' },
            { q: 'Can I order combos for different festivals?', a: 'Yes! You can mix and match from different festival collections in a single order.' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white border border-orange-100 rounded-xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-1.5">Q: {item.q}</h4>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

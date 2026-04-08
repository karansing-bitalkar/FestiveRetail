import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, Truck, Shield, RefreshCw, Headphones,
  Sparkles, Zap, Tag, Gift
} from 'lucide-react';
import { FESTIVALS } from '@/constants/data';
import ProductCard from '@/components/features/ProductCard';
import { useProductStore } from '@/stores/productStore';
import heroBanner from '@/assets/hero-banner.jpg';

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', rating: 5, text: "Amazing quality products! The Diwali hamper I ordered was beautifully packed and delivered on time. Will definitely order again!", avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80' },
  { name: 'Amit Patel', city: 'Ahmedabad', rating: 5, text: "The combo offer for Holi was fantastic. My whole family loved the organic colors. Great value for money!", avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80' },
  { name: 'Sneha Kulkarni', city: 'Pune', rating: 5, text: "Best festive shopping platform! The wedding gift bundle was absolutely perfect for my cousin's wedding.", avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&q=80' },
  { name: 'Raj Mehta', city: 'Delhi', rating: 4, text: "Excellent customer service and fast delivery. The packaging is premium and products are genuine.", avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80' },
];

const FESTIVAL_BANNERS = [
  {
    name: 'Diwali',
    subtitle: 'Festival of Lights',
    color: 'from-orange-500 to-yellow-400',
    count: '200+ Products',
    img: 'https://images.unsplash.com/photo-1604413191066-4dd20bedf486?w=600&h=400&fit=crop&q=85',
  },
  {
    name: 'Holi',
    subtitle: 'Festival of Colors',
    color: 'from-pink-500 to-purple-500',
    count: '150+ Products',
    img: 'https://images.unsplash.com/photo-1576037728058-fe7c5fff1c0e?w=600&h=400&fit=crop&q=85',
  },
  {
    name: 'Weddings',
    subtitle: 'Celebrate Love',
    color: 'from-red-500 to-pink-500',
    count: '180+ Products',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop&q=85',
  },
  {
    name: 'Ganesh',
    subtitle: 'Chaturthi Special',
    color: 'from-yellow-500 to-orange-500',
    count: '100+ Products',
    img: 'https://images.unsplash.com/photo-1567591370372-b0e6ff654a6f?w=600&h=400&fit=crop&q=85',
  },
];

const STATS = [
  { label: 'Happy Customers', value: '2L+' },
  { label: 'Products', value: '5000+' },
  { label: 'Festivals Covered', value: '20+' },
  { label: 'Cities Delivered', value: '500+' },
];

const CATEGORY_FILTERS = ['All', 'Diwali', 'Holi', 'Wedding', 'Birthday', 'Ganesh Chaturthi', 'Navratri', 'Christmas'];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Home() {
  const { products } = useProductStore();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const featuredProducts = activeFilter === 'All'
    ? products.filter(p => !p.isCombo).slice(0, 8)
    : products.filter(p => !p.isCombo && p.festival === activeFilter).slice(0, 8);

  const comboProducts = products.filter(p => p.isCombo).slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBanner}
            alt="Festive celebration"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/40 rounded-full text-orange-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Sparkles size={14} /> Celebrate Every Festival in Style
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Shop the<br />
              <span className="fest-text-gradient">Celebration!</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
              India's #1 festive shopping destination. Curated combo bundles, premium gift hampers, and exclusive collections for every celebration.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 fest-gradient text-white rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition-all glow-orange">
                <Gift size={18} /> Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/combos" className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 border border-white/30 text-white rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/25 transition-all">
                <Sparkles size={18} /> View Combos
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 mt-10">
              {STATS.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-white/60 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 bg-orange-400/60 rounded-full"
            style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </section>

      {/* ── Festival Banners ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Shop by Festival</h2>
          <p className="text-gray-500 text-lg">Find perfect products for every celebration</p>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FESTIVAL_BANNERS.map((f, i) => (
            <motion.div key={f.name}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} whileHover={{ scale: 1.03 }}>
              <Link to={`/shop?festival=${encodeURIComponent(f.name)}`}
                className="relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                style={{ aspectRatio: '4/3' }}>
                <img src={f.img} alt={f.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-black text-xl mb-0.5">{f.name}</h3>
                  <p className="text-white/80 text-sm mb-2">{f.subtitle}</p>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">{f.count}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS with LIVE Filter ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Featured Products</h2>
            <p className="text-gray-500">
              Handpicked bestsellers for the season
              {activeFilter !== 'All' && <span className="ml-2 text-orange-500 font-semibold">· {activeFilter}</span>}
            </p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 px-6 py-3 border-2 border-orange-400 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-all">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Festival Category Quick-Filter Row */}
        <motion.div {...fadeInUp} className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8">
          {CATEGORY_FILTERS.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeFilter === cat
                  ? 'fest-gradient text-white shadow-md'
                  : 'bg-white border-2 border-orange-200 text-orange-500 hover:bg-orange-50'
              }`}>
              {cat}
            </button>
          ))}
        </motion.div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-20 bg-orange-50/50 rounded-3xl border-2 border-dashed border-orange-200">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products yet for {activeFilter}</h3>
            <p className="text-gray-500">Vendors are adding products. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── COMBO OFFERS USP (live from store) ── */}
      <section className="py-16 fest-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute w-64 h-64 rounded-full border border-white/20" style={{ left: `${i * 20}%`, top: `${i % 2 === 0 ? -20 : 30}%` }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm font-medium mb-4">
              <Zap size={14} /> Our USP — Exclusive Combo Bundles
            </div>
            <h2 className="text-4xl font-black text-white mb-3">Combo Offers</h2>
            <p className="text-gray-400 text-lg">Save more with our curated festive bundles</p>
          </motion.div>

          {comboProducts.length === 0 ? (
            <div className="text-center py-16 bg-white/10 rounded-3xl border border-white/20">
              <div className="text-5xl mb-3">📦</div>
              <p className="text-gray-400 text-lg">Combo bundles coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comboProducts.map((product, i) => (
                <motion.div key={product.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl overflow-hidden hover:border-orange-400/40 transition-all">
                  <div className="relative overflow-hidden" style={{ height: 200 }}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute top-3 left-3 fest-gradient text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Sparkles size={11} /> COMBO DEAL
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white font-bold text-lg leading-tight">{product.name}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-orange-400">₹{product.price.toLocaleString()}</span>
                        <span className="ml-2 text-gray-500 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                      </div>
                      <Link to="/combos" className="px-4 py-2 fest-gradient text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all">View Deal</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-8 flex justify-center gap-4 flex-wrap">
            <Link to="/combos" className="inline-flex items-center gap-2 px-8 py-4 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all">
              View All Combo Offers <ArrowRight size={18} />
            </Link>
            <Link to="/combos/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 border border-white/30 text-white rounded-2xl font-bold hover:bg-white/25 transition-all">
              <Gift size={18} /> Build Custom Bundle
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Why FestiveRetail?</h2>
            <p className="text-gray-500 text-lg">We make every celebration special</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Delivery', desc: 'Free shipping on orders above ₹999', color: 'bg-orange-100 text-orange-500' },
              { icon: Shield, title: '100% Authentic', desc: 'All products are quality verified', color: 'bg-green-100 text-green-500' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free return policy', color: 'bg-blue-100 text-blue-500' },
              { icon: Headphones, title: '24/7 Support', desc: 'Round the clock customer support', color: 'bg-purple-100 text-purple-500' },
            ].map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 mb-3">What Our Customers Say</h2>
          <p className="text-gray-500 text-lg">Over 2 lakh happy customers across India</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.city}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── All Festivals Scroll ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">All Festivals We Cover</h2>
          </motion.div>
          <div className="flex flex-wrap gap-3 justify-center">
            {FESTIVALS.map((f, i) => (
              <motion.div key={f}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }}>
                <button
                  onClick={() => { setActiveFilter(f); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate(`/shop?festival=${encodeURIComponent(f)}`); }}
                  className="px-5 py-2.5 bg-white border-2 border-orange-200 text-orange-500 rounded-full font-medium hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm">
                  {f}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 fest-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute w-64 h-64 rounded-full border border-white"
              style={{ right: `${i * 15}%`, bottom: `-50%` }}
              animate={{ rotate: 360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }} />
          ))}
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5">Ready to Celebrate?</h2>
            <p className="text-white/80 text-xl mb-8 leading-relaxed">
              Join 2 lakh+ happy customers and make every festival special with FestiveRetail's exclusive collections.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg">
                Create Free Account <ArrowRight size={20} />
              </Link>
              <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 border border-white/40 text-white rounded-2xl font-bold text-lg hover:bg-white/30 transition-all">
                <Tag size={20} /> Browse Offers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── App download promo ── */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Download FestiveRetail App <Sparkles className="text-orange-400" size={20} />
            </h3>
            <p className="text-gray-400">Get exclusive app-only deals and track your orders in real-time</p>
          </div>
          <div className="flex gap-3">
            <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all text-center">
              <div className="text-xs text-gray-400">Coming Soon</div>
              <div className="font-bold">App Store</div>
            </div>
            <div className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all text-center">
              <div className="text-xs text-gray-400">Coming Soon</div>
              <div className="font-bold">Play Store</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Headphones, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import ProductCard from '@/components/features/ProductCard';
import heroBanner from '@/assets/hero-banner.jpg';

const FESTIVALS = [
  { name: 'Diwali', img: 'https://images.unsplash.com/photo-1666244454829-7f0889ec5783?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpd2FsaSUyMGZlc3RpdmFsfGVufDB8fDB8fHww', color: 'from-orange-600 to-red-600', desc: 'Diyas, Puja Sets & Hampers' },
  { name: 'Holi', img: "https://images.unsplash.com/photo-1603228254119-e6a4d095dc59?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9saXxlbnwwfHwwfHx8MA%3D%3D", color: 'from-pink-500 to-purple-600', desc: 'Colors, Water Guns & Gulal' },
  { name: 'Cristmas', img: "https://images.unsplash.com/photo-1670747135013-428f1c35836a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y3Jpc3RtYXMlMjB0cmVlfGVufDB8fDB8fHww", color: 'from-yellow-500 to-orange-600', desc: 'Gifts, Décor & Favours' },
  { name: 'Ganesh', img: 'https://images.unsplash.com/photo-1567878673047-0451c851056e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2FuZXNofGVufDB8fDB8fHww ', color: 'from-blue-500 to-indigo-600', desc: 'Idols, Puja Items & Décor' },
];

const CATEGORY_FILTERS = ['All', 'Diwali', 'Holi', 'Wedding', 'Ganesh Chaturthi', 'Birthday', 'Christmas'];

const FEATURES = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹999', color: 'bg-orange-100 text-orange-500' },
  { icon: Shield, title: '100% Authentic', desc: 'Verified vendors only', color: 'bg-blue-100 text-blue-500' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '7-day hassle-free', color: 'bg-green-100 text-green-500' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here to help', color: 'bg-purple-100 text-purple-500' },
];

export default function Home() {
  const { products } = useProductStore();
  const [activeFilter, setActiveFilter] = useState('All');

  const featuredProducts = activeFilter === 'All'
    ? products.slice(0, 8)
    : products.filter(p => p.festival === activeFilter).slice(0, 8);

  const comboProducts = products.filter(p => p.isCombo).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img src={heroBanner} alt="Festive Shopping Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles size={14} /> India's #1 Festive Shopping Platform
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
              Celebrate Every<br /><span className="fest-text-gradient">Festival</span> in Style
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Curated festive collections for Diwali, Holi, Weddings and more. Exclusive combo bundles with up to 40% off.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="flex items-center gap-2 px-7 py-4 fest-gradient text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg text-sm">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/combos" className="flex items-center gap-2 px-7 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold rounded-2xl hover:bg-white/30 transition-all text-sm">
                <Gift size={16} /> Explore Combos
              </Link>
            </div>
            <div className="flex gap-6 mt-8">
              {[{ v: '2L+', l: 'Customers' }, { v: '500+', l: 'Vendors' }, { v: '5000+', l: 'Products' }].map(s => (
                <div key={s.l} className="text-center">
                  <div className="text-2xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-white/60">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3">
                <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <f.icon size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Categories */}
      <section className="py-16 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Shop by Festival</h2>
            <p className="text-gray-500">Curated collections for every celebration</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FESTIVALS.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={`/shop?festival=${f.name}`} className="group block relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-black text-lg">{f.name}</h3>
                    <p className="text-xs text-white/70 mb-2">{f.desc}</p>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full flex items-center gap-1 w-fit">
                      Shop Now <ChevronRight size={10} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-1">Featured Products</h2>
              <p className="text-gray-500">Fresh picks from our festive collection</p>
            </div>
            <Link to="/shop" className="flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category quick filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8">
            {CATEGORY_FILTERS.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeFilter === f ? 'fest-gradient text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Combo Offers */}
      {comboProducts.length > 0 && (
        <section className="py-16 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2 text-orange-400 mb-2"><Sparkles size={16} /> <span className="text-sm font-semibold">Exclusive Bundles</span></div>
                <h2 className="text-4xl font-black text-white mb-1">Combo Offers</h2>
                <p className="text-gray-400">Hand-picked bundles for maximum value</p>
              </div>
              <Link to="/combos" className="flex items-center gap-2 text-orange-400 font-bold hover:text-orange-300 transition-colors">
                View All Combos <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {comboProducts.map((product, i) => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link to={`/product/${product.id}`} className="group block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all">
                      <div className="aspect-square relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full">-{discount}%</div>
                      </div>
                      <div className="p-4">
                        <p className="text-orange-400 text-xs font-semibold mb-1">{product.festival}</p>
                        <h3 className="font-black text-white mb-3 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl font-black text-orange-400">₹{product.price.toLocaleString()}</span>
                            <span className="text-gray-500 text-sm line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-gray-300 text-xs">{product.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      {/* <section className="py-20 fest-gradient text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Ready to Celebrate?</h2>
            <p className="text-white/80 text-lg mb-8">Join 2 lakh+ happy customers who celebrate every festival with FestiveRetail.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-2xl font-black hover:bg-orange-50 transition-all shadow-lg">
              Create Free Account <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}

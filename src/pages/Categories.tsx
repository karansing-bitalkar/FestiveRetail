import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const CATEGORY_DATA = [
  { name: 'Diwali', icon: '🪔', count: 245, desc: 'Diyas, rangoli, gifts, sweets & more', color: 'from-orange-400 to-yellow-400', image: 'https://images.unsplash.com/photo-1605197584847-12af0e3c0f15?w=600&q=80' },
  { name: 'Holi', icon: '🎨', count: 178, desc: 'Colors, pichkaris, gulal & accessories', color: 'from-pink-500 to-purple-500', image: 'https://images.unsplash.com/photo-1615811648503-479d0a9d2c10?w=600&q=80' },
  { name: 'Weddings', icon: '💍', count: 312, desc: 'Shagun, gifts, decorations & trousseau', color: 'from-red-500 to-pink-500', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80' },
  { name: 'Ganesh Chaturthi', icon: '🐘', count: 134, desc: 'Idols, puja items, modak & more', color: 'from-yellow-400 to-orange-500', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80' },
  { name: 'Navratri', icon: '💃', count: 89, desc: 'Garba, dandiya, costumes & jewelry', color: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1595250268003-a43e84ee8fb7?w=600&q=80' },
  { name: 'Birthday', icon: '🎂', count: 201, desc: 'Balloons, cakes, gifts & decorations', color: 'from-blue-500 to-cyan-400', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80' },
  { name: 'Christmas', icon: '🎄', count: 156, desc: 'Trees, gifts, decorations & more', color: 'from-green-500 to-emerald-400', image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80' },
  { name: 'Eid', icon: '🌙', count: 143, desc: 'Gifts, sweets, decorations & attire', color: 'from-teal-500 to-green-500', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80' },
];

const POPULAR_TAGS = ['Eco-Friendly', 'Handmade', 'Premium', 'Budget-Friendly', 'Corporate Gifts', 'Customizable', 'Organic', 'Limited Edition'];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function Categories() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 fest-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(5)].map((_, i) => <div key={i} className="absolute w-80 h-80 rounded-full border border-white" style={{ left: `${i*25}%`, top: '-30%' }} />)}</div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><HiSparkles /> All Categories</div>
            <h1 className="text-5xl font-black mb-4">Shop by Category</h1>
            <p className="text-xl text-white/80">Browse our curated collections for every festival and occasion</p>
          </motion.div>
        </div>
      </section>

      {/* Category grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORY_DATA.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}>
              <Link to="/shop" className="block group overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <div className="text-5xl mb-2">{cat.icon}</div>
                    <h3 className="text-xl font-black">{cat.name}</h3>
                    <span className="text-white/80 text-sm">{cat.count} products</span>
                  </div>
                </div>
                <div className="bg-white p-4 border-t-0">
                  <p className="text-gray-600 text-sm">{cat.desc}</p>
                  <div className="flex items-center gap-1 text-orange-500 text-sm font-semibold mt-2 group-hover:gap-2 transition-all">
                    Shop Now <FiArrowRight />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular tags */}
      <section className="py-12 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Popular Tags</h2>
            <p className="text-gray-500">Find exactly what you're looking for</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {POPULAR_TAGS.map((tag, i) => (
              <motion.div key={tag} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.05 }}>
                <Link to="/shop" className="px-6 py-3 bg-white border-2 border-orange-200 text-orange-500 rounded-full font-semibold hover:border-orange-400 hover:shadow-md transition-all shadow-sm">{tag}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[{ v: '20+', l: 'Festival Categories' }, { v: '5000+', l: 'Products Listed' }, { v: '500+', l: 'Verified Vendors' }, { v: '2L+', l: 'Orders Delivered' }].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-4xl font-black fest-text-gradient mb-1">{s.v}</div>
              <div className="text-gray-500 text-sm">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">How FestiveRetail Works</h2>
            <p className="text-gray-500">Your complete festive shopping journey</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Browse Categories', desc: 'Explore 20+ festival categories', emoji: '🔍' },
              { step: '02', title: 'Choose Products', desc: 'Select singles or combo bundles', emoji: '🎁' },
              { step: '03', title: 'Checkout', desc: 'Fast, secure payment options', emoji: '💳' },
              { step: '04', title: 'Celebrate!', desc: 'Delivered to your doorstep', emoji: '🎉' },
            ].map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-4xl mb-3">{step.emoji}</div>
                <div className="text-xs font-bold text-orange-400 mb-1">STEP {step.step}</div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 fest-gradient text-center text-white">
        <div className="max-w-xl mx-auto px-4">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-black mb-3">Find Your Perfect Festive Gift</h2>
            <p className="text-white/80 mb-6">Browse thousands of curated festive products across all categories</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-2xl font-bold shadow-lg hover:bg-orange-50 transition-all">
              Explore All Products <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Seasonal highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeInUp} className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Seasonal Highlights</h2>
          <p className="text-gray-500">What's trending this festive season</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Diwali 2024 Specials', desc: 'Limited edition Diwali collections with exclusive bundles and premium packaging', color: 'bg-orange-100', badge: '🔥 Trending', img: 'https://images.unsplash.com/photo-1605197584847-12af0e3c0f15?w=500&q=80' },
            { title: 'Wedding Season Picks', desc: 'Curated collections for the wedding season. Perfect shagun and gift ideas', color: 'bg-pink-100', badge: '💍 Popular', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&q=80' },
            { title: 'New Arrivals', desc: 'Fresh products added daily. Be the first to shop the latest festive items', color: 'bg-purple-100', badge: '✨ New', img: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=500&q=80' },
          ].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative aspect-video overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">{item.badge}</div>
              </div>
              <div className={`${item.color} p-5`}>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.desc}</p>
                <Link to="/shop" className="text-orange-500 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">Shop Now <FiArrowRight /></Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

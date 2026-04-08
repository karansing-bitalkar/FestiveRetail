import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { name: 'Puja Items', icon: '🪔', festival: 'Diwali', products: 24, img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop&q=80', color: 'from-orange-500 to-red-500' },
  { name: 'Gift Hampers', icon: '🎁', festival: 'All Festivals', products: 18, img: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&h=400&fit=crop&q=80', color: 'from-pink-500 to-purple-500' },
  { name: 'Decoration', icon: '✨', festival: 'All Festivals', products: 32, img: 'https://images.unsplash.com/photo-1543877087-ebf71fde2be1?w=600&h=400&fit=crop&q=80', color: 'from-yellow-500 to-orange-500' },
  { name: 'Holi Special', icon: '🌈', festival: 'Holi', products: 21, img: 'https://images.unsplash.com/photo-1583361704493-d4d4d3c13a2f?w=600&h=400&fit=crop&q=80', color: 'from-green-400 to-blue-500' },
  { name: 'Wedding', icon: '💒', festival: 'Wedding', products: 15, img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop&q=80', color: 'from-red-500 to-pink-500' },
  { name: 'Idols & Figurines', icon: '🙏', festival: 'Ganesh Chaturthi', products: 12, img: 'https://images.unsplash.com/photo-1567591370654-f2a047ba62d0?w=600&h=400&fit=crop&q=80', color: 'from-purple-500 to-blue-500' },
  { name: 'Birthday', icon: '🎂', festival: 'Birthday', products: 19, img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&h=400&fit=crop&q=80', color: 'from-blue-500 to-cyan-500' },
  { name: 'Apparel', icon: '👗', festival: 'Navratri', products: 8, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=400&fit=crop&q=80', color: 'from-teal-500 to-green-500' },
];

export default function Categories() {
  return (
    <div>
      <section className="py-16 fest-gradient text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><Sparkles size={14} /> Browse by Category</div>
          <h1 className="text-5xl font-black mb-4">All Categories</h1>
          <p className="text-xl text-white/80">Find exactly what you need for every celebration</p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Link to={`/shop?category=${cat.name}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent`} />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-2xl mb-1 block">{cat.icon}</span>
                    <h3 className="font-black text-white text-lg leading-tight">{cat.name}</h3>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{cat.festival}</p>
                    <p className="font-bold text-gray-900 text-sm">{cat.products} products</p>
                  </div>
                  <div className={`w-9 h-9 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <ArrowRight size={16} className="text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

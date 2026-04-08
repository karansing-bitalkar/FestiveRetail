import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Check, Zap, Gift } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';

const COMBO_HIGHLIGHTS = [
  { icon: Gift, label: 'Premium Packaging', color: 'text-orange-500 bg-orange-50' },
  { icon: Star, label: 'Top Rated Bundles', color: 'text-yellow-500 bg-yellow-50' },
  { icon: Zap, label: 'Instant Savings', color: 'text-green-500 bg-green-50' },
  { icon: Check, label: '100% Authentic', color: 'text-blue-500 bg-blue-50' },
];

export default function Combos() {
  const { products } = useProductStore();
  const combos = products.filter(p => p.isCombo);

  return (
    <div>
      <section className="py-20 fest-gradient text-white text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-5"><Sparkles size={14} /> Exclusive Bundles</div>
          <h1 className="text-5xl font-black mb-4">Festive Combo Offers</h1>
          <p className="text-xl text-white/80 mb-8">Save more with our hand-picked festive bundles — up to 40% off!</p>
          <Link to="/combos/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-500 rounded-2xl font-black hover:bg-orange-50 transition-all shadow-lg">
            <Gift size={18} /> Build Your Bundle <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {COMBO_HIGHLIGHTS.map((h, i) => (
            <motion.div key={h.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${h.color}`}><h.icon size={18} /></div>
              <span className="font-bold text-gray-900 text-sm">{h.label}</span>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-8">Available Bundles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {(combos.length > 0 ? combos : products.slice(0, 3)).map((product, i) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full">-{discount}%</span>
                    <span className="fest-gradient text-white text-xs font-bold px-2.5 py-1 rounded-full">Bundle</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-orange-500 font-semibold mb-1">{product.festival}</div>
                  <h3 className="font-black text-gray-900 text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                    <span className="text-gray-400 line-through text-sm">₹{product.originalPrice.toLocaleString()}</span>
                    <span className="ml-auto text-xs text-green-600 font-bold">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
                  </div>
                  <Link to={`/product/${product.id}`} className="w-full py-3 fest-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-all">
                    <Gift size={15} /> View Bundle
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

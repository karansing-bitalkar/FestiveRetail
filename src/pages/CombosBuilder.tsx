import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, Sparkles, X, Zap } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import { toast } from 'sonner';

const DISCOUNT_TIERS = [
  { min: 3, max: 3, pct: 15, label: '15% Bundle Discount' },
  { min: 4, max: 4, pct: 18, label: '18% Bundle Discount' },
  { min: 5, max: 99, pct: 20, label: '20% Bundle Discount' },
];

export default function CombosBuilder() {
  const { products } = useProductStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [authGuard, setAuthGuard] = useState(false);
  const [added, setAdded] = useState(false);

  const toggleProduct = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id));
    } else if (selected.length < 5) {
      setSelected(prev => [...prev, id]);
    } else {
      toast.error('Maximum 5 products allowed in a bundle');
    }
  };

  const discount = DISCOUNT_TIERS.find(t => selected.length >= t.min && selected.length <= t.max)?.pct || 0;
  const label = DISCOUNT_TIERS.find(t => selected.length >= t.min && selected.length <= t.max)?.label || '';
  const selectedProducts = products.filter(p => selected.includes(p.id));
  const subtotal = selectedProducts.reduce((s, p) => s + p.price, 0);
  const savings = Math.floor(subtotal * discount / 100);
  const total = subtotal - savings;

  const handleAddBundle = () => {
    if (!isAuthenticated) { setAuthGuard(true); return; }
    if (selected.length < 3) { toast.error('Select at least 3 products to create a bundle'); return; }
    setAdded(true);
    toast.success(`Bundle added to cart! Saved ₹${savings.toLocaleString()}`);
    setTimeout(() => navigate('/dashboard/customer/cart'), 1500);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <Link to="/combos" className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:text-orange-500 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900">Build Your Bundle</h1>
              <p className="text-xs text-gray-500">Select 3–5 products for extra savings</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products list */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{products.length} products available</p>
                <div className="flex gap-2">
                  {DISCOUNT_TIERS.map(t => (
                    <div key={t.pct} className={`text-xs px-2.5 py-1 rounded-full font-bold ${selected.length >= t.min ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {t.min === t.max ? `${t.min} items` : `${t.min}+ items`}: {t.pct}% off
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map(p => {
                  const isSelected = selected.includes(p.id);
                  return (
                    <motion.div key={p.id} whileHover={{ y: -2 }}
                      className={`bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${isSelected ? 'border-orange-400 shadow-md' : 'border-gray-100 hover:border-orange-200'}`}
                      onClick={() => toggleProduct(p.id)}>
                      <div className="aspect-square relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500' : 'bg-white/80 border border-gray-200'}`}>
                          {isSelected ? <Check size={14} className="text-white" /> : <Plus size={14} className="text-gray-400" />}
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-orange-500 font-semibold mb-0.5">{p.festival}</p>
                        <p className="font-bold text-gray-900 text-xs line-clamp-2 mb-1">{p.name}</p>
                        <p className="font-black text-orange-500 text-sm">₹{p.price.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bundle summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles size={16} className="text-orange-500" /> Your Bundle
                  <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${selected.length >= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {selected.length}/5
                  </span>
                </h3>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-2 bg-gray-100 rounded-full mb-2">
                    <motion.div animate={{ width: `${Math.min((selected.length / 5) * 100, 100)}%` }} className={`h-full rounded-full transition-all ${selected.length >= 3 ? 'fest-gradient' : 'bg-gray-300'}`} />
                  </div>
                  <p className="text-xs text-gray-500">
                    {selected.length < 3 ? `Add ${3 - selected.length} more to unlock discount` : label}
                  </p>
                </div>

                {selectedProducts.length > 0 ? (
                  <div className="flex flex-col gap-2 mb-4 max-h-52 overflow-y-auto scrollbar-hide">
                    <AnimatePresence>
                      {selectedProducts.map(p => (
                        <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-orange-500 font-bold">₹{p.price.toLocaleString()}</p>
                          </div>
                          <button onClick={() => toggleProduct(p.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-6 text-center mb-4">
                    <p className="text-gray-400 text-sm">Select products to build your bundle</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 mb-4">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal.toLocaleString()}</span></div>
                  {savings > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center gap-1"><Zap size={12} /> Bundle Discount ({discount}%)</span>
                      <span className="text-green-600 font-bold">–₹{savings.toLocaleString()}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between text-base font-black border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <motion.span key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }} className="text-orange-500">₹{total.toLocaleString()}</motion.span>
                  </div>
                </div>

                <button onClick={handleAddBundle} disabled={selected.length < 3 || added}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${selected.length >= 3 ? 'fest-gradient text-white hover:opacity-90 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  {added ? <><Check size={16} /> Added to Cart!</> : <><ShoppingCart size={16} /> Add Bundle to Cart</>}
                </button>

                {selected.length >= 3 && savings > 0 && (
                  <p className="text-center text-xs text-green-600 font-bold mt-2">You save ₹{savings.toLocaleString()}!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthGuardModal isOpen={authGuard} onClose={() => setAuthGuard(false)} message="Please login to add bundle to cart" />
    </>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiMinus, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';
import { MdClose, MdStar } from 'react-icons/md';
import { BsGiftFill } from 'react-icons/bs';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import { Product } from '@/types';
import { toast } from 'sonner';
import { FESTIVALS } from '@/constants/data';

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;
const DISCOUNT_TIERS: Record<number, number> = { 3: 15, 4: 17, 5: 20 };

export default function CombosBuilder() {
  const { products } = useProductStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Product[]>([]);
  const [filterFestival, setFilterFestival] = useState('All');
  const [authModal, setAuthModal] = useState(false);
  const [added, setAdded] = useState(false);
  const [search, setSearch] = useState('');

  const regularProducts = products.filter(p => !p.isCombo);

  const filtered = regularProducts.filter(p => {
    if (filterFestival !== 'All' && p.festival !== filterFestival) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const subtotal = selected.reduce((s, p) => s + p.price, 0);
  const discountPct = DISCOUNT_TIERS[selected.length] ?? 0;
  const discountAmt = Math.round(subtotal * discountPct / 100);
  const finalPrice = subtotal - discountAmt;
  const originalTotal = selected.reduce((s, p) => s + p.originalPrice, 0);
  const totalSavings = originalTotal - finalPrice;

  const toggleProduct = (product: Product) => {
    const isIn = selected.some(p => p.id === product.id);
    if (isIn) {
      setSelected(selected.filter(p => p.id !== product.id));
    } else {
      if (selected.length >= MAX_ITEMS) {
        toast.error(`Maximum ${MAX_ITEMS} items allowed in a bundle.`);
        return;
      }
      setSelected([...selected, product]);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setAuthModal(true);
      return;
    }
    if (selected.length < MIN_ITEMS) {
      toast.error(`Please select at least ${MIN_ITEMS} products for a bundle.`);
      return;
    }
    setAdded(true);
    toast.success(`Custom bundle added to cart! Saved ₹${totalSavings.toLocaleString()}.`);
    setTimeout(() => setAdded(false), 2500);
  };

  const isSelected = (id: string) => selected.some(p => p.id === id);

  const progress = Math.min((selected.length / MIN_ITEMS) * 100, 100);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 pb-12">
        {/* Header */}
        <div className="fest-gradient py-10 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} className="absolute w-40 h-40 rounded-full border border-white"
                style={{ right: `${i * 20}%`, bottom: '-30%' }}
                animate={{ rotate: 360 }} transition={{ duration: 15 + i * 4, repeat: Infinity, ease: 'linear' }} />
            ))}
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <Link to="/combos" className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all">
                <FiArrowLeft />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-2"><BsGiftFill /> Combo Bundle Builder</h1>
                <p className="text-white/80 text-sm mt-0.5">Pick 3–5 items and save up to 20% instantly</p>
              </div>
            </div>

            {/* Discount tier info */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(DISCOUNT_TIERS).map(([count, pct]) => (
                <div key={count} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selected.length >= +count ? 'bg-white text-orange-500 shadow-md' : 'bg-white/20 text-white'}`}>
                  {selected.length >= +count ? <FiCheck className="text-green-500" /> : <HiLightningBolt />}
                  {count} items → {pct}% off
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product picker */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 mb-3"
              />
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {['All', ...FESTIVALS].map(f => (
                  <button key={f} onClick={() => setFilterFestival(f)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${filterFestival === f ? 'fest-gradient text-white' : 'bg-orange-50 text-orange-500 hover:bg-orange-100'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map((product) => {
                const sel = isSelected(product.id);
                const atMax = selected.length >= MAX_ITEMS && !sel;
                return (
                  <motion.div key={product.id} whileHover={!atMax ? { y: -3 } : {}}
                    onClick={() => !atMax && toggleProduct(product)}
                    className={`relative bg-white rounded-2xl overflow-hidden border-2 transition-all duration-200 ${sel ? 'border-orange-400 shadow-md shadow-orange-100' : atMax ? 'border-gray-100 opacity-50 cursor-not-allowed' : 'border-gray-100 hover:border-orange-300 cursor-pointer'}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {sel && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <FiCheck className="text-white text-base" />
                          </div>
                        </motion.div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] text-orange-500 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full font-semibold border border-orange-100">{product.festival}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight">{product.name}</p>
                      <div className="flex items-center gap-1 mb-1">
                        <MdStar className="text-yellow-400 text-xs" />
                        <span className="text-[10px] text-gray-500">{product.rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${sel ? 'bg-orange-500 border-orange-500' : 'border-gray-300'}`}>
                          {sel ? <FiMinus className="text-white text-xs" /> : <FiPlus className="text-gray-400 text-xs" />}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center py-12 text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="font-medium">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Bundle Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              <div className="fest-gradient p-4">
                <h3 className="font-black text-white flex items-center gap-2"><HiSparkles /> Your Bundle</h3>
                <p className="text-white/80 text-xs mt-0.5">{selected.length} / {MAX_ITEMS} items selected</p>
              </div>

              {/* Progress */}
              <div className="px-4 pt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Build progress</span>
                  <span className="font-bold text-orange-500">{selected.length} of {MIN_ITEMS} min</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className="h-full fest-gradient rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </div>
                {selected.length < MIN_ITEMS && (
                  <p className="text-[11px] text-orange-500 mt-1.5 font-medium">Add {MIN_ITEMS - selected.length} more item{MIN_ITEMS - selected.length > 1 ? 's' : ''} to unlock discount</p>
                )}
                {selected.length >= MIN_ITEMS && (
                  <p className="text-[11px] text-green-600 mt-1.5 font-medium flex items-center gap-1"><FiCheck /> {discountPct}% bundle discount unlocked!</p>
                )}
              </div>

              {/* Selected items */}
              <div className="p-4 flex flex-col gap-2 min-h-[120px]">
                <AnimatePresence>
                  {selected.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                      <BsGiftFill className="text-3xl text-orange-200 mb-2" />
                      <p className="text-xs text-gray-400 font-medium">Select products from the left to build your bundle</p>
                    </div>
                  ) : (
                    selected.map((p) => (
                      <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-2 bg-orange-50 rounded-xl">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-orange-500 font-bold">₹{p.price.toLocaleString()}</p>
                        </div>
                        <button onClick={() => toggleProduct(p)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                          <MdClose className="text-base" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Price breakdown */}
              {selected.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({selected.length} items)</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discountPct > 0 && (
                    <motion.div key={discountPct} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm">
                      <span className="text-green-600 font-medium flex items-center gap-1"><HiLightningBolt className="text-xs" /> Bundle {discountPct}% OFF</span>
                      <span className="text-green-600 font-bold">–₹{discountAmt.toLocaleString()}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between font-black text-base border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <motion.span key={finalPrice} animate={{ scale: [1.1, 1] }} className="text-orange-500">₹{finalPrice.toLocaleString()}</motion.span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="text-xs text-center text-green-700 bg-green-50 rounded-lg py-2 font-medium">
                      You save ₹{totalSavings.toLocaleString()} vs buying separately!
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="px-4 pb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={selected.length < MIN_ITEMS}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${selected.length >= MIN_ITEMS ? 'fest-gradient text-white hover:opacity-90 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {added ? (
                    <><FiCheck className="text-lg" /> Added to Cart!</>
                  ) : (
                    <><FiShoppingCart className="text-lg" /> Add Bundle to Cart{selected.length >= MIN_ITEMS ? ` · ₹${finalPrice.toLocaleString()}` : ''}</>
                  )}
                </button>
                {selected.length < MIN_ITEMS && (
                  <p className="text-center text-xs text-gray-400 mt-2">Select at least {MIN_ITEMS} products</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthGuardModal isOpen={authModal} onClose={() => setAuthModal(false)} action="add custom bundle to cart" />
    </>
  );
}

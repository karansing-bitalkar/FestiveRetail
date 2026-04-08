import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Star, ArrowRight, Zap } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { Product } from '@/types';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const STORAGE_KEY = 'festive_wishlist';

function loadWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveWishlist(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function Wishlist() {
  const { products: allProducts } = useProductStore();
  const [wishlistIds, setWishlistIds] = useState<string[]>(loadWishlist);
  const [removeItem, setRemoveItem] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Sync with localStorage whenever ids change
  useEffect(() => { saveWishlist(wishlistIds); }, [wishlistIds]);

  // Preload from store (default to first 5 if empty)
  useEffect(() => {
    if (wishlistIds.length === 0 && allProducts.length > 0) {
      const defaultIds = allProducts.slice(0, 5).map(p => p.id);
      setWishlistIds(defaultIds);
    }
  }, [allProducts]);

  const wishlistProducts: Product[] = wishlistIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleRemove = () => {
    setWishlistIds(ids => ids.filter(id => id !== removeItem));
    toast.success('Removed from wishlist');
    setRemoveItem(null);
  };

  const handleAddToCart = (product: Product) => {
    if (cartItems.includes(product.id)) {
      toast.info(`${product.name} is already in cart`);
      return;
    }
    setCartItems(prev => [...prev, product.id]);
    toast.success(`${product.name} moved to cart!`, { description: `₹${product.price.toLocaleString()}` });
  };

  const handleAddAll = () => {
    const newItems = wishlistProducts.filter(p => !cartItems.includes(p.id));
    if (newItems.length === 0) { toast.info('All items already in cart'); return; }
    setCartItems(prev => [...prev, ...newItems.map(p => p.id)]);
    toast.success(`${newItems.length} items added to cart!`);
  };

  const totalSavings = wishlistProducts.reduce((s, p) => s + (p.originalPrice - p.price), 0);
  const totalValue = wishlistProducts.reduce((s, p) => s + p.price, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">My Wishlist</h2>
          <p className="text-gray-500 text-sm">{wishlistProducts.length} items saved</p>
        </div>
        {wishlistProducts.length > 0 && (
          <button onClick={handleAddAll}
            className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-all shadow-md">
            <ShoppingCart size={15} /> Add All to Cart
          </button>
        )}
      </div>

      {/* Summary cards */}
      {wishlistProducts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Saved Items', value: wishlistProducts.length, color: 'bg-pink-50 text-pink-700', icon: Heart },
            { label: 'Total Value', value: `₹${totalValue.toLocaleString()}`, color: 'bg-orange-50 text-orange-700', icon: ShoppingCart },
            { label: 'You Save', value: `₹${totalSavings.toLocaleString()}`, color: 'bg-green-50 text-green-700', icon: Zap },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`${s.color} rounded-2xl p-4`}>
                <div className="flex items-center gap-2 mb-1"><Icon size={14} /><span className="text-xs font-medium">{s.label}</span></div>
                <div className="text-xl font-black">{s.value}</div>
              </div>
            );
          })}
        </div>
      )}

      {wishlistProducts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={32} className="text-pink-300" />
          </div>
          <h3 className="font-bold text-gray-700 text-lg mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400 text-sm mb-6">Browse our festive collection and save your favourite items</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-2xl font-semibold text-sm">
            Browse Shop <ArrowRight size={15} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {wishlistProducts.map((product, i) => {
              const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
              const inCart = cartItems.includes(product.id);
              return (
                <motion.div key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-orange-100/40 transition-all duration-300 group">

                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img src={product.image} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {discount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-black px-2 py-1 rounded-xl shadow-sm">-{discount}%</span>
                      )}
                      {product.isCombo && (
                        <span className="fest-gradient text-white text-xs font-bold px-2 py-1 rounded-xl shadow-sm flex items-center gap-1">
                          <Zap size={9} />COMBO
                        </span>
                      )}
                    </div>

                    {/* Remove heart */}
                    <button onClick={() => setRemoveItem(product.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md">
                      <Heart size={15} className="fill-red-400" />
                    </button>

                    {/* Festival tag */}
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">{product.festival}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      <span className="text-[10px] text-gray-400">({product.reviews})</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-orange-500 transition-colors">{product.name}</h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                      {discount > 0 && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-lg ml-auto">{discount}% off</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => handleAddToCart(product)}
                        className={`flex-1 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${inCart ? 'bg-green-500 text-white' : 'fest-gradient text-white hover:opacity-90'}`}>
                        <ShoppingCart size={13} />
                        {inCart ? 'In Cart ✓' : 'Move to Cart'}
                      </button>
                      <button onClick={() => setRemoveItem(product.id)}
                        className="w-10 h-10 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <ConfirmModal isOpen={!!removeItem} title="Remove from Wishlist" message="Remove this item from your wishlist?"
        confirmText="Remove" onConfirm={handleRemove} onCancel={() => setRemoveItem(null)} />
    </div>
  );
}

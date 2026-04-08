import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import { toast } from 'sonner';

export default function Wishlist() {
  const { products } = useProductStore();
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('festive_wishlist') || '[]')
  );

  useEffect(() => {
    const update = () => setWishlistIds(JSON.parse(localStorage.getItem('festive_wishlist') || '[]'));
    window.addEventListener('wishlist-updated', update);
    return () => window.removeEventListener('wishlist-updated', update);
  }, []);

  const wishlistItems = products.filter(p => wishlistIds.includes(p.id));

  const handleRemove = (id: string) => {
    const updated = wishlistIds.filter(wid => wid !== id);
    localStorage.setItem('festive_wishlist', JSON.stringify(updated));
    setWishlistIds(updated);
    window.dispatchEvent(new Event('wishlist-updated'));
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = (id: string) => {
    handleRemove(id);
    toast.success('Moved to cart!');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-black text-gray-900">My Wishlist</h2>
        <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-red-400" />
          </div>
          <h3 className="font-black text-gray-900 text-xl mb-2">Your Wishlist is Empty</h3>
          <p className="text-gray-500 mb-6">Browse our festive collection and save items you love!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            <Sparkles size={15} /> Browse Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">My Wishlist</h2>
          <p className="text-gray-500 text-sm">{wishlistItems.length} saved items</p>
        </div>
        <Link to="/shop" className="text-sm text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1 transition-colors">
          Continue Shopping <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-all group">
            <div className="relative aspect-square">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <button onClick={() => handleRemove(product.id)}
                className="absolute top-3 right-3 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md text-red-400 hover:text-red-600 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
            <div className="p-4">
              <div className="text-xs text-orange-500 font-semibold mb-1">{product.festival}</div>
              <Link to={`/product/${product.id}`} className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-orange-500 transition-colors block mb-3">
                {product.name}
              </Link>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              </div>
              <button onClick={() => handleMoveToCart(product.id)}
                className="w-full py-2.5 fest-gradient text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                <ShoppingCart size={14} /> Move to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

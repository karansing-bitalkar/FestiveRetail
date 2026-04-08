import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { PRODUCTS } from '@/constants/data';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(PRODUCTS.slice(0, 5));
  const [removeItem, setRemoveItem] = useState<string | null>(null);

  const handleRemove = () => {
    setWishlist(w => w.filter(p => p.id !== removeItem));
    toast.success('Removed from wishlist');
    setRemoveItem(null);
  };

  const handleAddToCart = (name: string) => toast.success(`${name} added to cart!`, { icon: '🛒' });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">My Wishlist</h2>
          <p className="text-gray-500 text-sm">{wishlist.length} items saved</p>
        </div>
        {wishlist.length > 0 && (
          <button onClick={() => { wishlist.forEach(p => handleAddToCart(p.name)); }} className="px-4 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
            Add All to Cart
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <FiHeart className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-400 text-sm">Save products you love for later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product, i) => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            return (
              <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>}
                  <button onClick={() => setRemoveItem(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-md">
                    <FiHeart className="text-sm fill-red-400" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs text-orange-500 font-medium">{product.festival}</span>
                  <h3 className="font-semibold text-gray-900 text-sm mt-0.5 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddToCart(product.name)}
                      className="flex-1 py-2 fest-gradient text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90 transition-all">
                      <FiShoppingCart /> Add to Cart
                    </button>
                    <button onClick={() => setRemoveItem(product.id)}
                      className="w-9 h-9 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ConfirmModal isOpen={!!removeItem} title="Remove from Wishlist" message="Remove this item from your wishlist?"
        confirmText="Remove" onConfirm={handleRemove} onCancel={() => setRemoveItem(null)} />
    </div>
  );
}

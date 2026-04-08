import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from './AuthGuardModal';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { isAuthenticated } = useAuth();
  const [authGuard, setAuthGuard] = useState(false);
  const [wishlisted, setWishlisted] = useState(() => {
    const wl = JSON.parse(localStorage.getItem('festive_wishlist') || '[]');
    return wl.includes(product.id);
  });
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the parent Link from triggering
    if (!isAuthenticated) { 
      setAuthGuard(true); 
      return; 
    }
    const wl: string[] = JSON.parse(localStorage.getItem('festive_wishlist') || '[]');
    const updated = wishlisted ? wl.filter((id) => id !== product.id) : [...wl, product.id];
    localStorage.setItem('festive_wishlist', JSON.stringify(updated));
    setWishlisted(!wishlisted);
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents navigation when clicking add to cart
    if (!isAuthenticated) { 
      setAuthGuard(true); 
      return; 
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-orange-200 transition-all duration-300 flex flex-col h-full"
      >
        {/* Main Product Link (Image Area) */}
        <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.isCombo && (
              <span className="fest-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={8} /> Combo
              </span>
            )}
          </div>

          {/* Actions - Now using div/button only, no nested Links */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0 z-10">
            <button
              type="button"
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-all ${
                wishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md text-gray-500 hover:text-orange-500 transition-colors pointer-events-none">
              <Eye size={15} />
            </div>
          </div>
        </Link>

        {/* Product Details Area */}
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs text-orange-500 font-semibold mb-1">{product.festival}</div>
          
          {/* Title Link is separate from the Image Link, which is fine */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-orange-500 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={11} 
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2 mb-3 mt-auto">
            <span className="text-lg font-black text-orange-500">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              addedToCart
                ? 'bg-green-500 text-white'
                : 'fest-gradient text-white hover:opacity-90'
            }`}
          >
            <ShoppingCart size={14} />
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>

      <AuthGuardModal
        isOpen={authGuard}
        onClose={() => setAuthGuard(false)}
        message="Please login to add items to cart or wishlist."
      />
    </>
  );
}
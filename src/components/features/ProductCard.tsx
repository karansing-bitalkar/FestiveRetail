import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from './AuthGuardModal';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [authModal, setAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('continue');
  const [wishlisted, setWishlisted] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const guardedAction = (action: string, callback: () => void) => {
    if (!isAuthenticated) {
      setAuthAction(action);
      setAuthModal(true);
      return;
    }
    callback();
  };

  const handleAddToCart = () => guardedAction('add to cart', () => {
    toast.success(`${product.name} added to cart!`, { description: `₹${product.price.toLocaleString()} × 1` });
  });

  const handleWishlist = () => guardedAction('add to wishlist', () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  });

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-100 transition-shadow duration-300 group"
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">-{discount}%</span>
            )}
            {product.isCombo && (
              <span className="fest-gradient text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                <Sparkles size={10} /> COMBO
              </span>
            )}
          </div>
          {/* Wishlist + View */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={`w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-md ${wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
            >
              <Heart size={14} className={wishlisted ? 'fill-red-500' : ''} />
            </button>
            <Link to={`/product/${product.id}`}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 transition-all shadow-md"
            >
              <Eye size={14} />
            </Link>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full py-2.5 fest-gradient text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart size={15} /> Add to Cart
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-medium">{product.festival}</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2 hover:text-orange-500 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-2">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-semibold text-gray-700">{product.rating || '4.5'}</span>
            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-orange-500">₹{product.price.toLocaleString()}</span>
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      <AuthGuardModal isOpen={authModal} onClose={() => setAuthModal(false)} action={authAction} />
    </>
  );
}

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw, Sparkles } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import ProductCard from '@/components/features/ProductCard';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', name: 'Priya S.', rating: 5, comment: 'Absolutely loved this product! Perfect for Diwali celebrations.', date: '2024-10-28', verified: true },
  { id: 'r2', name: 'Amit K.', rating: 4, comment: 'Good quality and fast delivery. Packaging was excellent.', date: '2024-10-20', verified: true },
  { id: 'r3', name: 'Meena P.', rating: 5, comment: 'Exceeded my expectations. Will definitely order again!', date: '2024-10-15', verified: false },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products } = useProductStore();
  const { isAuthenticated } = useAuth();
  const [authGuard, setAuthGuard] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [selectedImg, setSelectedImg] = useState(0);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      const wl = JSON.parse(localStorage.getItem('festive_wishlist') || '[]');
      setWishlisted(wl.includes(product.id));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Product not found</h2>
        <Link to="/shop" className="text-orange-500 font-semibold hover:text-orange-600">Back to Shop</Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const relatedProducts = products.filter(p => p.festival === product.festival && p.id !== product.id).slice(0, 4);
  const productImages = [product.image, product.image, product.image]; // Demo multiple images

  const handleAddToCart = () => {
    if (!isAuthenticated) { setAuthGuard(true); return; }
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    if (!isAuthenticated) { setAuthGuard(true); return; }
    const wl: string[] = JSON.parse(localStorage.getItem('festive_wishlist') || '[]');
    const updated = wishlisted ? wl.filter(wid => wid !== product.id) : [...wl, product.id];
    localStorage.setItem('festive_wishlist', JSON.stringify(updated));
    setWishlisted(!wishlisted);
    window.dispatchEvent(new Event('wishlist-updated'));
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) { setAuthGuard(true); return; }
    if (!newReview.comment.trim()) { toast.error('Please write a review'); return; }
    const review: Review = { id: Date.now().toString(), name: 'You', rating: newReview.rating, comment: newReview.comment, date: new Date().toISOString().split('T')[0], verified: true };
    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 5, comment: '' });
    toast.success('Review submitted!');
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link to="/shop" className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8 font-medium">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="rounded-3xl overflow-hidden aspect-square mb-4 bg-gray-100">
              <img src={productImages[selectedImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3">
              {productImages.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-orange-400' : 'border-gray-200 hover:border-orange-300'}`}>
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="text-sm text-orange-500 font-semibold mb-2">{product.festival} · {product.category}</div>
            <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(+avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="font-bold text-gray-900">{avgRating}</span>
              <span className="text-gray-500 text-sm">({reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-black text-orange-500">₹{product.price.toLocaleString()}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              {discount > 0 && <span className="bg-red-100 text-red-600 text-sm font-black px-2.5 py-1 rounded-full">-{discount}%</span>}
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart}
                className="flex-1 py-4 fest-gradient text-white rounded-2xl font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleWishlist}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${wishlisted ? 'bg-red-500 text-white' : 'border-2 border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500'}`}>
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Delivery', sub: 'Above ₹999' },
                { icon: Shield, label: 'Authentic', sub: 'Verified vendor' },
                { icon: RefreshCw, label: '7-day Return', sub: 'Easy returns' },
              ].map(f => (
                <div key={f.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                  <f.icon size={18} className="text-orange-500 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-gray-900">{f.label}</p>
                  <p className="text-[10px] text-gray-500">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Customer Reviews ({reviews.length})</h2>

          <div className="bg-orange-50 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-5xl font-black text-orange-500">{avgRating}</span>
              <div>
                <div className="flex mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className={i < Math.floor(+avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Based on {reviews.length} reviews</p>
              </div>
            </div>
          </div>

          {/* Write review */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-black text-gray-900 mb-4">Write a Review</h3>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} onClick={() => setNewReview(r => ({ ...r, rating: i + 1 }))}
                  className={`w-8 h-8 flex items-center justify-center transition-all ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                  <Star size={20} fill="currentColor" />
                </button>
              ))}
            </div>
            <textarea value={newReview.comment} onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))} rows={3}
              placeholder="Share your experience with this product..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm resize-none mb-3" />
            <button onClick={handleSubmitReview} className="px-6 py-2.5 fest-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all">
              Submit Review
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {reviews.slice(0, 5).map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm">{review.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{review.name}</span>
                        {review.verified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><Check size={9} /> Verified</span>}
                      </div>
                      <p className="text-xs text-gray-400">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Related Products</h2>
              <Link to="/shop" className="text-sm text-orange-500 font-semibold hover:text-orange-600 flex items-center gap-1">View All <Sparkles size={12} /></Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <AuthGuardModal isOpen={authGuard} onClose={() => setAuthGuard(false)} />
    </>
  );
}

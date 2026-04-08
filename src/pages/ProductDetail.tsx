import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, ArrowLeft, Share2, Check,
  ChevronLeft, ChevronRight, Truck, ShieldCheck, RotateCcw,
  Sparkles, BadgeCheck, Send, User
} from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import ProductCard from '@/components/features/ProductCard';
import { toast } from 'sonner';

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  avatar?: string;
}

const SEED_REVIEWS: Review[] = [
  { id: 'r1', name: 'Priya S.', rating: 5, comment: 'Absolutely loved this product! Perfect for the festive season. Quality is top-notch and packaging was beautiful.', date: '2024-10-20', verified: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80' },
  { id: 'r2', name: 'Amit P.', rating: 4, comment: 'Great product, fast delivery. The combo value is amazing — much better than buying individually.', date: '2024-10-18', verified: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80' },
  { id: 'r3', name: 'Sneha K.', rating: 5, comment: 'Gifted this to my family — they loved it! Will definitely buy again next festival season.', date: '2024-10-15', verified: false },
  { id: 'r4', name: 'Raj M.', rating: 3, comment: 'Good quality, took a few extra days to arrive. But worth the wait overall.', date: '2024-10-10', verified: true, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&q=80' },
];

const RATING_LABELS: Record<number, string> = { 1: 'Terrible', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent' };

function StarRating({ rating, onRate, interactive = false, size = 18 }: { rating: number; onRate?: (r: number) => void; interactive?: boolean; size?: number }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type="button"
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'}>
          <Star size={size}
            className={`transition-colors ${s <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-gray-500 w-12 text-right">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full bg-yellow-400 rounded-full" />
      </div>
      <span className="text-gray-400 w-6">{count}</span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProductStore();

  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">This product may have been removed.</p>
        <Link to="/shop" className="px-6 py-3 fest-gradient text-white rounded-xl font-semibold">Back to Shop</Link>
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const images = [
    product.image,
    `https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&h=600&fit=crop&q=80`,
    `https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop&q=80`,
  ];
  const related = products.filter((p) => p.festival === product.festival && p.id !== id).slice(0, 4);

  // Live average rating
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const ratingDist = [5, 4, 3, 2, 1].map(n => ({ label: `${n} ★`, count: reviews.filter(r => r.rating === n).length }));

  const guardedAction = (action: string, cb: () => void) => {
    if (!isAuthenticated) { setAuthAction(action); setAuthModal(true); return; }
    cb();
  };

  const handleAddToCart = () => guardedAction('add to cart', () => {
    setAddedToCart(true);
    toast.success(`${product.name} × ${qty} added to cart!`, { description: `Total: ₹${(product.price * qty).toLocaleString()}` });
    setTimeout(() => setAddedToCart(false), 2000);
  });

  const handleWishlist = () => guardedAction('save to wishlist', () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  });

  const handleBuyNow = () => guardedAction('checkout', () => navigate('/checkout'));

  const handleSubmitReview = () => {
    if (!isAuthenticated) { setAuthAction('submit a review'); setAuthModal(true); return; }
    if (newRating === 0) { toast.error('Please select a star rating.'); return; }
    if (!newComment.trim() || newComment.trim().length < 10) { toast.error('Please write at least 10 characters.'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const review: Review = {
        id: `r${Date.now()}`,
        name: user?.name ?? 'Customer',
        rating: newRating,
        comment: newComment.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: true,
      };
      setReviews(prev => [review, ...prev]);
      setNewRating(0);
      setNewComment('');
      setShowReviewForm(false);
      setSubmitting(false);
      toast.success('Review submitted! Thank you for your feedback.');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/home" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-orange-500 transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </div>

      {/* Main section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.img key={activeImg} src={images[activeImg]} alt={product.name}
                initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }} className="w-full h-full object-cover" />
            </AnimatePresence>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl shadow-md">-{discount}% OFF</div>
            )}
            {product.isCombo && (
              <div className="absolute top-4 right-4 fest-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                <Sparkles size={12} /> COMBO
              </div>
            )}
            <button onClick={() => setActiveImg(a => a > 0 ? a - 1 : images.length - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center shadow-md hover:bg-white transition-all hover:scale-105">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setActiveImg(a => a < images.length - 1 ? a + 1 : 0)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-2xl flex items-center justify-center shadow-md hover:bg-white transition-all hover:scale-105">
              <ChevronRight size={18} />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-2 h-2 rounded-full transition-all ${activeImg === i ? 'bg-orange-500 w-5' : 'bg-white/70'}`} />
              ))}
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-orange-400 shadow-md' : 'border-gray-200 hover:border-orange-300'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{product.festival}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3 leading-tight">{product.name}</h1>

          {/* Rating summary */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={Math.round(avgRating)} size={16} />
            <span className="font-bold text-gray-900 text-sm">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-4xl font-black text-orange-500">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">{discount}% OFF</span>
              </>
            )}
          </div>
          {discount > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-5 text-sm text-green-700 font-medium">
              You save ₹{(product.originalPrice - product.price).toLocaleString()} on this product
            </div>
          )}

          <p className="text-gray-600 leading-relaxed mb-6 text-[15px]">{product.description}</p>

          {/* Feature trio */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { Icon: Truck, label: 'Free Shipping', sub: 'Orders ₹999+' },
              { Icon: ShieldCheck, label: 'Verified', sub: 'Authentic Product' },
              { Icon: RotateCcw, label: '7-Day Return', sub: 'Easy Returns' },
            ].map(f => (
              <div key={f.label} className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-3 text-center border border-orange-100">
                <f.Icon size={20} className="text-orange-500 mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-800">{f.label}</div>
                <div className="text-[10px] text-gray-500">{f.sub}</div>
              </div>
            ))}
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-500 transition-all shadow-sm text-lg">–</button>
              <span className="w-10 text-center font-black text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-500 transition-all shadow-sm text-lg">+</button>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${product.stock < 10 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'}`}>
              {product.stock < 10 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-base ${addedToCart ? 'bg-green-500 text-white' : 'fest-gradient text-white hover:opacity-90'} shadow-md`}>
              {addedToCart ? <><Check size={18} /> Added to Cart!</> : <><ShoppingCart size={18} /> Add to Cart</>}
            </motion.button>
            <button onClick={handleWishlist}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}>
              <Heart size={20} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 text-gray-400 flex items-center justify-center hover:border-blue-300 hover:text-blue-500 transition-all">
              <Share2 size={20} />
            </button>
          </div>
          <button onClick={handleBuyNow}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all text-base">
            Buy Now · ₹{(product.price * qty).toLocaleString()}
          </button>
        </div>
      </div>

      {/* ═══ REVIEWS SECTION ═══ */}
      <div className="mb-16">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h2 className="text-2xl font-black text-gray-900">Customer Reviews</h2>
          <button onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-2xl font-semibold text-sm hover:opacity-90 transition-all shadow-md">
            <Star size={14} /> Write a Review
          </button>
        </div>

        {/* Rating summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Big score */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-3xl p-6 flex flex-col items-center justify-center border border-orange-100">
            <div className="text-7xl font-black text-orange-500 mb-2">{avgRating.toFixed(1)}</div>
            <StarRating rating={Math.round(avgRating)} size={22} />
            <p className="text-gray-500 text-sm mt-2">{reviews.length} verified reviews</p>
          </div>
          {/* Distribution */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center gap-2">
            {ratingDist.map(r => (
              <RatingBar key={r.label} label={r.label} count={r.count} total={reviews.length} />
            ))}
          </div>
        </div>

        {/* Write review form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl p-6 border-2 border-orange-200 shadow-sm mb-8 overflow-hidden">
              <h3 className="font-bold text-gray-900 mb-5">Share Your Experience</h3>
              <div className="flex flex-col gap-4">
                {/* Star picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                  <div className="flex items-center gap-4">
                    <StarRating rating={newRating} onRate={setNewRating} interactive size={28} />
                    {newRating > 0 && (
                      <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-semibold text-orange-500">{RATING_LABELS[newRating]}</motion.span>
                    )}
                  </div>
                </div>
                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review *</label>
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={4}
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-400 text-sm resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{newComment.length}/500 characters (min 10)</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSubmitReview} disabled={submitting}
                    className="flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all disabled:opacity-60">
                    {submitting
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                      : <Send size={14} />}
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                  <button onClick={() => setShowReviewForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-semibold hover:bg-gray-200 transition-all">Cancel</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {reviews.slice(0, 5).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {r.avatar ? (
                      <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-2xl object-cover flex-shrink-0 border-2 border-orange-100" />
                    ) : (
                      <div className="w-11 h-11 fest-gradient rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        <User size={18} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-sm">{r.name}</span>
                        {r.verified && <BadgeCheck size={14} className="text-green-500" />}
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={13} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.verified ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                    {r.verified ? '✓ Verified Purchase' : 'Unverified'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">More {product.festival} Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <AuthGuardModal isOpen={authModal} onClose={() => setAuthModal(false)} action={authAction} />
    </div>
  );
}

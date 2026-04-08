import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft, FiShare2, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdLocalShipping, MdVerified, MdKeyboardReturn, MdStar } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import ProductCard from '@/components/features/ProductCard';
import { toast } from 'sonner';

const REVIEWS = [
  { name: 'Priya S.', rating: 5, comment: 'Absolutely loved this product! Perfect for the festive season. Quality is top-notch.', date: '2024-10-20', verified: true },
  { name: 'Amit P.', rating: 4, comment: 'Great product, fast delivery. Packaging could be better but overall happy.', date: '2024-10-18', verified: true },
  { name: 'Sneha K.', rating: 5, comment: 'Gifted this to my family — they loved it! Will definitely buy again.', date: '2024-10-15', verified: false },
  { name: 'Raj M.', rating: 3, comment: 'Good quality, takes time to arrive. But worth the wait.', date: '2024-10-10', verified: true },
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { products } = useProductStore();

  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">This product may have been removed or doesn't exist.</p>
        <Link to="/shop" className="px-6 py-3 fest-gradient text-white rounded-xl font-semibold">Back to Shop</Link>
      </div>
    );
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const images = [product.image, product.image, product.image]; // simulate gallery
  const related = products.filter((p) => p.festival === product.festival && p.id !== id).slice(0, 4);
  const avgRating = REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length;

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
    setWishlist(!wishlist);
    toast.success(wishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  });

  const handleBuyNow = () => guardedAction('checkout', () => {
    navigate('/checkout');
  });

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
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.img key={activeImg} src={images[activeImg]} alt={product.name}
                initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover" />
            </AnimatePresence>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-black px-3 py-1.5 rounded-xl">-{discount}% OFF</div>
            )}
            {product.isCombo && (
              <div className="absolute top-4 right-4 fest-gradient text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                <HiSparkles /> COMBO
              </div>
            )}
            {/* Nav arrows */}
            <button onClick={() => setActiveImg((a) => (a > 0 ? a - 1 : images.length - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
              <FiChevronLeft />
            </button>
            <button onClick={() => setActiveImg((a) => (a < images.length - 1 ? a + 1 : 0))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
              <FiChevronRight />
            </button>
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
            <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">{product.festival}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <MdStar key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">{REVIEWS.length} reviews</span>
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

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: MdLocalShipping, label: 'Free Shipping', sub: 'Orders ₹999+' },
              { icon: MdVerified, label: 'Verified', sub: 'Authentic Product' },
              { icon: MdKeyboardReturn, label: '7-Day Return', sub: 'Easy Returns' },
            ].map((f) => (
              <div key={f.label} className="bg-orange-50 rounded-2xl p-3 text-center">
                <f.icon className="text-orange-500 text-xl mx-auto mb-1" />
                <div className="text-xs font-bold text-gray-800">{f.label}</div>
                <div className="text-[10px] text-gray-500">{f.sub}</div>
              </div>
            ))}
          </div>

          {/* Qty selector */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-500 transition-all shadow-sm">–</button>
              <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-gray-700 font-bold hover:bg-orange-50 hover:text-orange-500 transition-all shadow-sm">+</button>
            </div>
            <span className="text-xs text-gray-500">{product.stock} in stock</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAddToCart}
              className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${addedToCart ? 'bg-green-500 text-white' : 'fest-gradient text-white hover:opacity-90'} shadow-md`}>
              {addedToCart ? <><FiCheck className="text-lg" /> Added!</> : <><FiShoppingCart className="text-lg" /> Add to Cart</>}
            </motion.button>
            <button onClick={handleWishlist}
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${wishlist ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'}`}>
              <FiHeart className={wishlist ? 'fill-red-500 text-red-500' : ''} />
            </button>
            <button className="w-14 h-14 rounded-2xl border-2 border-gray-200 text-gray-400 flex items-center justify-center hover:border-blue-300 hover:text-blue-500 transition-all">
              <FiShare2 />
            </button>
          </div>
          <button onClick={handleBuyNow}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
            Buy Now · ₹{(product.price * qty).toLocaleString()}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900">Customer Reviews</h2>
          <div className="flex items-center gap-2">
            <div className="flex">{[1, 2, 3, 4, 5].map((s) => <MdStar key={s} className={`text-lg ${s <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}`} />)}</div>
            <span className="font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">({REVIEWS.length} reviews)</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REVIEWS.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 fest-gradient rounded-xl flex items-center justify-center text-white font-bold">{r.name.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900 text-sm">{r.name}</span>
                      {r.verified && <MdVerified className="text-green-500 text-sm" />}
                    </div>
                    <span className="text-xs text-gray-400">{r.date}</span>
                  </div>
                </div>
                <div className="flex">{[1, 2, 3, 4, 5].map((s) => <MdStar key={s} className={`text-sm ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />)}</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">More {product.festival} Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <AuthGuardModal isOpen={authModal} onClose={() => setAuthModal(false)} action={authAction} />
    </div>
  );
}

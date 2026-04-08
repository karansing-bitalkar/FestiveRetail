import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, Grid3X3, List, X, ChevronLeft, ChevronRight,
  Star, ShoppingCart, Heart, Tag, Zap, TrendingUp, Package
} from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { FESTIVALS, CATEGORIES } from '@/constants/data';
import { useAuth } from '@/hooks/useAuth';
import AuthGuardModal from '@/components/features/AuthGuardModal';
import { toast } from 'sonner';
import { Product } from '@/types';

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹2500', min: 1000, max: 2500 },
  { label: '₹2500+', min: 2500, max: Infinity },
];
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews'];
const PAGE_SIZE = 16;

const FESTIVAL_BADGES: Record<string, string> = {
  Diwali: 'bg-orange-100 text-orange-600',
  Holi: 'bg-pink-100 text-pink-600',
  Wedding: 'bg-red-100 text-red-600',
  Birthday: 'bg-yellow-100 text-yellow-700',
  'Ganesh Chaturthi': 'bg-yellow-100 text-yellow-700',
  Navratri: 'bg-purple-100 text-purple-600',
  Christmas: 'bg-green-100 text-green-700',
  Eid: 'bg-teal-100 text-teal-600',
};

function ShopProductCard({ product }: { product: Product }) {
  const { isAuthenticated } = useAuth();
  const [authModal, setAuthModal] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { setAuthModal(true); return; }
    setAdded(true);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAdded(false), 1800);
  };
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { setAuthModal(true); return; }
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <>
      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
        {/* Image zone */}
        <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500" style={{ transform: 'scale(1)' }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.07)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')} />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">-{discount}%</span>
            )}
            {product.isCombo && (
              <span className="fest-gradient text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1">
                <Zap size={10} /> COMBO
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-2xl flex items-center justify-center transition-all shadow-md ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100'}`}>
            <Heart size={16} className={wishlisted ? 'fill-white' : ''} />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
            <button onClick={handleCart}
              className={`w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-500 text-white' : 'bg-white text-orange-600 hover:bg-orange-500 hover:text-white'} shadow-lg`}>
              <ShoppingCart size={15} />
              {added ? 'Added!' : 'Quick Add'}
            </button>
          </div>
        </Link>

        {/* Info zone */}
        <div className="p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${FESTIVAL_BADGES[product.festival] || 'bg-gray-100 text-gray-600'}`}>
              {product.festival}
            </span>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{product.category}</span>
          </div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 hover:text-orange-500 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1 mb-3">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-black text-orange-500">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through ml-1.5">₹{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.stock < 10 ? 'bg-red-50 text-red-500' : product.stock < 30 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
              {product.stock < 10 ? `${product.stock} left!` : 'In Stock'}
            </span>
          </div>
        </div>
      </motion.div>
      <AuthGuardModal isOpen={authModal} onClose={() => setAuthModal(false)} action="add to cart or wishlist" />
    </>
  );
}

export default function Shop() {
  const { products: allProducts } = useProductStore();
  const [search, setSearch] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sort, setSort] = useState('Default');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.festival.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedFestival && p.festival !== selectedFestival) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (priceRange && (p.price < priceRange.min || p.price > priceRange.max)) return false;
      return true;
    });
    if (sort === 'Price: Low to High') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'Best Rated') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'Most Reviews') list = [...list].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    return list;
  }, [allProducts, search, selectedFestival, selectedCategory, priceRange, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setSelectedFestival(''); setSelectedCategory(''); setPriceRange(null); setSearch(''); setPage(1); };
  const hasFilters = !!(selectedFestival || selectedCategory || priceRange || search);

  const handlePageChange = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // Stats
  const combos = allProducts.filter(p => p.isCombo).length;
  const avgDiscount = allProducts.length
    ? Math.round(allProducts.reduce((s, p) => s + ((p.originalPrice - p.price) / p.originalPrice) * 100, 0) / allProducts.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-pink-50/30">
      {/* Hero Banner */}
      <div className="fest-gradient py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full border border-white"
              style={{ width: 200 + i * 80, height: 200 + i * 80, right: `-${i * 10}%`, bottom: `-50%` }}
              animate={{ rotate: 360 }} transition={{ duration: 20 + i * 5, repeat: Infinity, ease: 'linear' }} />
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-full text-white text-sm font-medium mb-4">
              <Package size={14} /> {allProducts.length} Products Available
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Festive Shop</h1>
            <p className="text-white/80 text-lg mb-6">Curated festive products from verified vendors</p>
            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: Package, label: 'Total Products', value: allProducts.length },
                { icon: Zap, label: 'Combo Deals', value: combos },
                { icon: Tag, label: 'Avg Savings', value: `${avgDiscount}%` },
                { icon: TrendingUp, label: 'Bestsellers', value: '50+' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-white/70 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Festival quick-filter strip */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button onClick={() => { setSelectedFestival(''); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border-2 ${!selectedFestival ? 'fest-gradient text-white border-transparent shadow-md' : 'bg-white border-orange-200 text-orange-500 hover:bg-orange-50'}`}>
            All Festivals
          </button>
          {FESTIVALS.map(f => (
            <button key={f} onClick={() => { setSelectedFestival(f === selectedFestival ? '' : f); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 border-2 ${selectedFestival === f ? 'fest-gradient text-white border-transparent shadow-md' : 'bg-white border-orange-200 text-orange-500 hover:bg-orange-50'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Search + controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search products, festivals..."
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm bg-white" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-orange-400 bg-white font-medium text-gray-700">
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </select>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all ${showFilters ? 'border-orange-400 bg-orange-50 text-orange-500' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'}`}>
            <SlidersHorizontal size={16} /> Filters
            {hasFilters && <span className="w-5 h-5 fest-gradient rounded-full text-white text-[10px] flex items-center justify-center font-bold">!</span>}
          </button>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}><Grid3X3 size={16} /></button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /></button>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-orange-100 rounded-3xl p-6 mb-6 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1.5"><Tag size={13} /> Festival</h4>
                  <div className="flex flex-wrap gap-2">
                    {FESTIVALS.map((f) => (
                      <button key={f} onClick={() => { setSelectedFestival(selectedFestival === f ? '' : f); setPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${selectedFestival === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1.5"><Grid3X3 size={13} /> Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button key={c} onClick={() => { setSelectedCategory(selectedCategory === c ? '' : c); setPage(1); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${selectedCategory === c ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-1.5"><TrendingUp size={13} /> Price Range</h4>
                  <div className="flex flex-col gap-2">
                    {PRICE_RANGES.map((p) => (
                      <button key={p.label} onClick={() => { setPriceRange(priceRange?.min === p.min ? null : p); setPage(1); }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all text-left ${priceRange?.min === p.min ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-5 flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold border border-red-200 bg-red-50 px-3 py-1.5 rounded-xl transition-all">
                  <X size={12} /> Clear All Filters
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              Showing <strong className="text-gray-900">{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length) || 0}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong className="text-gray-900">{filtered.length}</strong> products
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-semibold flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                <X size={10} /> Clear
              </button>
            )}
          </div>
          {totalPages > 1 && (
            <span className="text-xs text-gray-400">Page {page} of {totalPages}</span>
          )}
        </div>

        {/* Product grid */}
        {paginated.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-orange-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-5">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="px-6 py-3 fest-gradient text-white rounded-2xl font-semibold">Clear All Filters</button>
          </motion.div>
        ) : (
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            <AnimatePresence>
              {paginated.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                  <ShopProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white">
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
                if (p === page - 3 || p === page + 3) return <span key={p} className="text-gray-400">...</span>;
                if (Math.abs(p - page) > 3) return null;
              }
              return (
                <button key={p} onClick={() => handlePageChange(p)}
                  className={`w-11 h-11 flex items-center justify-center rounded-2xl text-sm font-bold transition-all border-2 ${page === p ? 'fest-gradient text-white border-transparent shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500'}`}>
                  {p}
                </button>
              );
            })}
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}
              className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-white">
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

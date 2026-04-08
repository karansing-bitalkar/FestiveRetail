import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { MdTune } from 'react-icons/md';
import { useProductStore } from '@/stores/productStore';
import { FESTIVALS, CATEGORIES } from '@/constants/data';
import ProductCard from '@/components/features/ProductCard';

const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹1000', min: 500, max: 1000 },
  { label: '₹1000 – ₹2500', min: 1000, max: 2500 },
  { label: '₹2500+', min: 2500, max: Infinity },
];
const SORT_OPTIONS = ['Default', 'Price: Low to High', 'Price: High to Low', 'Best Rated', 'Most Reviews'];

export default function Shop() {
  const { products: allProducts } = useProductStore();

  const [search, setSearch] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sort, setSort] = useState('Default');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  let filtered = allProducts.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.festival.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedFestival && p.festival !== selectedFestival) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (priceRange && (p.price < priceRange.min || p.price > priceRange.max)) return false;
    return true;
  });

  if (sort === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'Price: High to Low') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'Best Rated') filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sort === 'Most Reviews') filtered = [...filtered].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

  const clearFilters = () => { setSelectedFestival(''); setSelectedCategory(''); setPriceRange(null); setSearch(''); };
  const hasFilters = selectedFestival || selectedCategory || priceRange || search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Festive Shop</h1>
        <p className="text-gray-500">Discover {allProducts.length}+ curated festive products from verified vendors</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products, festivals..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white">
          {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
        </select>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${showFilters ? 'border-orange-400 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
          <MdTune /> Filters {hasFilters && <span className="w-5 h-5 fest-gradient rounded-full text-white text-[10px] flex items-center justify-center font-bold">!</span>}
        </button>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400'}`}><FiGrid /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-400'}`}><FiList /></button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Festival</h4>
              <div className="flex flex-wrap gap-2">
                {FESTIVALS.map((f) => (
                  <button key={f} onClick={() => setSelectedFestival(selectedFestival === f ? '' : f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedFestival === f ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Category</h4>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? '' : c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedCategory === c ? 'bg-pink-500 text-white border-pink-500' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">Price Range</h4>
              <div className="flex flex-col gap-2">
                {PRICE_RANGES.map((p) => (
                  <button key={p.label} onClick={() => setPriceRange(priceRange?.min === p.min ? null : p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all text-left ${priceRange?.min === p.min ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-4 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium">
              <FiX /> Clear All Filters
            </button>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">Showing <strong className="text-gray-900">{filtered.length}</strong> products</p>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
            <FiX /> Clear Filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters</p>
          <button onClick={clearFilters} className="px-6 py-3 fest-gradient text-white rounded-xl font-semibold">Clear Filters</button>
        </div>
      ) : (
        <div className={`grid gap-4 md:gap-6 ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'}`}>
          {filtered.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

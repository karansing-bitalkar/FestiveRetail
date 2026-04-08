import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import ProductCard from '@/components/features/ProductCard';
import { CATEGORIES, FESTIVALS } from '@/constants/data';

const PAGE_SIZE = 16;
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Top Rated', 'Newest'];

export default function Shop() {
  const { products } = useProductStore();
  const [search, setSearch] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('Featured');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);

  let filtered = products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.festival.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedFestival && p.festival !== selectedFestival) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    return true;
  });

  if (sort === 'Price: Low to High') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'Price: High to Low') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === 'Top Rated') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => { setSelectedFestival(''); setSelectedCategory(''); setSearch(''); setPriceRange([0, 10000]); setPage(1); };
  const hasFilters = !!(search || selectedFestival || selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 mb-2">Festive Shop</h1>
        <p className="text-gray-500">{filtered.length} products available</p>
      </div>

      {/* Search + controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products, festivals..."
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 bg-white text-sm" />
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white font-medium text-gray-700">
          {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
        </select>
        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${filtersOpen ? 'fest-gradient text-white border-transparent' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-400'}`}>
          <SlidersHorizontal size={15} /> Filters {hasFilters && <span className="bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">!</span>}
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Festival</p>
              <div className="flex flex-wrap gap-2">
                {FESTIVALS.map(f => (
                  <button key={f} onClick={() => { setSelectedFestival(selectedFestival === f ? '' : f); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedFestival === f ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => { setSelectedCategory(selectedCategory === c ? '' : c); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedCategory === c ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}</p>
              <input type="range" min={0} max={10000} step={100} value={priceRange[1]} onChange={e => { setPriceRange([0, +e.target.value]); setPage(1); }}
                className="w-full accent-orange-500" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Products grid */}
      {paginated.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400 text-lg mb-3">No products found</p>
          <button onClick={clearFilters} className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {paginated.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
              {p}
            </button>
          ))}
          {totalPages > 7 && <span className="px-2 text-gray-400">...</span>}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

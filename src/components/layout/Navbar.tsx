import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiClock, FiArrowRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';
import { useProductStore } from '@/stores/productStore';
import { FESTIVALS, CATEGORIES } from '@/constants/data';

const NAV_LINKS = [
  { label: 'Home', path: '/home' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/categories' },
  { label: 'Combos', path: '/combos' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('festive_searches') || '[]'); } catch { return []; }
  });
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuth();
  const { products } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Autocomplete suggestions
  const suggestions = searchQuery.length >= 2
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.festival.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const festivalSuggestions = searchQuery.length >= 1
    ? FESTIVALS.filter((f) => f.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3)
    : [];

  const showDropdown = focused && (searchQuery.length > 0 || recentSearches.length > 0);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('festive_searches', JSON.stringify(updated));
    setSearchQuery('');
    setFocused(false);
    setSearchOpen(false);
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) handleSearch(searchQuery);
    if (e.key === 'Escape') { setFocused(false); setSearchOpen(false); }
  };

  const clearRecent = () => { setRecentSearches([]); localStorage.removeItem('festive_searches'); };

  const dashboardPath = user ? `/dashboard/${user.role}` : '/login';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-orange-100' : 'bg-white/80 backdrop-blur-sm'}`}>
      {/* Top festive strip */}
      <div className="fest-gradient py-1.5 text-center text-white text-xs font-medium tracking-wider">
        <HiSparkles className="inline mr-1" />
        FREE SHIPPING on orders above ₹999 · Use code FESTIVE20 for 20% OFF
        <HiSparkles className="inline ml-1" />
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center shadow-md">
              <HiSparkles className="text-white text-lg" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-900">Festive</span>
              <span className="font-bold text-xl fest-text-gradient">Retail</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path}
                className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search trigger */}
            <button onClick={() => { setSearchOpen(!searchOpen); setTimeout(() => inputRef.current?.focus(), 100); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all">
              <FiSearch className="text-lg" />
            </button>
            <Link to="/shop" className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all">
              <FiHeart className="text-lg" />
            </Link>
            <Link to={isAuthenticated ? `/dashboard/${user?.role}/cart` : '/login'}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-all relative">
              <FiShoppingCart className="text-lg" />
              <span className="absolute -top-1 -right-1 w-4 h-4 fest-gradient rounded-full text-white text-[10px] flex items-center justify-center font-bold">3</span>
            </Link>
            {isAuthenticated ? (
              <button onClick={() => navigate(dashboardPath)}
                className="flex items-center gap-2 px-4 py-2 fest-gradient text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md">
                <FiUser className="text-sm" />
                Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-orange-500 border-2 border-orange-400 rounded-xl hover:bg-orange-50 transition-all">Login</Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold fest-gradient text-white rounded-xl hover:opacity-90 transition-all shadow-md">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:bg-orange-50"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>

        {/* Search bar with autocomplete */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-visible pb-3">
              <div ref={searchRef} className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, festivals, combos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-11 pr-10 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <MdClose />
                  </button>
                )}

                {/* Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 z-50 overflow-hidden">

                      {/* Recent searches */}
                      {searchQuery.length === 0 && recentSearches.length > 0 && (
                        <div className="p-3 border-b border-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Recent Searches</span>
                            <button onClick={clearRecent} className="text-xs text-gray-400 hover:text-red-400 transition-colors">Clear all</button>
                          </div>
                          {recentSearches.map((s) => (
                            <button key={s} onClick={() => handleSearch(s)}
                              className="flex items-center gap-2 w-full text-sm text-gray-700 px-2 py-1.5 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-all">
                              <FiClock className="text-gray-400 text-xs" /> {s}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Product suggestions */}
                      {suggestions.length > 0 && (
                        <div className="p-3 border-b border-gray-50">
                          <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Products</span>
                          {suggestions.map((p) => (
                            <button key={p.id} onClick={() => { navigate(`/product/${p.id}`); setSearchOpen(false); setSearchQuery(''); }}
                              className="flex items-center gap-3 w-full text-left px-2 py-2 rounded-xl hover:bg-orange-50 transition-all group">
                              <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.festival} · ₹{p.price.toLocaleString()}</p>
                              </div>
                              <FiArrowRight className="text-gray-300 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Festival suggestions */}
                      {festivalSuggestions.length > 0 && (
                        <div className="p-3">
                          <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Festivals</span>
                          <div className="flex flex-wrap gap-2">
                            {festivalSuggestions.map((f) => (
                              <button key={f} onClick={() => handleSearch(f)}
                                className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full hover:bg-orange-100 transition-all">
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Search action */}
                      {searchQuery.trim() && (
                        <button onClick={() => handleSearch(searchQuery)}
                          className="w-full p-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 border-t border-gray-50">
                          <FiSearch /> Search for "{searchQuery}"
                        </button>
                      )}

                      {searchQuery.length >= 2 && suggestions.length === 0 && festivalSuggestions.length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-400">No results found for "{searchQuery}"</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-orange-100 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* Mobile search */}
              <div className="relative mb-2">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-9 pr-4 py-2.5 bg-orange-50 border border-orange-100 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-orange-50'}`}>
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-orange-100 flex flex-col gap-2">
                {isAuthenticated ? (
                  <button onClick={() => { navigate(dashboardPath); setMobileOpen(false); }}
                    className="w-full py-3 fest-gradient text-white rounded-xl text-sm font-semibold">My Dashboard</button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-sm font-semibold text-orange-500 border-2 border-orange-400 rounded-xl">Login</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full py-3 text-center text-sm font-semibold fest-gradient text-white rounded-xl">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

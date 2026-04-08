import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, Search, Menu, X, Sparkles, ChevronDown, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProductStore } from '@/stores/productStore';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'Categories', path: '/categories' },
  { label: 'Combos', path: '/combos' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { products } = useProductStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      const wl = JSON.parse(localStorage.getItem('festive_wishlist') || '[]');
      setWishlistCount(wl.length);
    };
    update();
    window.addEventListener('wishlist-updated', update);
    return () => window.removeEventListener('wishlist-updated', update);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  const filtered = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.festival.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const dashboardPath = user ? `/dashboard/${user.role}` : '/login';

  return (
    <>
      {/* Top announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 fest-gradient text-white text-center text-xs py-2 font-medium">
         Free delivery on orders above ₹999 | Use code <strong>FESTIVE20</strong> for 20% off!
      </div>

      {/* Main navbar */}
      <nav className={`fixed top-10 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent hidden sm:block">
                FestiveRetail
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${location.pathname === link.path ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:text-orange-500 hover:bg-orange-50'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-all"
                >
                  <Search size={18} />
                </button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                        <Search size={15} className="text-gray-400 flex-shrink-0" />
                        <input
                          autoFocus
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search products, festivals..."
                          className="flex-1 text-sm outline-none text-gray-800"
                          onKeyDown={e => {
                            if (e.key === 'Enter' && searchQuery.trim()) {
                              navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                              setSearchOpen(false);
                              setSearchQuery('');
                            }
                          }}
                        />
                        <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                          <X size={14} className="text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      {filtered.length > 0 && (
                        <div className="py-2">
                          {filtered.map(p => (
                            <Link
                              key={p.id}
                              to={`/product/${p.id}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors"
                            >
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                <p className="text-xs text-orange-500">₹{p.price.toLocaleString()}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchQuery.length > 1 && filtered.length === 0 && (
                        <p className="px-4 py-4 text-sm text-gray-400 text-center">No products found</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  to="/dashboard/customer/wishlist"
                  className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-600 hover:text-red-500 transition-all"
                >
                  <Heart size={18} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] px-1">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              {isAuthenticated && (
                <Link
                  to="/dashboard/customer/cart"
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-orange-50 text-gray-600 hover:text-orange-500 transition-all"
                >
                  <ShoppingCart size={18} />
                </Link>
              )}

              {/* User menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-orange-50 transition-all"
                  >
                    <div className="w-8 h-8 fest-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      {user?.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 hidden md:block max-w-[80px] truncate">{user?.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{user?.role} Account</p>
                        </div>
                        <div className="py-2">
                          <Link to={dashboardPath} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                            <LayoutDashboard size={15} /> Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors">
                    <User size={15} /> Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 fest-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-sm">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-all"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === link.path ? 'text-orange-500 bg-orange-50' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-500'}`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
                    <Link to="/login" className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-700 border border-gray-200 rounded-xl hover:border-orange-400 transition-all">Login</Link>
                    <Link to="/register" className="flex-1 py-2.5 text-center text-sm font-bold fest-gradient text-white rounded-xl hover:opacity-90 transition-all">Sign Up</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

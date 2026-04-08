import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import LogoutModal from '@/components/features/LogoutModal';
import {
  LayoutDashboard, ShoppingBag, Heart, ShoppingCart, MapPin, User, Bell,
  Package, TrendingUp, BarChart3, Settings, Users, Store, Shield, Menu, X,
  ChevronRight, Sparkles, LogOut
} from 'lucide-react';

const CUSTOMER_MENU = [
  { label: 'Dashboard', path: '', icon: LayoutDashboard },
  { label: 'My Orders', path: 'orders', icon: ShoppingBag },
  { label: 'Wishlist', path: 'wishlist', icon: Heart },
  { label: 'Cart', path: 'cart', icon: ShoppingCart },
  { label: 'Addresses', path: 'addresses', icon: MapPin },
  { label: 'Profile', path: 'profile', icon: User },
  { label: 'Notifications', path: 'notifications', icon: Bell },
];

const VENDOR_MENU = [
  { label: 'Dashboard', path: '', icon: LayoutDashboard },
  { label: 'Products', path: 'products', icon: Package },
  { label: 'Orders', path: 'orders', icon: ShoppingBag },
  { label: 'Inventory', path: 'inventory', icon: BarChart3 },
  { label: 'Earnings', path: 'earnings', icon: TrendingUp },
  { label: 'Profile', path: 'profile', icon: User },
];

const ADMIN_MENU = [
  { label: 'Dashboard', path: '', icon: LayoutDashboard },
  { label: 'Users', path: 'users', icon: Users },
  { label: 'Vendors', path: 'vendors', icon: Store },
  { label: 'Product Moderation', path: 'moderation', icon: Shield },
  { label: 'Products', path: 'products', icon: Package },
  { label: 'Orders', path: 'orders', icon: ShoppingBag },
  { label: 'Analytics', path: 'analytics', icon: BarChart3 },
  { label: 'Settings', path: 'settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);

  const role = user?.role || 'customer';
  const menu = role === 'admin' ? ADMIN_MENU : role === 'vendor' ? VENDOR_MENU : CUSTOMER_MENU;
  const basePath = `/dashboard/${role}`;

  const isActive = (path: string) => {
    const full = path ? `${basePath}/${path}` : basePath;
    return path === '' ? location.pathname === basePath : location.pathname === full;
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  const roleColors = {
    admin: 'text-purple-300',
    vendor: 'text-blue-300',
    customer: 'text-orange-300',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 256 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-shrink-0 bg-gray-900 flex flex-col overflow-hidden fixed left-0 top-0 bottom-0 z-30"
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800 min-h-[72px]">
          <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                <span className="font-black text-white text-base whitespace-nowrap">FestiveRetail</span>
                <p className={`text-xs capitalize font-medium ${roleColors[role]}`}>{role} Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav menu */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
          {menu.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path ? `${basePath}/${item.path}` : basePath}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                  active
                    ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/10 text-orange-400 border-l-[3px] border-orange-500'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-orange-400'
                }`}
              >
                <Icon size={19} className="flex-shrink-0" />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-semibold whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && sidebarOpen && (
                  <ChevronRight size={14} className="ml-auto text-orange-400 flex-shrink-0" />
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-gray-800 p-3">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 fest-gradient rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => setLogoutModal(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all flex-shrink-0"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLogoutModal(true)}
              className="w-full flex items-center justify-center py-2.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-all"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 256 : 72 }}
      >
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-all flex-shrink-0"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-gray-900 text-sm">
              {menu.find((m) => isActive(m.path))?.label || 'Dashboard'}
            </h2>
            <p className="text-xs text-gray-400 capitalize">{role} · {user?.name}</p>
          </div>
          <Link to="/home" className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center gap-1">
            ← Back to Shop
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <LogoutModal isOpen={logoutModal} onConfirm={handleLogout} onCancel={() => setLogoutModal(false)} />
    </div>
  );
}

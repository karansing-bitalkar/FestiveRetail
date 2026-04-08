import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Heart, ShoppingCart,
  MapPin, User, Bell, Package, DollarSign,
  Users, Store, Tag, BarChart3, Settings, LogOut,
  ChevronLeft, ChevronRight, ShieldCheck, Truck, Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LogoutModal from '@/components/features/LogoutModal';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { Role } from '@/types';

const MENUS: Record<Role, { icon: React.ElementType; label: string; path: string }[]> = {
  customer: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/customer' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/customer/orders' },
    { icon: Heart, label: 'Wishlist', path: '/dashboard/customer/wishlist' },
    { icon: ShoppingCart, label: 'Cart', path: '/dashboard/customer/cart' },
    { icon: MapPin, label: 'Addresses', path: '/dashboard/customer/addresses' },
    { icon: User, label: 'Profile', path: '/dashboard/customer/profile' },
    { icon: Bell, label: 'Notifications', path: '/dashboard/customer/notifications' },
  ],
  vendor: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/vendor' },
    { icon: Tag, label: 'Products', path: '/dashboard/vendor/products' },
    { icon: Truck, label: 'Orders', path: '/dashboard/vendor/orders' },
    { icon: Package, label: 'Inventory', path: '/dashboard/vendor/inventory' },
    { icon: DollarSign, label: 'Earnings', path: '/dashboard/vendor/earnings' },
    { icon: User, label: 'Profile', path: '/dashboard/vendor/profile' },
  ],
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { icon: Store, label: 'Vendors', path: '/dashboard/admin/vendors' },
    { icon: ShieldCheck, label: 'Moderation', path: '/dashboard/admin/moderation' },
    { icon: Tag, label: 'Products', path: '/dashboard/admin/products' },
    { icon: Truck, label: 'Orders', path: '/dashboard/admin/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  customer: 'Buyer Account',
  vendor: 'Seller Account',
  admin: 'Admin Panel',
};

const ROLE_GRADIENTS: Record<Role, string> = {
  customer: 'from-orange-500 to-pink-500',
  vendor: 'from-purple-500 to-blue-500',
  admin: 'from-red-500 to-orange-500',
};

const ROLE_ACTIVE_BG: Record<Role, string> = {
  customer: 'bg-orange-500/20 text-orange-400',
  vendor: 'bg-purple-500/20 text-purple-400',
  admin: 'bg-red-500/20 text-red-400',
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = (user?.role ?? 'customer') as Role;
  const menus = MENUS[role];

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-shrink-0 h-full flex flex-col overflow-hidden relative z-10"
        style={{
          background: 'linear-gradient(180deg, #0d0e1a 0%, #111328 100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
        }}
      >
        {/* Logo area */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/8 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${ROLE_GRADIENTS[role]} rounded-xl flex items-center justify-center shadow-lg`}>
            <Sparkles size={17} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="text-white font-black text-base leading-tight whitespace-nowrap">FestiveRetail</div>
                <div className={`text-xs font-semibold bg-gradient-to-r ${ROLE_GRADIENTS[role]} bg-clip-text text-transparent whitespace-nowrap`}>
                  {ROLE_LABELS[role]}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute -right-3 top-[68px] w-6 h-6 bg-gradient-to-br ${ROLE_GRADIENTS[role]} rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-20`}>
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* User card */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/8 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br ${ROLE_GRADIENTS[role]} flex items-center justify-center text-white font-black text-sm shadow-md`}>
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                <div className="text-white text-sm font-semibold truncate max-w-[140px]">{user?.name}</div>
                <div className="text-gray-400 text-xs truncate max-w-[140px]">{user?.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-hide">
          {!collapsed && (
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-3 mb-2">Navigation</p>
          )}
          <div className="flex flex-col gap-0.5">
            {menus.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === `/dashboard/${role}`}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? `${ROLE_ACTIVE_BG[role]} font-semibold`
                        : 'text-gray-400 hover:text-white hover:bg-white/8'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={`flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? '' : ''}`} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}
                            className="text-sm font-medium whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {/* Active indicator */}
                      {isActive && !collapsed && (
                        <motion.div layoutId="activeIndicator" className={`ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-br ${ROLE_GRADIENTS[role]}`} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/8 flex-shrink-0">
          <button
            onClick={() => setLogoutOpen(true)}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center px-0' : ''}`}>
            <LogOut size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-medium">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Welcome back, <span className={`bg-gradient-to-r ${ROLE_GRADIENTS[role]} bg-clip-text text-transparent`}>{user?.name?.split(' ')[0]}!</span>
            </h1>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to={`/dashboard/${role}/notifications`}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-all relative">
              <Bell size={17} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-black">2</span>
            </NavLink>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ROLE_GRADIENTS[role]} flex items-center justify-center text-white font-black text-sm shadow-md`}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page */}
        <motion.main
          key={typeof window !== 'undefined' ? window.location.pathname : ''}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="flex-1 overflow-y-auto p-6"
        >
          <Outlet />
        </motion.main>
      </div>

      <LogoutModal isOpen={logoutOpen} onConfirm={handleLogout} onCancel={() => setLogoutOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

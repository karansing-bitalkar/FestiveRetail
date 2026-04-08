import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdShoppingBag, MdFavorite, MdShoppingCart,
  MdLocationOn, MdPerson, MdNotifications, MdInventory,
  MdAttachMoney, MdPeople, MdStore, MdCategory, MdBarChart,
  MdSettings, MdLogout, MdChevronLeft, MdChevronRight,
  MdVerifiedUser, MdLocalShipping
} from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import LogoutModal from '@/components/features/LogoutModal';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { Role } from '@/types';

const MENUS: Record<Role, { icon: React.ElementType; label: string; path: string }[]> = {
  customer: [
    { icon: MdDashboard, label: 'Dashboard', path: '/dashboard/customer' },
    { icon: MdShoppingBag, label: 'My Orders', path: '/dashboard/customer/orders' },
    { icon: MdFavorite, label: 'Wishlist', path: '/dashboard/customer/wishlist' },
    { icon: MdShoppingCart, label: 'Cart', path: '/dashboard/customer/cart' },
    { icon: MdLocationOn, label: 'Addresses', path: '/dashboard/customer/addresses' },
    { icon: MdPerson, label: 'Profile', path: '/dashboard/customer/profile' },
    { icon: MdNotifications, label: 'Notifications', path: '/dashboard/customer/notifications' },
  ],
  vendor: [
    { icon: MdDashboard, label: 'Dashboard', path: '/dashboard/vendor' },
    { icon: MdCategory, label: 'Products', path: '/dashboard/vendor/products' },
    { icon: MdLocalShipping, label: 'Orders', path: '/dashboard/vendor/orders' },
    { icon: MdInventory, label: 'Inventory', path: '/dashboard/vendor/inventory' },
    { icon: MdAttachMoney, label: 'Earnings', path: '/dashboard/vendor/earnings' },
    { icon: MdPerson, label: 'Profile', path: '/dashboard/vendor/profile' },
  ],
  admin: [
    { icon: MdDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: MdPeople, label: 'Users', path: '/dashboard/admin/users' },
    { icon: MdStore, label: 'Vendors', path: '/dashboard/admin/vendors' },
    { icon: MdVerifiedUser, label: 'Moderation', path: '/dashboard/admin/moderation' },
    { icon: MdCategory, label: 'Products', path: '/dashboard/admin/products' },
    { icon: MdLocalShipping, label: 'Orders', path: '/dashboard/admin/orders' },
    { icon: MdBarChart, label: 'Analytics', path: '/dashboard/admin/analytics' },
    { icon: MdSettings, label: 'Settings', path: '/dashboard/admin/settings' },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  customer: 'Buyer Account',
  vendor: 'Seller Account',
  admin: 'Admin Panel',
};

const ROLE_COLORS: Record<Role, string> = {
  customer: 'from-orange-500 to-pink-500',
  vendor: 'from-purple-500 to-blue-500',
  admin: 'from-red-500 to-orange-500',
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
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-shrink-0 h-full bg-[#0d0e1a] flex flex-col overflow-hidden relative z-10"
        style={{ boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0">
          <div className={`w-9 h-9 flex-shrink-0 bg-gradient-to-br ${ROLE_COLORS[role]} rounded-xl flex items-center justify-center`}>
            <HiSparkles className="text-white text-lg" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="text-white font-bold text-base leading-tight whitespace-nowrap">FestiveRetail</div>
                <div className={`text-xs font-medium bg-gradient-to-r ${ROLE_COLORS[role]} bg-clip-text text-transparent whitespace-nowrap`}>
                  {ROLE_LABELS[role]}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-colors z-20 flex-shrink-0"
        >
          {collapsed ? <MdChevronRight className="text-sm" /> : <MdChevronLeft className="text-sm" />}
        </button>

        {/* User avatar */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0 ${collapsed ? 'justify-center' : ''}`}>
          <div className={`w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center text-white font-bold text-sm`}>
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="text-white text-sm font-medium truncate max-w-[140px]">{user?.name}</div>
                <div className="text-gray-400 text-xs truncate max-w-[140px]">{user?.email}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto scrollbar-hide">
          <div className="flex flex-col gap-1">
            {menus.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === `/dashboard/${role}`}
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? 'active' : 'text-gray-400'} ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-white/10 flex-shrink-0">
          <button
            onClick={() => setLogoutOpen(true)}
            className={`sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-0' : ''}`}
            title={collapsed ? 'Logout' : undefined}
          >
            <MdLogout className="text-xl flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to={`/dashboard/${role}/notifications` || '#'} className="w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 transition-all relative">
              <MdNotifications className="text-lg" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">2</span>
            </NavLink>
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center text-white font-bold text-sm`}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
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

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, MapPin, Bell, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ORDERS } from '@/constants/data';

const RECENT_ORDERS = ORDERS.slice(0, 3);

const STATS = [
  { label: 'Total Orders', value: '3', icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
  { label: 'Wishlist Items', value: '5', icon: Heart, color: 'bg-red-100 text-red-500' },
  { label: 'Saved Addresses', value: '2', icon: MapPin, color: 'bg-blue-100 text-blue-600' },
  { label: 'Notifications', value: '2', icon: Bell, color: 'bg-purple-100 text-purple-600' },
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div className="fest-gradient rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={20} />
          <span className="font-medium text-white/80">Welcome back!</span>
        </div>
        <h1 className="text-2xl font-black mb-1">{user?.name}</h1>
        <p className="text-white/70 text-sm">Your festive shopping journey continues here</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
              <s.icon size={20} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900">Recent Orders</h3>
          <Link to="orders" className="text-sm text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {RECENT_ORDERS.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 text-sm">#{order.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{order.products[0]?.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-500 text-sm">₹{order.total.toLocaleString()}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'My Orders', path: 'orders', icon: ShoppingBag, color: 'bg-orange-50 text-orange-500 hover:bg-orange-100' },
          { label: 'Wishlist', path: 'wishlist', icon: Heart, color: 'bg-red-50 text-red-500 hover:bg-red-100' },
          { label: 'Rate Products', path: 'orders', icon: Star, color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
          { label: 'Notifications', path: 'notifications', icon: Bell, color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
        ].map(a => (
          <Link key={a.label} to={a.path} className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${a.color} transition-all font-semibold text-sm`}>
            <a.icon size={22} />
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

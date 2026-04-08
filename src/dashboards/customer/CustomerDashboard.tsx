import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, ShoppingCart, Truck, Star, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ORDERS, PRODUCTS } from '@/constants/data';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const myOrders = ORDERS.filter(o => o.customerId === 'c1');
  const stats = [
    { label: 'Total Orders', value: myOrders.length, icon: ShoppingBag, color: 'from-orange-400 to-red-400', link: '/dashboard/customer/orders' },
    { label: 'Wishlist Items', value: 5, icon: Heart, color: 'from-pink-400 to-rose-400', link: '/dashboard/customer/wishlist' },
    { label: 'Cart Items', value: 3, icon: ShoppingCart, color: 'from-purple-400 to-blue-400', link: '/dashboard/customer/cart' },
    { label: 'Delivered', value: myOrders.filter(o => o.status === 'delivered').length, icon: Truck, color: 'from-green-400 to-teal-400', link: '/dashboard/customer/orders' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fest-gradient rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">{[...Array(4)].map((_, i) => <div key={i} className="absolute w-40 h-40 rounded-full border border-white" style={{ right: `${i*15}%`, top: '-30%' }} />)}</div>
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-2"><Sparkles size={14} /> Festive Season is here!</div>
          <h2 className="text-2xl font-black mb-1">Hello, {user?.name?.split(' ')[0]}!</h2>
          <p className="text-white/80 mb-5">You have {myOrders.filter(o => o.status === 'shipped').length} order(s) on the way. Exclusive Diwali sale is live!</p>
          <Link to="/shop" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-orange-500 rounded-xl font-bold text-sm hover:bg-orange-50 transition-all">
            Shop Now <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={s.link} className={`block p-5 bg-gradient-to-br ${s.color} rounded-2xl text-white hover:opacity-90 transition-all shadow-sm hover:shadow-md`}>
                <Icon size={28} className="mb-3 opacity-80" />
                <div className="text-3xl font-black mb-0.5">{s.value}</div>
                <div className="text-white/80 text-sm font-medium">{s.label}</div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <Link to="/dashboard/customer/orders" className="text-orange-500 text-sm font-semibold hover:text-orange-600 flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Items', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myOrders.map(order => (
                  <tr key={order.id} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-5 py-4 font-bold text-orange-500 text-sm">#{order.id}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{order.products[0].name}{order.products.length > 1 ? ` +${order.products.length - 1}` : ''}</td>
                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">₹{order.total.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Recommended products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
          <Link to="/shop" className="text-orange-500 text-sm font-semibold hover:text-orange-600 flex items-center gap-1">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
              <div className="aspect-square overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-xs line-clamp-2 mb-1">{p.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-orange-500 font-bold text-sm">₹{p.price.toLocaleString()}</span>
                  <div className="flex items-center gap-0.5"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-xs text-gray-500">{p.rating}</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

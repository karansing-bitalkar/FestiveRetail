import { motion } from 'framer-motion';
import { Package, ShoppingBag, TrendingUp, DollarSign, ArrowRight, ArrowUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';

const STATS = [
  { label: 'Total Products', value: '12', icon: Package, color: 'bg-blue-100 text-blue-600', change: '+2 this week' },
  { label: 'Total Orders', value: '48', icon: ShoppingBag, color: 'bg-orange-100 text-orange-600', change: '+8 this week' },
  { label: 'Revenue', value: '₹1.2L', icon: DollarSign, color: 'bg-green-100 text-green-600', change: '+₹18K this week' },
  { label: 'Growth', value: '24%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600', change: 'vs last month' },
];

const RECENT_ORDERS = [
  { id: 'ORD001', product: 'Diwali Puja Thali Set', qty: 2, total: 1198, status: 'delivered' },
  { id: 'ORD002', product: 'Ultimate Diwali Hamper', qty: 1, total: 2499, status: 'shipped' },
  { id: 'ORD003', product: 'Holi Color Pack', qty: 3, total: 1047, status: 'processing' },
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const { products } = useProductStore();

  return (
    <div className="flex flex-col gap-6">
      <div className="fest-gradient rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={20} />
          <span className="font-medium text-white/80">Vendor Dashboard</span>
        </div>
        <h1 className="text-2xl font-black mb-1">{user?.name}</h1>
        <p className="text-white/70 text-sm">Manage your festive products and track orders</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-black text-gray-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xs text-green-600 flex items-center gap-1 font-medium"><ArrowUp size={10} />{s.change}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">Recent Orders</h3>
            <Link to="orders" className="text-sm text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600"><ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {RECENT_ORDERS.map((o, i) => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-gray-900">#{o.id}</p>
                  <p className="text-xs text-gray-500">{o.product} ×{o.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500 text-sm">₹{o.total.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'shipped' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-900">My Products</h3>
            <Link to="products" className="text-sm text-orange-500 font-semibold flex items-center gap-1 hover:text-orange-600">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {products.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                </div>
                <span className="text-sm font-bold text-orange-500">₹{p.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

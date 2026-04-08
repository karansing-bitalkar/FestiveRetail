import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { MdCheckCircle, MdCancel, MdVisibility } from 'react-icons/md';
import { PRODUCTS } from '@/constants/data';
import { toast } from 'sonner';

export default function ProductModeration() {
  const [products, setProducts] = useState(PRODUCTS.map(p => ({ ...p, moderationStatus: Math.random() > 0.3 ? 'approved' : 'pending' as string })));
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleModerate = (id: string, status: string) => {
    setProducts(ps => ps.map(p => p.id === id ? { ...p, moderationStatus: status } : p));
    toast.success(`Product ${status === 'approved' ? 'approved' : 'rejected'}!`);
  };

  const filtered = products.filter(p => {
    if (filter !== 'all' && p.moderationStatus !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Product Moderation</h2><p className="text-gray-500 text-sm">{products.filter(p => p.moderationStatus === 'pending').length} products pending review</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{ l: 'Total Products', v: products.length, c: 'bg-blue-50 text-blue-700' }, { l: 'Approved', v: products.filter(p => p.moderationStatus === 'approved').length, c: 'bg-green-50 text-green-700' }, { l: 'Pending', v: products.filter(p => p.moderationStatus === 'pending').length, c: 'bg-yellow-50 text-yellow-700' }].map(s => (
          <div key={s.l} className={`${s.c} rounded-2xl p-4 text-center`}><div className="text-3xl font-black">{s.v}</div><div className="text-sm font-medium">{s.l}</div></div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
        </div>
        <div className="flex gap-2">
          {['all', 'approved', 'pending', 'rejected'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${filter === s ? 'fest-gradient text-white border-transparent' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Product', 'Festival', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div><div className="font-semibold text-gray-900 text-sm max-w-[160px] line-clamp-1">{p.name}</div><div className="text-xs text-gray-400">{p.category}</div></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-orange-500 bg-orange-50 rounded-full px-2 py-1 w-fit">{p.festival}</td>
                  <td className="px-5 py-4 font-bold text-sm text-gray-900">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.stock}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${(p as any).moderationStatus === 'approved' ? 'bg-green-100 text-green-700' : (p as any).moderationStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{(p as any).moderationStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {(p as any).moderationStatus === 'pending' && (<>
                        <button onClick={() => handleModerate(p.id, 'approved')} className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all"><MdCheckCircle /></button>
                        <button onClick={() => handleModerate(p.id, 'rejected')} className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all"><MdCancel /></button>
                      </>)}
                      <button className="p-1.5 bg-blue-50 text-blue-400 rounded-lg hover:bg-blue-100 transition-all"><MdVisibility /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

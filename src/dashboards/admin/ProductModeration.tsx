import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

export default function ProductModeration() {
  const { products } = useProductStore();
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [moderated, setModerated] = useState<Record<string, 'approved' | 'rejected'>>({});

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const handleAction = () => {
    if (!pending) return;
    setModerated(prev => ({ ...prev, [pending.id]: pending.action === 'approve' ? 'approved' : 'rejected' }));
    toast.success(`Product ${pending.action === 'approve' ? 'approved' : 'rejected'} successfully`);
    setPending(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Product Moderation</h2>
        <p className="text-gray-500 text-sm">Review and approve/reject products from vendors</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const status = moderated[p.id];
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-all">
              <div className="aspect-video relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=60')} />
                <div className="absolute top-2 right-2">
                  {status === 'approved' ? (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Approved</span>
                  ) : status === 'rejected' ? (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><XCircle size={10} /> Rejected</span>
                  ) : (
                    <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><Clock size={10} /> Pending</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{p.festival} · ₹{p.price.toLocaleString()}</p>
                {!status && (
                  <div className="flex gap-2">
                    <button onClick={() => setPending({ id: p.id, action: 'approve' })}
                      className="flex-1 py-2 bg-green-50 text-green-600 font-bold text-xs rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-1">
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => setPending({ id: p.id, action: 'reject' })}
                      className="flex-1 py-2 bg-red-50 text-red-500 font-bold text-xs rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1">
                      <XCircle size={12} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ConfirmModal isOpen={!!pending}
        title={pending?.action === 'approve' ? 'Approve Product' : 'Reject Product'}
        message={`Are you sure you want to ${pending?.action} this product?`}
        confirmText={pending?.action === 'approve' ? 'Approve' : 'Reject'}
        onConfirm={handleAction} onCancel={() => setPending(null)} />
    </div>
  );
}

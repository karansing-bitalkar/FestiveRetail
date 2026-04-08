import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const PAGE_SIZE = 10;
const BLANK: Partial<Product> = { name: '', price: 0, originalPrice: 0, stock: 10, category: '', festival: 'Diwali', description: '', image: '', tags: [] };

export default function VendorProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditProd(null); setForm(BLANK); setModal(true); };
  const openEdit = (p: Product) => { setEditProd(p); setForm(p); setModal(true); };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    if (editProd) {
      updateProduct({ ...editProd, ...form } as Product);
      toast.success('Product updated!');
    } else {
      addProduct({ id: `p${Date.now()}`, vendorId: 'v1', rating: 4.5, reviews: 0, isCombo: false, tags: [], ...form } as Product);
      toast.success('Product added!');
    }
    setModal(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">My Products</h2>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..."
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['#', 'Product', 'Festival', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
              ) : paginated.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4 text-xs text-gray-400">{(page - 1) * PAGE_SIZE + i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&q=60')} />
                      <span className="font-semibold text-gray-900 text-sm whitespace-nowrap max-w-[180px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.festival}</td>
                  <td className="px-5 py-4 text-sm font-bold text-orange-500">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-yellow-600 font-bold">⭐ {p.rating}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-all"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronLeft size={16} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editProd ? 'Edit Product' : 'Add Product'}>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Product Name', key: 'name', type: 'text' },
            { label: 'Price (₹)', key: 'price', type: 'number' },
            { label: 'Original Price (₹)', key: 'originalPrice', type: 'number' },
            { label: 'Stock', key: 'stock', type: 'number' },
            { label: 'Image URL', key: 'image', type: 'text' },
            { label: 'Description', key: 'description', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input type={f.type} value={(form as any)[f.key] || ''} onChange={e => setForm(x => ({ ...x, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Festival</label>
            <select value={form.festival || 'Diwali'} onChange={e => setForm(x => ({ ...x, festival: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
              {['Diwali', 'Holi', 'Wedding', 'Birthday', 'Ganesh Chaturthi', 'Navratri', 'Christmas', 'Eid'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            {editProd ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} title="Delete Product" message="Are you sure you want to delete this product?"
        confirmText="Delete" onConfirm={() => { if (deleteId) { deleteProduct(deleteId); toast.success('Product deleted'); setDeleteId(null); } }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

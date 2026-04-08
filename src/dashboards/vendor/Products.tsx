import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight, Star, Eye } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';
import { FESTIVALS, CATEGORIES } from '@/constants/data';

const PAGE_SIZE = 10;
const BLANK = { name: '', price: '', originalPrice: '', stock: '', category: '', festival: '', description: '' };

export default function VendorProducts() {
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const vendorProducts = products.filter(p => p.vendorId === (user?.id ?? 'v1') || p.vendorId === 'v1');

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK);

  const filtered = vendorProducts.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditProduct(null); setForm(BLANK); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock), category: p.category, festival: p.festival, description: p.description });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
    if (editProduct) {
      updateProduct({ ...editProduct, ...form, price: +form.price, originalPrice: +form.originalPrice || +form.price, stock: +form.stock || 0 });
      toast.success('Product updated successfully!');
    } else {
      const np: Product = {
        id: `vendor_${Date.now()}`,
        name: form.name, price: +form.price, originalPrice: +form.originalPrice || +form.price,
        stock: +form.stock || 100, category: form.category || 'General', festival: form.festival || 'All',
        description: form.description,
        image: 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&q=80',
        rating: 0, reviews: 0, vendorId: user?.id ?? 'v1', tags: [], isCombo: false,
      };
      addProduct(np);
      toast.success('Product added! Now visible in Shop & Admin panel.');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteProductId) { deleteProduct(deleteProductId); toast.success('Product deleted.'); setDeleteProductId(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">My Products</h2>
          <p className="text-gray-500 text-sm">{vendorProducts.length} products · visible to customers</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md">
          <Plus size={15} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { l: 'Total Listed', v: vendorProducts.length, c: 'bg-orange-50 text-orange-700' },
          { l: 'In Stock', v: vendorProducts.filter(p => p.stock > 0).length, c: 'bg-green-50 text-green-700' },
          { l: 'Low Stock', v: vendorProducts.filter(p => p.stock > 0 && p.stock < 10).length, c: 'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.l} className={`${s.c} rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-black mb-0.5">{s.v}</div>
            <div className="text-sm font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input type="text" placeholder="Search products..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Product', 'Festival', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
              ) : paginated.map((product, i) => (
                <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[180px]">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">{product.festival}</span></td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 text-sm">₹{product.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" /><span className="text-sm font-semibold">{product.rating || '–'}</span></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(product)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-all" title="Edit"><Edit2 size={13} /></button>
                      <button onClick={() => setDeleteProductId(product.id)} className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all" title="Delete"><Trash2 size={13} /></button>
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
          <p className="text-sm text-gray-500">Page {page} of {totalPages} · {filtered.length} products</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Edit Product' : 'Add New Product'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          {[{ label: 'Selling Price (₹) *', key: 'price' }, { label: 'Original Price (₹)', key: 'originalPrice' }, { label: 'Stock Units', key: 'stock' }].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} placeholder={f.label}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
              <option value="">Select</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Festival</label>
            <select value={form.festival} onChange={e => setForm(f => ({ ...f, festival: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
              <option value="">Select</option>{FESTIVALS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              placeholder="Product description" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm resize-none" />
          </div>
          <div className="col-span-2 bg-green-50 rounded-xl px-4 py-3 text-xs text-green-700 border border-green-100">
            Product will be immediately visible in the Shop page and Admin panel after adding.
          </div>
          <div className="col-span-2">
            <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
              {editProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteProductId} title="Delete Product" message="Delete this product? It will be removed from all listings."
        confirmText="Delete Product" onConfirm={handleDelete} onCancel={() => setDeleteProductId(null)} />
    </div>
  );
}

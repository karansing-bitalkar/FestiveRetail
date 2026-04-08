import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdStar, MdVerifiedUser } from 'react-icons/md';
import { HiSparkles } from 'react-icons/hi';
import { useProductStore } from '@/stores/productStore';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';
import { FESTIVALS, CATEGORIES } from '@/constants/data';

const PAGE_SIZE = 10;
const BLANK = { name: '', price: '', originalPrice: '', stock: '', category: '', festival: '', description: '', image: '', vendorId: 'admin' };

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [filterFestival, setFilterFestival] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [deleteProd, setDeleteProd] = useState<string | null>(null);
  const [form, setForm] = useState(BLANK);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterFestival && p.festival !== filterFestival) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditProd(null); setForm(BLANK); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditProd(p);
    setForm({ name: p.name, price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock), category: p.category, festival: p.festival, description: p.description, image: p.image, vendorId: p.vendorId });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
    if (editProd) {
      updateProduct({ ...editProd, ...form, price: +form.price, originalPrice: +form.originalPrice || +form.price, stock: +form.stock || 0 });
      toast.success('Product updated successfully!');
    } else {
      const np: Product = {
        id: `admin_${Date.now()}`,
        name: form.name,
        price: +form.price,
        originalPrice: +form.originalPrice || +form.price,
        stock: +form.stock || 100,
        category: form.category || 'General',
        festival: form.festival || 'All',
        description: form.description,
        image: form.image || 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&q=80',
        rating: 4.5,
        reviews: 0,
        vendorId: 'admin',
        tags: [],
        isCombo: false,
      };
      addProduct(np);
      toast.success('Product added! Visible in Shop now.');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteProd) { deleteProduct(deleteProd); toast.success('Product deleted.'); setDeleteProd(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Products Management</h2>
          <p className="text-gray-500 text-sm">{products.length} total products across all vendors</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md">
          <FiPlus /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l: 'Total Products', v: products.length, c: 'bg-orange-50 text-orange-700' },
          { l: 'In Stock', v: products.filter((p) => p.stock > 0).length, c: 'bg-green-50 text-green-700' },
          { l: 'Low Stock', v: products.filter((p) => p.stock > 0 && p.stock < 10).length, c: 'bg-yellow-50 text-yellow-700' },
          { l: 'Out of Stock', v: products.filter((p) => p.stock === 0).length, c: 'bg-red-50 text-red-700' },
        ].map((s) => (
          <div key={s.l} className={`${s.c} rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-black mb-0.5">{s.v}</div>
            <div className="text-sm font-medium">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm"
          />
        </div>
        <select value={filterFestival} onChange={(e) => { setFilterFestival(e.target.value); setPage(1); }}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white">
          <option value="">All Festivals</option>
          {FESTIVALS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Product', 'Festival', 'Category', 'Price', 'Stock', 'Rating', 'Vendor', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
              ) : paginated.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[160px]">{p.name}</div>
                        {p.isCombo && <span className="text-[10px] fest-gradient text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5 w-fit"><HiSparkles />COMBO</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4"><span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-1 rounded-full">{p.festival}</span></td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.category}</td>
                  <td className="px-5 py-4">
                    <div className="font-bold text-gray-900 text-sm">₹{p.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-400 line-through">₹{p.originalPrice.toLocaleString()}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 10 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                      {p.stock === 0 ? 'Out' : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1"><MdStar className="text-yellow-400 text-sm" /><span className="text-sm font-semibold">{p.rating || 4.5}</span></div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.vendorId === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {p.vendorId === 'admin' ? 'Admin' : `Vendor`}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"><FiEdit2 className="text-sm" /></button>
                      <button onClick={() => setDeleteProd(p.id)} className="w-8 h-8 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all"><FiTrash2 className="text-sm" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProd ? 'Edit Product' : 'Add New Product'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Product name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          {[
            { label: 'Selling Price (₹) *', key: 'price', placeholder: '499' },
            { label: 'Original Price (₹)', key: 'originalPrice', placeholder: '799' },
            { label: 'Stock Units', key: 'stock', placeholder: '100' },
            { label: 'Image URL', key: 'image', placeholder: 'https://...' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
                placeholder={f.placeholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
              <option value="">Select Category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Festival</label>
            <select value={form.festival} onChange={(e) => setForm((f) => ({ ...f, festival: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white">
              <option value="">Select Festival</option>
              {FESTIVALS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3} placeholder="Product description"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm resize-none" />
          </div>
          <div className="col-span-2">
            <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
              {editProd ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteProd} title="Delete Product"
        message="Delete this product? It will be removed from the shop and all listings."
        confirmText="Delete Product" onConfirm={handleDelete} onCancel={() => setDeleteProd(null)} />
    </div>
  );
}

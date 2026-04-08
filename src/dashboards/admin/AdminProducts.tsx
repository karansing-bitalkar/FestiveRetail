import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, Star, Package, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';
import { FESTIVALS, CATEGORIES } from '@/constants/data';

const PAGE_SIZE = 12;
const BLANK = { name: '', price: '', originalPrice: '', stock: '', category: '', festival: '', description: '', image: '' };

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [filterFestival, setFilterFestival] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(BLANK);

  const filtered = useMemo(() => products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.festival.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterFestival && p.festival !== filterFestival) return false;
    return true;
  }), [products, search, filterFestival]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => { setEditProduct(null); setForm(BLANK); setShowModal(true); };
  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock), category: p.category, festival: p.festival, description: p.description, image: p.image });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required.'); return; }
    if (editProduct) {
      updateProduct({ ...editProduct, ...form, price: +form.price, originalPrice: +form.originalPrice || +form.price, stock: +form.stock || 0 });
      toast.success('Product updated!');
    } else {
      addProduct({
        id: `admin_${Date.now()}`, name: form.name, price: +form.price,
        originalPrice: +form.originalPrice || +form.price, stock: +form.stock || 100,
        category: form.category || 'General', festival: form.festival || 'All',
        description: form.description,
        image: form.image || 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&h=400&fit=crop&q=80',
        rating: 0, reviews: 0, vendorId: 'admin', tags: [], isCombo: false,
      });
      toast.success('Product added to shop!');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (deleteId) { deleteProduct(deleteId); toast.success('Product deleted.'); setDeleteId(null); }
  };

  const vendorCount = new Set(products.map(p => p.vendorId)).size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">All Products</h2>
          <p className="text-gray-500 text-sm">{products.length} products from {vendorCount} vendors · visible in shop</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md">
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: 'Total Products', v: products.length, c: 'bg-orange-50 text-orange-700', icon: Package },
          { l: 'In Stock', v: products.filter(p => p.stock > 0).length, c: 'bg-green-50 text-green-700', icon: ShieldCheck },
          { l: 'Low Stock', v: products.filter(p => p.stock < 10 && p.stock > 0).length, c: 'bg-yellow-50 text-yellow-700', icon: AlertTriangle },
          { l: 'Out of Stock', v: products.filter(p => p.stock === 0).length, c: 'bg-red-50 text-red-700', icon: AlertTriangle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.l} className={`${s.c} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1"><Icon size={13} /><span className="text-xs font-medium">{s.l}</span></div>
              <div className="text-2xl font-black">{s.v}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input type="text" placeholder="Search by name or festival..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
        </div>
        <select value={filterFestival} onChange={e => { setFilterFestival(e.target.value); setPage(1); }}
          className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white font-medium text-gray-700">
          <option value="">All Festivals</option>
          {FESTIVALS.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginated.map((product, i) => {
          const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
          return (
            <motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="relative overflow-hidden aspect-square">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {discount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">-{discount}%</span>}
                <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-200">
                  <div className="flex gap-1">
                    <button onClick={() => setViewProduct(product)} className="flex-1 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-gray-700 flex items-center justify-center gap-1 hover:bg-white transition-all">
                      <Eye size={11} /> View
                    </button>
                    <button onClick={() => openEdit(product)} className="flex-1 py-1.5 bg-blue-500/90 backdrop-blur-sm rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 hover:bg-blue-600 transition-all">
                      <Edit2 size={11} /> Edit
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded-full">{product.festival}</span>
                  <div className="flex items-center gap-0.5"><Star size={9} className="text-yellow-400 fill-yellow-400" /><span className="text-[10px] font-bold text-gray-600">{product.rating || 'N/A'}</span></div>
                </div>
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight mb-1.5">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-black text-orange-500">₹{product.price.toLocaleString()}</span>
                    {discount > 0 && <span className="text-[10px] text-gray-400 line-through ml-1">₹{product.originalPrice.toLocaleString()}</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(product)} className="w-7 h-7 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"><Edit2 size={11} /></button>
                    <button onClick={() => setDeleteId(product.id)} className="w-7 h-7 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all"><Trash2 size={11} /></button>
                  </div>
                </div>
                <div className={`mt-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full w-fit ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock < 10 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                  {product.stock === 0 ? 'Out of Stock' : `${product.stock} in stock`}
                </div>
                {product.vendorId === 'admin' && (
                  <div className="mt-1 text-[10px] text-purple-600 font-semibold flex items-center gap-1"><ShieldCheck size={9} /> Admin Added</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-bold text-gray-600">No products found</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p ? 'fest-gradient text-white' : 'border border-gray-200 text-gray-600 hover:border-orange-400'}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* View Modal */}
      <Modal isOpen={!!viewProduct} onClose={() => setViewProduct(null)} title="Product Details">
        {viewProduct && (
          <div className="flex flex-col gap-4">
            <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-48 object-cover rounded-2xl" />
            <h3 className="font-black text-gray-900 text-lg">{viewProduct.name}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Festival', v: viewProduct.festival }, { l: 'Category', v: viewProduct.category },
                { l: 'Price', v: `₹${viewProduct.price.toLocaleString()}` }, { l: 'Stock', v: `${viewProduct.stock} units` },
                { l: 'Rating', v: viewProduct.rating || 'N/A' }, { l: 'Reviews', v: viewProduct.reviews },
                { l: 'Vendor', v: viewProduct.vendorId === 'admin' ? 'Admin' : viewProduct.vendorId },
              ].map(item => (
                <div key={item.l} className="bg-gray-50 rounded-xl p-2.5">
                  <div className="text-xs text-gray-400 mb-0.5">{item.l}</div>
                  <div className="font-bold text-gray-900 text-sm">{item.v}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 bg-orange-50 rounded-xl p-3">{viewProduct.description}</p>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editProduct ? 'Edit Product' : 'Add Product'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          {[{ l: 'Price (₹) *', k: 'price' }, { l: 'Original Price', k: 'originalPrice' }, { l: 'Stock', k: 'stock' }].map(f => (
            <div key={f.k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.l}</label>
              <input value={(form as any)[f.k]} onChange={e => setForm(x => ({ ...x, [f.k]: e.target.value }))} placeholder={f.l}
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              placeholder="Product description" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm resize-none" />
          </div>
          <div className="col-span-2">
            <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
              {editProduct ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteId} title="Delete Product" message="Delete this product from all listings?"
        confirmText="Delete Product" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

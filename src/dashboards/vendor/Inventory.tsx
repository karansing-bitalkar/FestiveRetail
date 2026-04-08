import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, AlertTriangle, Plus, Minus, Package, CheckCircle, RefreshCw, Search } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

export default function Inventory() {
  const { products: allProducts, updateProduct } = useProductStore();
  const products = allProducts.filter(p => !p.isCombo);

  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stockInput, setStockInput] = useState('');
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkAmount, setBulkAmount] = useState('50');
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [inlineEdits, setInlineEdits] = useState<Record<string, number>>({});

  const filtered = useMemo(() => products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.festival.toLowerCase().includes(search.toLowerCase())
  ), [products, search]);

  const lowStock = products.filter(p => p.stock < 10 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const healthy = products.filter(p => p.stock >= 10).length;

  const handleInlineChange = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const current = inlineEdits[id] ?? product.stock;
    const newVal = Math.max(0, current + delta);
    setInlineEdits(prev => ({ ...prev, [id]: newVal }));
  };

  const handleInlineSave = (product: Product) => {
    const newStock = inlineEdits[product.id] ?? product.stock;
    if (newStock === product.stock) return;
    updateProduct({ ...product, stock: newStock });
    setInlineEdits(prev => { const n = { ...prev }; delete n[product.id]; return n; });
    toast.success(`Stock updated: ${product.name} → ${newStock} units`);
  };

  const handleModalUpdate = () => {
    if (editProduct && stockInput !== '') {
      updateProduct({ ...editProduct, stock: Number(stockInput) });
      toast.success(`Stock updated for ${editProduct.name}!`);
      setEditProduct(null);
    }
  };

  const handleBulkRestock = () => {
    const amount = Number(bulkAmount);
    if (!amount || bulkSelected.length === 0) { toast.error('Select products and enter amount first.'); return; }
    bulkSelected.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) updateProduct({ ...product, stock: product.stock + amount });
    });
    toast.success(`Restocked ${bulkSelected.length} products with +${amount} units each!`);
    setBulkModal(false);
    setBulkSelected([]);
  };

  const toggleBulkSelect = (id: string) => {
    setBulkSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Inventory Management</h2>
          <p className="text-gray-500 text-sm">Live stock levels from product store</p>
        </div>
        <button onClick={() => setBulkModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all shadow-md">
          <RefreshCw size={14} /> Bulk Restock
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Low Stock (<10)', value: lowStock, icon: AlertTriangle, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: 'Out of Stock', value: outOfStock, icon: Package, color: 'bg-red-50 text-red-700 border-red-200' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.color} border rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1.5"><Icon size={14} /><span className="text-xs font-semibold">{s.label}</span></div>
              <div className="text-3xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Low stock alert */}
      <AnimatePresence>
        {lowStock > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-yellow-700 text-sm font-bold">{lowStock} products running low on stock!</p>
              <p className="text-yellow-600 text-xs">Restock soon to avoid missed sales.</p>
            </div>
            <button onClick={() => setBulkModal(true)}
              className="ml-auto px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-200 transition-all">
              Bulk Restock
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['', 'Product', 'Festival', 'Category', 'Stock Level', 'Inline Edit', 'Status', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, i) => {
                const displayStock = inlineEdits[p.id] ?? p.stock;
                const isLow = p.stock < 10;
                const isOut = p.stock === 0;
                const hasChange = inlineEdits[p.id] !== undefined && inlineEdits[p.id] !== p.stock;
                return (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className={`transition-colors ${isOut ? 'bg-red-50/40' : isLow ? 'bg-yellow-50/40' : 'hover:bg-orange-50/20'}`}>
                    {/* Bulk checkbox */}
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={bulkSelected.includes(p.id)} onChange={() => toggleBulkSelect(p.id)}
                        className="w-4 h-4 accent-orange-500 rounded cursor-pointer" />
                    </td>
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-gray-100" />
                        <span className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[150px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-orange-500">{p.festival}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{p.category}</td>
                    {/* Stock bar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : isLow ? 'bg-yellow-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8">{p.stock}</span>
                      </div>
                    </td>
                    {/* Inline +/- editor */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleInlineChange(p.id, -1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-500 transition-all">
                          <Minus size={12} />
                        </button>
                        <span className={`w-8 text-center text-sm font-black ${hasChange ? 'text-orange-500' : 'text-gray-700'}`}>{displayStock}</span>
                        <button onClick={() => handleInlineChange(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-100 hover:text-green-500 transition-all">
                          <Plus size={12} />
                        </button>
                        {hasChange && (
                          <button onClick={() => handleInlineSave(p)}
                            className="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-all ml-1">
                            <CheckCircle size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl inline-flex items-center gap-1 ${isOut ? 'bg-red-100 text-red-600' : isLow ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                        {isOut ? <><AlertTriangle size={10} /> Out of Stock</> : isLow ? <><AlertTriangle size={10} /> Low Stock</> : <><CheckCircle size={10} /> In Stock</>}
                      </span>
                    </td>
                    {/* Edit button */}
                    <td className="px-4 py-3">
                      <button onClick={() => { setEditProduct(p); setStockInput(String(p.stock)); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all">
                        <Edit2 size={11} /> Set
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Stock Modal */}
      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Set Stock Quantity">
        <div className="flex flex-col gap-4">
          {editProduct && (
            <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-2xl">
              <img src={editProduct.image} alt={editProduct.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-900 text-sm">{editProduct.name}</p>
                <p className="text-xs text-gray-500">Current: <strong className="text-orange-500">{editProduct.stock} units</strong></p>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Stock Quantity</label>
            <input type="number" value={stockInput} onChange={e => setStockInput(e.target.value)} min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          <button onClick={handleModalUpdate} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Update Stock
          </button>
        </div>
      </Modal>

      {/* Bulk Restock Modal */}
      <Modal isOpen={bulkModal} onClose={() => setBulkModal(false)} title="Bulk Restock">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">Add stock to multiple products at once.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Units to Add per Product</label>
            <input type="number" value={bulkAmount} onChange={e => setBulkAmount(e.target.value)} min="1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Products ({bulkSelected.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-2 pr-1">
              {products.map(p => (
                <label key={p.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border-2 transition-all ${bulkSelected.includes(p.id) ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}>
                  <input type="checkbox" checked={bulkSelected.includes(p.id)} onChange={() => toggleBulkSelect(p.id)} className="accent-orange-500" />
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400">Stock: {p.stock}</p>
                  </div>
                  {p.stock < 10 && <AlertTriangle size={12} className="text-yellow-500 flex-shrink-0" />}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBulkSelected(products.map(p => p.id))}
              className="flex-1 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-semibold hover:bg-orange-100 transition-all">
              Select All
            </button>
            <button onClick={() => setBulkSelected(products.filter(p => p.stock < 10).map(p => p.id))}
              className="flex-1 py-2 bg-yellow-50 text-yellow-600 rounded-xl text-sm font-semibold hover:bg-yellow-100 transition-all">
              Low Stock Only
            </button>
          </div>
          <button onClick={handleBulkRestock} disabled={bulkSelected.length === 0}
            className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <RefreshCw size={15} /> Restock {bulkSelected.length} Products (+{bulkAmount} each)
          </button>
        </div>
      </Modal>
    </div>
  );
}

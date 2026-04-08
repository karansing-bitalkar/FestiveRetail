import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiAlertTriangle } from 'react-icons/fi';
import { MdInventory } from 'react-icons/md';
import { PRODUCTS } from '@/constants/data';
import { Product } from '@/types';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

export default function Inventory() {
  const [products, setProducts] = useState(PRODUCTS);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [stock, setStock] = useState('');

  const handleUpdate = () => {
    if (editProduct) {
      setProducts(ps => ps.map(p => p.id === editProduct.id ? { ...p, stock: Number(stock) } : p));
      toast.success(`Stock updated for ${editProduct.name}!`);
      setEditProduct(null);
    }
  };

  const lowStock = products.filter(p => p.stock < 15);
  const outOfStock = products.filter(p => p.stock === 0);

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Inventory Management</h2><p className="text-gray-500 text-sm">Manage your product stock levels</p></div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Products', value: products.length, color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Low Stock (<15)', value: lowStock.length, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: 'Out of Stock', value: outOfStock.length, color: 'bg-red-50 text-red-700 border-red-200' },
        ].map(s => (
          <div key={s.label} className={`${s.color} border rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-black mb-0.5">{s.value}</div>
            <div className="text-sm font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
          <FiAlertTriangle className="text-yellow-500 text-xl flex-shrink-0" />
          <p className="text-yellow-700 text-sm font-medium">{lowStock.length} products are running low on stock. Restock soon to avoid missed sales!</p>
        </div>
      )}

      {/* Inventory table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['Product', 'Category', 'Festival', 'Stock', 'Status', 'Action'].map(h => <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                      <span className="font-medium text-gray-900 text-sm line-clamp-1 max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{p.category}</td>
                  <td className="px-5 py-4 text-xs font-medium text-orange-500">{p.festival}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.stock === 0 ? 'bg-red-500' : p.stock < 15 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(100, (p.stock / 100) * 100)}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock < 15 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => { setEditProduct(p); setStock(String(p.stock)); }} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-all">
                      <FiEdit2 className="text-xs" /> Update
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)} title="Update Stock">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">Updating stock for: <strong className="text-gray-900">{editProduct?.name}</strong></p>
          <p className="text-sm text-gray-500">Current stock: <strong className="text-orange-500">{editProduct?.stock} units</strong></p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Stock Quantity</label>
            <input type="number" value={stock} onChange={e => setStock(e.target.value)} min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          <button onClick={handleUpdate} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">Update Stock</button>
        </div>
      </Modal>
    </div>
  );
}

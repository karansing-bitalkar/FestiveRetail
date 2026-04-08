import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, AlertTriangle, Package } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

export default function Inventory() {
  const { products, updateProduct } = useProductStore();
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkQty, setBulkQty] = useState(50);

  const updateStock = (id: string, delta: number) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const newStock = Math.max(0, p.stock + delta);
    updateProduct({ ...p, stock: newStock });
  };

  const handleBulkRestock = () => {
    const lowStock = products.filter(p => p.stock < 10);
    lowStock.forEach(p => updateProduct({ ...p, stock: bulkQty }));
    toast.success(`Restocked ${lowStock.length} products to ${bulkQty} units`);
    setBulkModal(false);
  };

  const lowStockCount = products.filter(p => p.stock < 10).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Inventory</h2>
          <p className="text-gray-500 text-sm">{products.length} products · {lowStockCount} low stock</p>
        </div>
        {lowStockCount > 0 && (
          <button onClick={() => setBulkModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-all">
            <Package size={15} /> Bulk Restock ({lowStockCount})
          </button>
        )}
      </div>

      {lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-sm text-red-700">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span><strong>{lowStockCount} products</strong> have low stock (under 10 units). Consider restocking soon.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{['#', 'Product', 'Festival', 'Price', 'Stock', 'Status', 'Adjust Stock'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className={`hover:bg-orange-50/30 transition-colors ${p.stock < 10 ? 'bg-red-50/50' : ''}`}>
                  <td className="px-5 py-4 text-xs text-gray-400">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=80&q=60')} />
                      <span className="font-semibold text-gray-900 text-sm max-w-[160px] truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.festival}</td>
                  <td className="px-5 py-4 text-sm font-bold text-orange-500">₹{p.price.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-black text-gray-900">{p.stock}</td>
                  <td className="px-5 py-4">
                    {p.stock === 0 ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>
                    ) : p.stock < 10 ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1 w-fit">
                        <AlertTriangle size={10} /> Low Stock
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">In Stock</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1 w-fit">
                      <button onClick={() => updateStock(p.id, -5)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"><Minus size={13} /></button>
                      <span className="font-bold text-sm w-6 text-center">{p.stock}</span>
                      <button onClick={() => updateStock(p.id, 5)} className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-green-500 transition-colors"><Plus size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={bulkModal} onClose={() => setBulkModal(false)} title="Bulk Restock">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">Restock all {lowStockCount} low-stock products to the specified quantity.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Stock Quantity</label>
            <input type="number" value={bulkQty} onChange={e => setBulkQty(+e.target.value)} min={1}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
          </div>
          <button onClick={handleBulkRestock} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            Restock {lowStockCount} Products
          </button>
        </div>
      </Modal>
    </div>
  );
}

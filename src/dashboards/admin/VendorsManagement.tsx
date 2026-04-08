import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import { MdCheckCircle, MdCancel, MdPending, MdVerifiedUser } from 'react-icons/md';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const VENDORS = [
  { id: 'v1', name: 'Raj Enterprises', email: 'vendor@festiveretail.com', gst: '27AABCU9603R1ZW', city: 'Pune', products: 24, orders: 48, revenue: 120000, status: 'approved', joinedAt: '2023-11-20' },
  { id: 'v2', name: 'Festive Creations', email: 'festive@example.com', gst: '29AAGCF8587M1ZW', city: 'Bangalore', products: 18, orders: 32, revenue: 85000, status: 'pending', joinedAt: '2024-10-25' },
  { id: 'v3', name: 'Diwali Decor Hub', email: 'diwali@example.com', gst: '07AAHCG8291R1Z5', city: 'Delhi', products: 35, orders: 67, revenue: 210000, status: 'approved', joinedAt: '2023-08-15' },
  { id: 'v4', name: 'Wedding Wonders', email: 'wedding@example.com', gst: '27AAKCW4398P1ZM', city: 'Mumbai', products: 12, orders: 0, revenue: 0, status: 'pending', joinedAt: '2024-11-01' },
  { id: 'v5', name: 'Color Carnival', email: 'holi@example.com', gst: '33AACCM9573L1ZT', city: 'Chennai', products: 8, orders: 15, revenue: 42000, status: 'rejected', joinedAt: '2024-09-10' },
];

export default function VendorsManagement() {
  const [vendors, setVendors] = useState(VENDORS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [deleteVendor, setDeleteVendor] = useState<string | null>(null);

  const handleStatus = (id: string, status: string) => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`Vendor ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
  };
  const handleDelete = () => { setVendors(vs => vs.filter(v => v.id !== deleteVendor)); toast.success('Vendor removed'); setDeleteVendor(null); };

  const filtered = vendors.filter(v => {
    if (filter !== 'all' && v.status !== filter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Vendors Management</h2><p className="text-gray-500 text-sm">{vendors.filter(v => v.status === 'pending').length} pending approvals</p></div>
      <div className="grid grid-cols-3 gap-4">
        {[{ l: 'Total Vendors', v: vendors.length, c: 'bg-purple-50 text-purple-700' }, { l: 'Approved', v: vendors.filter(v => v.status === 'approved').length, c: 'bg-green-50 text-green-700' }, { l: 'Pending', v: vendors.filter(v => v.status === 'pending').length, c: 'bg-yellow-50 text-yellow-700' }].map(s => (
          <div key={s.l} className={`${s.c} rounded-2xl p-4 text-center`}><div className="text-3xl font-black mb-0.5">{s.v}</div><div className="text-sm font-medium">{s.l}</div></div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
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
            <thead className="bg-gray-50"><tr>{['Vendor', 'GST', 'City', 'Products', 'Revenue', 'Status', 'Actions'].map(h => <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v, i) => (
                <motion.tr key={v.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-bold text-sm">{v.name.charAt(0)}</div>
                      <div><div className="font-semibold text-gray-900 text-sm">{v.name}</div><div className="text-xs text-gray-400">{v.email}</div></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 font-mono">{v.gst}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{v.city}</td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">{v.products}</td>
                  <td className="px-5 py-4 text-sm font-bold text-green-600">₹{v.revenue.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${v.status === 'approved' ? 'bg-green-100 text-green-700' : v.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {v.status === 'approved' ? <MdVerifiedUser className="text-xs" /> : v.status === 'pending' ? <MdPending className="text-xs" /> : <MdCancel className="text-xs" />}
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {v.status === 'pending' && (<>
                        <button onClick={() => handleStatus(v.id, 'approved')} className="p-1.5 bg-green-50 text-green-500 rounded-lg hover:bg-green-100 transition-all"><MdCheckCircle className="text-sm" /></button>
                        <button onClick={() => handleStatus(v.id, 'rejected')} className="p-1.5 bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-all"><MdCancel className="text-sm" /></button>
                      </>)}
                      <button onClick={() => setDeleteVendor(v.id)} className="p-1.5 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-400 transition-all"><FiTrash2 className="text-sm" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmModal isOpen={!!deleteVendor} title="Remove Vendor" message="Remove this vendor from the platform? Their products will also be unlisted." confirmText="Remove Vendor" onConfirm={handleDelete} onCancel={() => setDeleteVendor(null)} />
    </div>
  );
}

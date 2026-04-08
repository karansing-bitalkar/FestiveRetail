import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Eye, CheckCircle, XCircle, Clock, ShieldCheck, Store, TrendingUp, Users } from 'lucide-react';
import ConfirmModal from '@/components/features/ConfirmModal';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

interface Vendor {
  id: string; name: string; email: string; gst: string; city: string;
  products: number; orders: number; revenue: number;
  status: 'approved' | 'pending' | 'blocked';
  joinedAt: string; phone: string; category: string;
}

const INITIAL_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Raj Enterprises', email: 'vendor@festiveretail.com', gst: '27AABCU9603R1ZW', city: 'Pune', products: 24, orders: 48, revenue: 120000, status: 'approved', joinedAt: '2023-11-20', phone: '+91 98765 43210', category: 'Diwali Decor' },
  { id: 'v2', name: 'Festive Creations', email: 'festive@example.com', gst: '29AAGCF8587M1ZW', city: 'Bangalore', products: 18, orders: 32, revenue: 85000, status: 'pending', joinedAt: '2024-10-25', phone: '+91 91234 56789', category: 'Gift Hampers' },
  { id: 'v3', name: 'Diwali Decor Hub', email: 'diwali@example.com', gst: '07AAHCG8291R1Z5', city: 'Delhi', products: 35, orders: 67, revenue: 210000, status: 'approved', joinedAt: '2023-08-15', phone: '+91 70000 11111', category: 'Home Decor' },
  { id: 'v4', name: 'Wedding Wonders', email: 'wedding@example.com', gst: '27AAKCW4398P1ZM', city: 'Mumbai', products: 12, orders: 0, revenue: 0, status: 'pending', joinedAt: '2024-11-01', phone: '+91 80000 22222', category: 'Wedding' },
  { id: 'v5', name: 'Color Carnival', email: 'holi@example.com', gst: '33AACCM9573L1ZT', city: 'Chennai', products: 8, orders: 15, revenue: 42000, status: 'blocked', joinedAt: '2024-09-10', phone: '+91 63000 33333', category: 'Holi Special' },
  { id: 'v6', name: 'Sacred Rituals', email: 'sacred@example.com', gst: '24AABCS1234R1ZX', city: 'Ahmedabad', products: 0, orders: 0, revenue: 0, status: 'pending', joinedAt: '2024-11-05', phone: '+91 77000 44444', category: 'Puja Items' },
];

type Tab = 'pending' | 'approved' | 'blocked';

const TAB_CONFIG: Record<Tab, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: 'Pending Approval', icon: Clock, color: 'text-yellow-700', bg: 'bg-yellow-100' },
  approved: { label: 'Approved', icon: CheckCircle, color: 'text-green-700', bg: 'bg-green-100' },
  blocked: { label: 'Blocked', icon: XCircle, color: 'text-red-700', bg: 'bg-red-100' },
};

export default function VendorsManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [deleteVendor, setDeleteVendor] = useState<string | null>(null);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'approved' | 'blocked' } | null>(null);

  const handleStatusChange = (id: string, status: 'approved' | 'blocked') => {
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status } : v));
    toast.success(`Vendor ${status === 'approved' ? 'approved — they can now login!' : 'blocked successfully.'}`);
    setConfirmAction(null);
  };

  const handleDelete = () => {
    setVendors(vs => vs.filter(v => v.id !== deleteVendor));
    toast.success('Vendor removed from platform.');
    setDeleteVendor(null);
  };

  const tabVendors = vendors.filter(v => {
    if (v.status !== activeTab) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = { pending: vendors.filter(v => v.status === 'pending').length, approved: vendors.filter(v => v.status === 'approved').length, blocked: vendors.filter(v => v.status === 'blocked').length };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Vendors Management</h2>
        <p className="text-gray-500 text-sm">{counts.pending} pending approvals · {counts.approved} active vendors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Vendors', value: vendors.length, icon: Store, color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
          { label: 'Approved', value: counts.approved, icon: CheckCircle, color: 'bg-green-50 text-green-700', border: 'border-green-200' },
          { label: 'Pending', value: counts.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200' },
          { label: 'Blocked', value: counts.blocked, icon: XCircle, color: 'bg-red-50 text-red-700', border: 'border-red-200' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.color} border ${s.border} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={16} />
                <span className="text-xs font-semibold">{s.label}</span>
              </div>
              <div className="text-3xl font-black">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit">
        {(Object.keys(TAB_CONFIG) as Tab[]).map(tab => {
          const cfg = TAB_CONFIG[tab];
          const Icon = cfg.icon;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon size={14} className={activeTab === tab ? cfg.color.replace('text-', 'text-') : ''} />
              {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? `${cfg.bg} ${cfg.color}` : 'bg-gray-200 text-gray-500'}`}>
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm bg-white" />
      </div>

      {/* Vendor Cards */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
          {tabVendors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-5xl mb-3">{activeTab === 'pending' ? '⏳' : activeTab === 'approved' ? '✅' : '🚫'}</div>
              <p className="font-bold text-gray-600">No {activeTab} vendors</p>
            </div>
          ) : tabVendors.map((vendor, i) => (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Vendor info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 fest-gradient rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                    {vendor.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900">{vendor.name}</span>
                      {vendor.status === 'approved' && <ShieldCheck size={14} className="text-green-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{vendor.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{vendor.city}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-orange-500 font-medium">{vendor.category}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">Joined {vendor.joinedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-900">{vendor.products}</div>
                    <div className="text-xs text-gray-400">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-gray-900">{vendor.orders}</div>
                    <div className="text-xs text-gray-400">Orders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-green-600">₹{(vendor.revenue / 1000).toFixed(0)}K</div>
                    <div className="text-xs text-gray-400">Revenue</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setViewVendor(vendor)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all">
                    <Eye size={13} /> View
                  </button>

                  {activeTab === 'pending' && (
                    <>
                      <button onClick={() => setConfirmAction({ id: vendor.id, action: 'approved' })}
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-semibold hover:bg-green-100 transition-all">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button onClick={() => setConfirmAction({ id: vendor.id, action: 'blocked' })}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all">
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}

                  {activeTab === 'approved' && (
                    <button onClick={() => setConfirmAction({ id: vendor.id, action: 'blocked' })}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all">
                      <XCircle size={13} /> Block
                    </button>
                  )}

                  {activeTab === 'blocked' && (
                    <button onClick={() => setConfirmAction({ id: vendor.id, action: 'approved' })}
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-semibold hover:bg-green-100 transition-all">
                      <CheckCircle size={13} /> Unblock
                    </button>
                  )}

                  <button onClick={() => setDeleteVendor(vendor.id)}
                    className="w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Pending notice */}
              {activeTab === 'pending' && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <Clock size={14} className="text-yellow-600 flex-shrink-0" />
                  <p className="text-yellow-700 text-xs font-medium">Awaiting approval. Vendor cannot login or list products until approved.</p>
                </div>
              )}
              {activeTab === 'approved' && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-xs font-medium">Active vendor. Products visible in shop. Can login with <strong>{vendor.email}</strong>.</p>
                </div>
              )}
              {activeTab === 'blocked' && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <XCircle size={14} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-xs font-medium">Blocked vendor. Cannot login or list products. Products hidden from shop.</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* View Vendor Modal */}
      <Modal isOpen={!!viewVendor} onClose={() => setViewVendor(null)} title="Vendor Details">
        {viewVendor && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 fest-gradient rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                {viewVendor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-black text-gray-900 text-lg">{viewVendor.name}</h3>
                <p className="text-gray-500 text-sm">{viewVendor.email}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${viewVendor.status === 'approved' ? 'bg-green-100 text-green-700' : viewVendor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {viewVendor.status}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'GST Number', value: viewVendor.gst },
                { label: 'City', value: viewVendor.city },
                { label: 'Phone', value: viewVendor.phone },
                { label: 'Category', value: viewVendor.category },
                { label: 'Joined', value: viewVendor.joinedAt },
                { label: 'Products', value: viewVendor.products },
                { label: 'Total Orders', value: viewVendor.orders },
                { label: 'Revenue', value: `₹${viewVendor.revenue.toLocaleString()}` },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</div>
                  <div className="font-bold text-gray-900 text-sm">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              {viewVendor.status === 'pending' && (
                <button onClick={() => { handleStatusChange(viewVendor.id, 'approved'); setViewVendor(null); }}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Approve Vendor
                </button>
              )}
              {viewVendor.status === 'approved' && (
                <button onClick={() => { handleStatusChange(viewVendor.id, 'blocked'); setViewVendor(null); }}
                  className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                  <XCircle size={16} /> Block Vendor
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={!!confirmAction}
        title={confirmAction?.action === 'approved' ? 'Approve Vendor' : 'Block Vendor'}
        message={confirmAction?.action === 'approved'
          ? 'Approve this vendor? They will be able to login and their products will appear in the shop.'
          : 'Block this vendor? Their products will be hidden from the shop and they cannot login.'}
        confirmText={confirmAction?.action === 'approved' ? 'Yes, Approve' : 'Yes, Block'}
        onConfirm={() => confirmAction && handleStatusChange(confirmAction.id, confirmAction.action)}
        onCancel={() => setConfirmAction(null)}
      />

      {/* Delete Modal */}
      <ConfirmModal isOpen={!!deleteVendor} title="Remove Vendor" message="Permanently remove this vendor? All their products will be delisted." confirmText="Remove Vendor"
        onConfirm={handleDelete} onCancel={() => setDeleteVendor(null)} />
    </div>
  );
}

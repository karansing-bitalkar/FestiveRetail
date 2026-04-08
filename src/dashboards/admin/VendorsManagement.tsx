import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Eye, Store } from 'lucide-react';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

const INITIAL_VENDORS = [
  { id: 'v1', name: 'Raj Enterprises', email: 'vendor@festiveretail.com', phone: '+91 87654 32109', category: 'Festive Items', status: 'approved' as const, products: 12, revenue: '₹1.2L', joinedAt: '2023-11-20', gst: 'GSTIN27ABCDE1234F1Z5' },
  { id: 'v2', name: 'Festive Creations', email: 'festive@example.com', phone: '+91 44321 09800', category: 'Decoration', status: 'approved' as const, products: 8, revenue: '₹68K', joinedAt: '2024-06-01', gst: 'GSTIN27XYZAB5678G2H6' },
  { id: 'v3', name: 'Wedding Wonders', email: 'wedding@example.com', phone: '+91 34321 09800', category: 'Wedding', status: 'pending' as const, products: 0, revenue: '₹0', joinedAt: '2024-07-01', gst: 'GSTIN27MNOPQ9012I3J7' },
  { id: 'v4', name: 'Holi Masters', email: 'holi@example.com', phone: '+91 24321 09800', category: 'Holi Special', status: 'pending' as const, products: 0, revenue: '₹0', joinedAt: '2024-11-01', gst: 'GSTIN27RSTUV3456K4L8' },
  { id: 'v5', name: 'Spammy Seller', email: 'spam@example.com', phone: '+91 00000 00000', category: 'Unknown', status: 'blocked' as const, products: 0, revenue: '₹0', joinedAt: '2024-10-01', gst: 'INVALID' },
];

type Tab = 'pending' | 'approved' | 'blocked';

const STATUS_ICONS = { approved: CheckCircle, pending: Clock, blocked: XCircle };
const STATUS_COLORS = { approved: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', blocked: 'bg-red-100 text-red-700' };

export default function VendorsManagement() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [tab, setTab] = useState<Tab>('pending');
  const [viewVendor, setViewVendor] = useState<typeof INITIAL_VENDORS[0] | null>(null);
  const [pendingAction, setPendingAction] = useState<{ id: string; action: 'approve' | 'reject' | 'block' | 'unblock' } | null>(null);

  const byTab = vendors.filter(v => v.status === tab);

  const executeAction = () => {
    if (!pendingAction) return;
    const { id, action } = pendingAction;
    const statusMap = { approve: 'approved', reject: 'blocked', block: 'blocked', unblock: 'approved' } as const;
    setVendors(vs => vs.map(v => v.id === id ? { ...v, status: statusMap[action] } : v));
    toast.success(`Vendor ${action}d successfully`);
    setPendingAction(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">Vendors Management</h2>
        <p className="text-gray-500 text-sm">{vendors.length} total vendors</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['pending', 'approved', 'blocked'] as Tab[]).map(t => {
          const count = vendors.filter(v => v.status === t).length;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t} <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full ${tab === t ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {byTab.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">No {tab} vendors</div>
        ) : byTab.map((vendor, i) => {
          const StatusIcon = STATUS_ICONS[vendor.status];
          return (
            <motion.div key={vendor.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 fest-gradient rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  <Store size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 truncate">{vendor.name}</p>
                  <p className="text-xs text-gray-500 truncate">{vendor.email}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ${STATUS_COLORS[vendor.status]}`}>
                  <StatusIcon size={10} /> {vendor.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400 mb-0.5">Products</p><p className="font-bold text-gray-900">{vendor.products}</p></div>
                <div className="bg-gray-50 rounded-lg p-2"><p className="text-gray-400 mb-0.5">Revenue</p><p className="font-bold text-orange-500">{vendor.revenue}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setViewVendor(vendor)} className="flex-1 py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
                  <Eye size={12} /> View
                </button>
                {vendor.status === 'pending' && <>
                  <button onClick={() => setPendingAction({ id: vendor.id, action: 'approve' })} className="flex-1 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-1"><CheckCircle size={12} /> Approve</button>
                  <button onClick={() => setPendingAction({ id: vendor.id, action: 'reject' })} className="flex-1 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-1"><XCircle size={12} /> Reject</button>
                </>}
                {vendor.status === 'approved' && (
                  <button onClick={() => setPendingAction({ id: vendor.id, action: 'block' })} className="flex-1 py-2 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-100 transition-all">Block</button>
                )}
                {vendor.status === 'blocked' && (
                  <button onClick={() => setPendingAction({ id: vendor.id, action: 'unblock' })} className="flex-1 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-xl hover:bg-green-100 transition-all">Unblock</button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View Modal */}
      <Modal isOpen={!!viewVendor} onClose={() => setViewVendor(null)} title={viewVendor?.name || ''}>
        {viewVendor && (
          <div className="flex flex-col gap-3 text-sm">
            {[
              { l: 'Email', v: viewVendor.email },
              { l: 'Phone', v: viewVendor.phone },
              { l: 'Category', v: viewVendor.category },
              { l: 'GST Number', v: viewVendor.gst },
              { l: 'Joined', v: viewVendor.joinedAt },
              { l: 'Products', v: String(viewVendor.products) },
              { l: 'Revenue', v: viewVendor.revenue },
            ].map(item => (
              <div key={item.l} className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">{item.l}</span>
                <span className="font-semibold text-gray-900">{item.v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal isOpen={!!pendingAction}
        title={pendingAction ? `${pendingAction.action.charAt(0).toUpperCase() + pendingAction.action.slice(1)} Vendor` : ''}
        message={pendingAction ? `Are you sure you want to ${pendingAction.action} this vendor?` : ''}
        confirmText={pendingAction?.action || ''}
        onConfirm={executeAction} onCancel={() => setPendingAction(null)} />
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiCheck } from 'react-icons/fi';
import { ADDRESSES } from '@/constants/data';
import { Address } from '@/types';
import Modal from '@/components/features/Modal';
import ConfirmModal from '@/components/features/ConfirmModal';
import { toast } from 'sonner';

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>(ADDRESSES);
  const [showModal, setShowModal] = useState(false);
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [deleteAddr, setDeleteAddr] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', street: '', city: '', state: '', pincode: '' });

  const openAdd = () => { setEditAddr(null); setForm({ label: '', street: '', city: '', state: '', pincode: '' }); setShowModal(true); };
  const openEdit = (addr: Address) => { setEditAddr(addr); setForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode }); setShowModal(true); };

  const handleSave = () => {
    if (editAddr) {
      setAddresses(a => a.map(x => x.id === editAddr.id ? { ...x, ...form } : x));
      toast.success('Address updated successfully!');
    } else {
      setAddresses(a => [...a, { id: Date.now().toString(), ...form, isDefault: a.length === 0 }]);
      toast.success('Address added successfully!');
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    setAddresses(a => a.filter(x => x.id !== deleteAddr));
    toast.success('Address deleted');
    setDeleteAddr(null);
  };

  const setDefault = (id: string) => {
    setAddresses(a => a.map(x => ({ ...x, isDefault: x.id === id })));
    toast.success('Default address updated!');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 mb-1">Address Management</h2><p className="text-gray-500 text-sm">{addresses.length}/10 addresses saved</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
          <FiPlus /> Add Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <motion.div key={addr.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${addr.isDefault ? 'border-orange-400 shadow-orange-100' : 'border-gray-100 hover:border-orange-200'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${addr.isDefault ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-600'}`}>{addr.label}</div>
                {addr.isDefault && <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold"><FiCheck /> Default</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(addr)} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-all"><FiEdit2 className="text-sm" /></button>
                <button onClick={() => setDeleteAddr(addr.id)} className="w-8 h-8 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all"><FiTrash2 className="text-sm" /></button>
              </div>
            </div>
            <div className="flex items-start gap-2 text-gray-700 text-sm mb-3">
              <FiMapPin className="text-orange-400 mt-0.5 flex-shrink-0" />
              <span>{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</span>
            </div>
            {!addr.isDefault && (
              <button onClick={() => setDefault(addr.id)} className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition-colors">Set as Default</button>
            )}
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editAddr ? 'Edit Address' : 'Add New Address'}>
        <div className="flex flex-col gap-4">
          {[
            { label: 'Address Label', key: 'label', placeholder: 'e.g. Home, Office, Parents' },
            { label: 'Street Address', key: 'street', placeholder: 'House/Flat no., Street, Area' },
            { label: 'City', key: 'city', placeholder: 'City name' },
            { label: 'State', key: 'state', placeholder: 'State name' },
            { label: 'Pincode', key: 'pincode', placeholder: '6-digit pincode' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} placeholder={f.placeholder}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            {editAddr ? 'Save Changes' : 'Add Address'}
          </button>
        </div>
      </Modal>

      <ConfirmModal isOpen={!!deleteAddr} title="Delete Address" message="Are you sure you want to delete this address?"
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteAddr(null)} />
    </div>
  );
}

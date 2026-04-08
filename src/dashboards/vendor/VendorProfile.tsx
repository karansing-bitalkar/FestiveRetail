import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Mail, Phone, MapPin, Calendar, Star, BadgeCheck, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

export default function VendorProfile() {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', gst: '27AABCU9603R1ZW', description: 'Premium festive products seller with 5+ years experience', city: 'Pune', state: 'Maharashtra' });

  const handleSave = () => { toast.success('Profile updated successfully!'); setShowEdit(false); };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 mb-1">Vendor Profile</h2><p className="text-gray-500 text-sm">Manage your store information</p></div>
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
          <Edit2 size={15} /> Edit Profile
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-gray-900">{user?.name}</h3>
              <BadgeCheck size={20} className="text-blue-500" />
            </div>
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-bold mt-1">Verified Vendor</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: Mail, label: 'Email', value: user?.email },
            { icon: Phone, label: 'Phone', value: user?.phone || '+91 87654 32109' },
            { icon: Store, label: 'GST Number', value: form.gst },
            { icon: MapPin, label: 'Location', value: `${form.city}, ${form.state}` },
            { icon: Calendar, label: 'Member Since', value: user?.joinedAt },
            { icon: Star, label: 'Vendor Rating', value: '4.8 / 5.0' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-purple-100 text-purple-500 rounded-lg flex items-center justify-center flex-shrink-0"><f.icon size={18} /></div>
              <div><div className="text-xs text-gray-400 font-medium">{f.label}</div><div className="text-sm font-semibold text-gray-900">{f.value}</div></div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <div className="text-xs text-gray-400 font-medium mb-1">Store Description</div>
          <p className="text-sm text-gray-700">{form.description}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4">Store Performance</h4>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[{ v: '24', l: 'Products' }, { v: '₹1.2L', l: 'Revenue' }, { v: '48', l: 'Orders' }, { v: '4.8★', l: 'Rating' }].map(s => (
            <div key={s.l} className="bg-purple-50 rounded-xl p-3">
              <div className="text-xl font-black text-purple-500">{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Vendor Profile">
        <div className="flex flex-col gap-4">
          {[
            { label: 'Business Name', key: 'name' }, { label: 'Phone Number', key: 'phone' },
            { label: 'GST Number', key: 'gst' }, { label: 'City', key: 'city' }, { label: 'State', key: 'state' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm resize-none" />
          </div>
          <button onClick={handleSave} className="w-full py-3 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl font-bold hover:opacity-90 transition-all">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import Modal from '@/components/features/Modal';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', email: user?.email || '' });

  const handleSave = () => { toast.success('Profile updated successfully!'); setShowEdit(false); };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-black text-gray-900 mb-1">My Profile</h2><p className="text-gray-500 text-sm">Manage your personal information</p></div>
        <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 px-5 py-2.5 fest-gradient text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-all">
          <FiEdit2 /> Edit Profile
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
        <div className="flex items-center gap-5 mb-7">
          <div className="w-20 h-20 fest-gradient rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg glow-orange">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900">{user?.name}</h3>
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold mt-1">Customer</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { icon: FiUser, label: 'Full Name', value: user?.name },
            { icon: FiMail, label: 'Email Address', value: user?.email },
            { icon: FiPhone, label: 'Phone Number', value: user?.phone || '+91 98765 43210' },
            { icon: FiCalendar, label: 'Member Since', value: user?.joinedAt },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-orange-100 text-orange-500 rounded-lg flex items-center justify-center flex-shrink-0"><f.icon className="text-lg" /></div>
              <div><div className="text-xs text-gray-400 font-medium">{f.label}</div><div className="text-sm font-semibold text-gray-900">{f.value}</div></div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4">Account Stats</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          {[{ v: '3', l: 'Total Orders' }, { v: '5', l: 'Wishlist' }, { v: '₹4,744', l: 'Total Spent' }].map(s => (
            <div key={s.l} className="bg-orange-50 rounded-xl p-4">
              <div className="text-2xl font-black text-orange-500">{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div className="flex flex-col gap-4">
          {[{ label: 'Full Name', key: 'name', type: 'text' }, { label: 'Email', key: 'email', type: 'email' }, { label: 'Phone', key: 'phone', type: 'tel' }].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
            </div>
          ))}
          <button onClick={handleSave} className="w-full py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}

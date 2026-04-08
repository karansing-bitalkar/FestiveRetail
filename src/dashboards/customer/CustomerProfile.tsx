import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Edit2, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function CustomerProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
  });

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">My Profile</h2>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${editing ? 'bg-green-500 text-white hover:bg-green-600' : 'fest-gradient text-white hover:opacity-90'}`}
        >
          {editing ? <><Check size={15} /> Save Changes</> : <><Edit2 size={15} /> Edit Profile</>}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 fest-gradient rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full capitalize">{user?.role} Account</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: 'Full Name', key: 'name', icon: User, type: 'text' },
            { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
            { label: 'Phone Number', key: 'phone', icon: Phone, type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <f.icon size={13} className="text-orange-400" /> {f.label}
              </label>
              {editing ? (
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700">{(form as any)[f.key]}</div>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar size={13} className="text-orange-400" /> Member Since
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700">{user?.joinedAt}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

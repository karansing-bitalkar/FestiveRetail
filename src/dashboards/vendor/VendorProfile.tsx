import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Check, Store, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function VendorProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: 'Pune, Maharashtra',
    gst: 'GSTIN27ABCDE1234F1Z5',
    category: 'Festive Items',
  });

  const handleSave = () => { setEditing(false); toast.success('Profile updated!'); };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Vendor Profile</h2>
        <button onClick={() => editing ? handleSave() : setEditing(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${editing ? 'bg-green-500 text-white hover:bg-green-600' : 'fest-gradient text-white hover:opacity-90'}`}>
          {editing ? <><Check size={15} /> Save</> : <><Edit2 size={15} /> Edit</>}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 fest-gradient rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md">
            <Store size={36} />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full">Verified Vendor</span>
              <span className="text-xs text-gray-500 flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" /> 4.8 Rating</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: 'Business Name', key: 'name', icon: Store, type: 'text' },
            { label: 'Email', key: 'email', icon: Mail, type: 'email' },
            { label: 'Phone', key: 'phone', icon: Phone, type: 'text' },
            { label: 'Address', key: 'address', icon: MapPin, type: 'text' },
            { label: 'GST Number', key: 'gst', icon: User, type: 'text' },
            { label: 'Category', key: 'category', icon: Calendar, type: 'text' },
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
        </div>
      </div>
    </div>
  );
}

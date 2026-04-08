import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, CreditCard, Globe, Mail, Save, Check } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'email', label: 'Email', icon: Mail },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'FestiveRetail',
    tagline: "India's #1 Festive Shopping Platform",
    supportEmail: 'support@festiveretail.com',
    currency: 'INR',
    emailOrders: true,
    emailOffers: true,
    smsOrders: false,
    twoFactor: false,
    maintenanceMode: false,
  });

  const handleSave = () => toast.success('Settings saved successfully!');

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-black text-gray-900">Settings</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-row lg:flex-col gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left whitespace-nowrap ${activeTab === t.id ? 'fest-gradient text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {activeTab === 'general' && (
              <div className="flex flex-col gap-5">
                <h3 className="font-black text-gray-900">General Settings</h3>
                {[
                  { label: 'Site Name', key: 'siteName', type: 'text' },
                  { label: 'Tagline', key: 'tagline', type: 'text' },
                  { label: 'Support Email', key: 'supportEmail', type: 'email' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                    <input type={f.type} value={(settings as any)[f.key]} onChange={e => setSettings(s => ({ ...s, [f.key]: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    Maintenance Mode
                    <button onClick={() => setSettings(s => ({ ...s, maintenanceMode: !s.maintenanceMode }))}
                      className={`relative w-11 h-6 rounded-full transition-all ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.maintenanceMode ? 'left-5.5 translate-x-1' : 'left-0.5'}`} />
                    </button>
                  </label>
                  <p className="text-xs text-gray-400">When enabled, users will see a maintenance message</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col gap-5">
                <h3 className="font-black text-gray-900">Notification Settings</h3>
                {[
                  { key: 'emailOrders', label: 'Order Confirmations', sub: 'Send email for new orders' },
                  { key: 'emailOffers', label: 'Promotional Emails', sub: 'Send festive offers to customers' },
                  { key: 'smsOrders', label: 'SMS Notifications', sub: 'Send SMS for order updates' },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.sub}</p>
                    </div>
                    <button onClick={() => setSettings(x => ({ ...x, [s.key]: !(x as any)[s.key] }))}
                      className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${(settings as any)[s.key] ? 'bg-orange-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${(settings as any)[s.key] ? 'right-0.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="flex flex-col gap-5">
                <h3 className="font-black text-gray-900">Security Settings</h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add extra security to admin accounts</p>
                  </div>
                  <button onClick={() => setSettings(s => ({ ...s, twoFactor: !s.twoFactor }))}
                    className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${settings.twoFactor ? 'bg-orange-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings.twoFactor ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <Shield size={16} className="inline mr-2" />
                  All passwords are encrypted using industry-standard algorithms. Regular security audits are conducted.
                </div>
              </div>
            )}

            {(activeTab === 'payments' || activeTab === 'email') && (
              <div className="flex flex-col gap-4">
                <h3 className="font-black text-gray-900 capitalize">{activeTab} Settings</h3>
                <div className="bg-orange-50 rounded-2xl p-5 text-sm text-orange-700">
                  {activeTab === 'payments' ? 'Payment gateway configuration is managed securely in backend settings. Contact your technical team to update payment credentials.' : 'Email server configuration (SMTP) is managed in environment variables. Contact your technical team to update email settings.'}
                </div>
              </div>
            )}

            <button onClick={handleSave} className="mt-6 flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm">
              <Save size={15} /> Save Settings
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

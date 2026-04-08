import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, CreditCard, Globe, Mail, Headphones, Save } from 'lucide-react';
import { toast } from 'sonner';

const SETTING_SECTIONS = [
  { icon: Bell, label: 'Notifications', color: 'bg-orange-100 text-orange-500', settings: [
    { label: 'Email notifications for new orders', type: 'toggle', key: 'emailOrders', default: true },
    { label: 'SMS alerts for critical issues', type: 'toggle', key: 'smsAlerts', default: true },
    { label: 'Weekly revenue report', type: 'toggle', key: 'weeklyReport', default: false },
    { label: 'Vendor approval requests', type: 'toggle', key: 'vendorApprovals', default: true },
  ]},
  { icon: Shield, label: 'Security', color: 'bg-red-100 text-red-500', settings: [
    { label: 'Two-factor authentication', type: 'toggle', key: '2fa', default: false },
    { label: 'Login alerts on new devices', type: 'toggle', key: 'loginAlerts', default: true },
    { label: 'Session timeout (minutes)', type: 'select', key: 'sessionTimeout', default: '60', options: ['30', '60', '120', '240'] },
  ]},
  { icon: CreditCard, label: 'Payment Settings', color: 'bg-green-100 text-green-500', settings: [
    { label: 'Platform commission rate (%)', type: 'number', key: 'commission', default: '10' },
    { label: 'Minimum payout amount (₹)', type: 'number', key: 'minPayout', default: '500' },
    { label: 'Auto-payout enabled', type: 'toggle', key: 'autoPayout', default: true },
  ]},
];

export default function Settings() {
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    SETTING_SECTIONS.forEach(s => s.settings.forEach(setting => { initial[setting.key] = setting.default; }));
    return initial;
  });
  const [platformName, setPlatformName] = useState('FestiveRetail');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => toast.success('Settings saved successfully!');

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div><h2 className="text-2xl font-black text-gray-900 mb-1">Platform Settings</h2><p className="text-gray-500 text-sm">Configure platform-wide settings</p></div>

      {/* General */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={16} className="text-blue-500" /> General Settings</h3>
        <div className="flex flex-col gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
            <input value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
            <input defaultValue="support@festiveretail.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 text-sm" /></div>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div><div className="font-semibold text-gray-900 text-sm">Maintenance Mode</div><div className="text-xs text-gray-500">Temporarily disable platform for maintenance</div></div>
            <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full transition-all ${maintenanceMode ? 'bg-red-500' : 'bg-gray-200'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic sections */}
      {SETTING_SECTIONS.map((section, si) => (
        <motion.div key={section.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (si + 1) * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><div className={`w-7 h-7 ${section.color} rounded-lg flex items-center justify-center`}><section.icon size={15} /></div>{section.label}</h3>
          <div className="flex flex-col gap-4">
            {section.settings.map(setting => (
              <div key={setting.key} className="flex items-center justify-between">
                <div><div className="text-sm font-medium text-gray-700">{setting.label}</div></div>
                {setting.type === 'toggle' && (
                  <button onClick={() => setSettings(s => ({ ...s, [setting.key]: !s[setting.key] }))}
                    className={`w-12 h-6 rounded-full transition-all ${settings[setting.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mx-0.5 ${settings[setting.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                )}
                {setting.type === 'select' && (
                  <select value={settings[setting.key]} onChange={e => setSettings(s => ({ ...s, [setting.key]: e.target.value }))}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 bg-white">
                    {setting.options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                )}
                {setting.type === 'number' && (
                  <input type="number" value={settings[setting.key]} onChange={e => setSettings(s => ({ ...s, [setting.key]: e.target.value }))}
                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <button onClick={handleSave} className="flex items-center justify-center gap-2 w-full py-4 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all">
        <Save size={16} /> Save All Settings
      </button>
    </div>
  );
}

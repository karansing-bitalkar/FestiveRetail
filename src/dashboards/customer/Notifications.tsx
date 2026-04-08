import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdNotifications, MdLocalOffer, MdLocalShipping, MdSettings } from 'react-icons/md';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { NOTIFICATIONS } from '@/constants/data';
import { Notification } from '@/types';
import { toast } from 'sonner';

const TYPE_ICONS: Record<string, React.ElementType> = {
  order: MdLocalShipping,
  offer: MdLocalOffer,
  system: MdSettings,
};
const TYPE_COLORS: Record<string, string> = {
  order: 'bg-blue-100 text-blue-500',
  offer: 'bg-orange-100 text-orange-500',
  system: 'bg-gray-100 text-gray-500',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const markAllRead = () => { setNotifications(n => n.map(x => ({ ...x, read: true }))); toast.success('All notifications marked as read'); };
  const markRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const deleteNotif = (id: string) => { setNotifications(n => n.filter(x => x.id !== id)); toast.success('Notification deleted'); };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Notifications</h2>
          <p className="text-gray-500 text-sm">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 text-orange-500 rounded-xl font-semibold text-sm hover:bg-orange-100 transition-all">
            <FiCheck /> Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <MdNotifications className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700">No notifications yet</h3>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((notif, i) => {
            const Icon = TYPE_ICONS[notif.type] || MdNotifications;
            return (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className={`bg-white rounded-2xl p-5 shadow-sm border-l-4 transition-all ${notif.read ? 'border-gray-100 opacity-75' : 'border-orange-400 shadow-orange-50'}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${TYPE_COLORS[notif.type]} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>{notif.title}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{notif.createdAt}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{notif.message}</p>
                    {!notif.read && (
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => markRead(notif.id)} className="text-xs text-orange-500 font-semibold hover:text-orange-600">Mark as read</button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteNotif(notif.id)} className="w-7 h-7 bg-red-50 text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 transition-all flex-shrink-0">
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

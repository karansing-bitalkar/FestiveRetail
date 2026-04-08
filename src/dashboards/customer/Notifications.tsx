import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ShoppingBag, Tag, Settings, Check, Trash2 } from 'lucide-react';
import { NOTIFICATIONS } from '@/constants/data';
import { Notification } from '@/types';
import { toast } from 'sonner';

const ICON_MAP: Record<string, any> = {
  order: ShoppingBag,
  offer: Tag,
  system: Settings,
};

const COLOR_MAP: Record<string, string> = {
  order: 'bg-orange-100 text-orange-500',
  offer: 'bg-green-100 text-green-500',
  system: 'bg-blue-100 text-blue-500',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const markRead = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const deleteNotif = (id: string) => { setNotifications(n => n.filter(x => x.id !== id)); toast.success('Notification deleted'); };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Notifications</h2>
          <p className="text-gray-500 text-sm">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center gap-1">
            <Check size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <Bell size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400">No notifications yet</p>
          </div>
        ) : notifications.map((n, i) => {
          const Icon = ICON_MAP[n.type] || Bell;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all ${n.read ? 'border-gray-100' : 'border-orange-200 bg-orange-50/30'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${COLOR_MAP[n.type] || 'bg-gray-100 text-gray-500'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-bold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                    {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{n.createdAt}</p>
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="w-7 h-7 bg-green-50 text-green-500 rounded-lg flex items-center justify-center hover:bg-green-100 transition-all" title="Mark read">
                      <Check size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteNotif(n.id)} className="w-7 h-7 bg-gray-50 text-gray-400 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-400 transition-all" title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

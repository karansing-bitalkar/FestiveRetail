import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  type?: 'danger' | 'warning';
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', type = 'danger' }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl"
          >
            <button onClick={onCancel} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-all">
              <X size={16} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className={`w-14 h-14 ${type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mb-4`}>
                {type === 'danger'
                  ? <Trash2 size={22} className="text-red-500" />
                  : <AlertTriangle size={22} className="text-yellow-500" />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm mb-6">{message}</p>
              <div className="flex gap-3 w-full">
                <button onClick={onCancel} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm">
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-2.5 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-xl font-semibold transition-all text-sm`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

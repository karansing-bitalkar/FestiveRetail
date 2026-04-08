import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function AuthGuardModal({ isOpen, onClose, message = 'Please login to continue' }: Props) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
            >
              <X size={14} />
            </button>
            <div className="w-16 h-16 fest-gradient rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={28} className="text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => { onClose(); navigate('/login'); }}
                className="flex-1 py-3 fest-gradient text-white rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <LogIn size={15} /> Login
              </button>
              <button
                onClick={() => { onClose(); navigate('/register'); }}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <UserPlus size={15} /> Register
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

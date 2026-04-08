import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdLogin, MdPersonAdd } from 'react-icons/md';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  action?: string; // e.g. "add to cart", "add to wishlist"
}

export default function AuthGuardModal({ isOpen, onClose, action = 'continue' }: AuthGuardModalProps) {
  const navigate = useNavigate();

  const handleLogin = () => { onClose(); navigate('/login'); };
  const handleRegister = () => { onClose(); navigate('/register'); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22 }}
            className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
          >
            {/* Festive top bar */}
            <div className="fest-gradient px-6 pt-8 pb-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <HiSparkles className="text-white text-3xl" />
              </div>
              <h2 className="text-xl font-black text-white">Login Required</h2>
              <p className="text-white/80 text-sm mt-1">
                Please login or register to {action}
              </p>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
            >
              <FiX />
            </button>

            {/* Actions */}
            <div className="p-6 flex flex-col gap-3">
              <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-2 w-full py-3.5 fest-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-md hover:shadow-orange-200"
              >
                <MdLogin className="text-xl" />
                Login to Your Account
              </button>
              <button
                onClick={handleRegister}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-orange-50 text-orange-600 rounded-2xl font-bold border-2 border-orange-200 hover:bg-orange-100 transition-all"
              >
                <MdPersonAdd className="text-xl" />
                Create New Account
              </button>
              <button
                onClick={onClose}
                className="text-center text-sm text-gray-400 hover:text-gray-600 transition-colors mt-1"
              >
                Continue browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

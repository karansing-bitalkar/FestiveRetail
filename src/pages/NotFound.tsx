import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-20 h-20 fest-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Sparkles size={36} className="text-white" />
        </div>
        <h1 className="text-7xl font-black fest-text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-black text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home" className="flex items-center justify-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all">
            <Home size={16} /> Go Home
          </Link>
          <button onClick={() => window.history.back()} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:border-orange-400 transition-all">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

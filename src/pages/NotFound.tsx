import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center fest-gradient-dark px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="text-8xl font-black fest-text-gradient mb-4">404</div>
        <div className="text-6xl mb-4">🎁</div>
        <h1 className="text-2xl font-bold text-white mb-3">This page is celebrating elsewhere!</h1>
        <p className="text-gray-400 mb-8">The page you're looking for has moved, doesn't exist, or is out celebrating a festival.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/home" className="inline-flex items-center gap-2 px-6 py-3 fest-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-all">
            <FiHome /> Go Home
          </Link>
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
            <HiSparkles /> Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

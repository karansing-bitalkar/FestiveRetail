import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import { MdPerson, MdStore, MdAdminPanelSettings } from 'react-icons/md';
import { useAuth, getDemoAccounts } from '@/hooks/useAuth';
import { toast } from 'sonner';

const DEMO_DISPLAY = [
  { role: 'customer', label: 'Customer', icon: MdPerson, color: 'from-orange-500 to-pink-500', desc: 'Buyer Account' },
  { role: 'vendor', label: 'Vendor', icon: MdStore, color: 'from-purple-500 to-blue-500', desc: 'Seller Account' },
  { role: 'admin', label: 'Admin', icon: MdAdminPanelSettings, color: 'from-red-500 to-orange-500', desc: 'Admin Panel' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const demos = getDemoAccounts();

  const handleDemoFill = (role: string) => {
    const account = demos.find(a => a.role === role);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      toast.info(`Demo ${role} account filled!`, { description: 'Click Login to continue' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success('Login successful! Welcome back 🎉');
        navigate(`/dashboard/${result.role}`);
      } else {
        toast.error(result.error ?? 'Login failed');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center fest-gradient-dark relative overflow-hidden py-12 px-4">
      {/* Background decorations */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 rounded-full border border-orange-500/10"
          style={{ left: `${i * 20 - 10}%`, top: `${i % 2 === 0 ? -20 : 60}%` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 30 + i * 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <div className="relative w-full max-w-md">
        {/* Back to home */}
        <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-6 text-sm">
          <FiArrowLeft /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 fest-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-orange">
              <HiSparkles className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Welcome Back!</h1>
            <p className="text-gray-400 text-sm">Sign in to your FestiveRetail account</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-medium mb-3 text-center uppercase tracking-wider">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_DISPLAY.map(d => {
                const Icon = d.icon;
                return (
                  <motion.button
                    key={d.role}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleDemoFill(d.role)}
                    className={`flex flex-col items-center gap-1.5 p-3 bg-gradient-to-br ${d.color} bg-opacity-20 border border-white/10 rounded-xl hover:border-white/30 transition-all`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${d.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="text-white text-sm" />
                    </div>
                    <span className="text-white text-xs font-semibold">{d.label}</span>
                    <span className="text-gray-400 text-[10px]">{d.desc}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs">or enter manually</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 fest-gradient text-white rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-all disabled:opacity-60 mt-2 glow-orange"
            >
              {loading ? 'Signing In...' : 'Sign In 🎉'}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">
              Register Free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

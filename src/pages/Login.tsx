import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, User, Store, ShieldCheck } from 'lucide-react';
import { useAuth, getDemoAccounts } from '@/hooks/useAuth';
import { toast } from 'sonner';

const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer', icon: User, desc: 'Buy festive products', color: 'border-orange-400 bg-orange-50' },
  { value: 'vendor', label: 'Vendor', icon: Store, desc: 'Sell your products', color: 'border-blue-400 bg-blue-50' },
  { value: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Manage platform', color: 'border-purple-400 bg-purple-50' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const demos = getDemoAccounts();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        toast.success('Welcome back!');
        navigate(`/dashboard/${result.role}`);
      } else {
        toast.error(result.error || 'Login failed');
      }
    }, 600);
  };

  const fillDemo = (role: 'customer' | 'vendor' | 'admin') => {
    const demo = demos.find(d => d.role === role);
    if (demo) { setEmail(demo.email); setPassword(demo.password); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/home" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-7">
            <div className="w-14 h-14 fest-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-sm">Sign in to your FestiveRetail account</p>
          </div>

          {/* Demo quick fill */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map(r => (
                <button key={r.value} onClick={() => fillDemo(r.value as any)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all hover:scale-105 ${r.color}`}>
                  <r.icon size={16} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

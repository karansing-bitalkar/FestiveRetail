import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, User, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { toast } from 'sonner';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [role, setRole] = useState<Role>('customer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(form.name, form.email, form.password, role);
      setLoading(false);
      if (result.success) {
        toast.success('Account created! Welcome to FestiveRetail!');
        navigate(`/dashboard/${result.role}`);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-7">
            <div className="w-14 h-14 fest-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Sparkles size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join FestiveRetail today</p>
          </div>

          {/* Role selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">I want to</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'customer', label: 'Shop', sub: 'Buy festive products', icon: User },
                { value: 'vendor', label: 'Sell', sub: 'List my products', icon: Store },
              ].map(r => (
                <button key={r.value} type="button" onClick={() => setRole(r.value as Role)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${role === r.value ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${role === r.value ? 'fest-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <r.icon size={17} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.label}</p>
                    <p className="text-xs text-gray-500">{r.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name', icon: User },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com', icon: Mail },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(x => ({ ...x, [f.key]: e.target.value }))} required placeholder={f.placeholder}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(x => ({ ...x, password: e.target.value }))} required placeholder="Min. 6 characters"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword} onChange={e => setForm(x => ({ ...x, confirmPassword: e.target.value }))} required placeholder="Repeat password"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 fest-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-1">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

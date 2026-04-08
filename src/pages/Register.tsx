import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, Store } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = register(name, email, password, role);
      if (result.success) {
        toast.success('Account created successfully!');
        navigate(`/dashboard/${result.role}`);
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center fest-gradient-dark relative overflow-hidden py-12 px-4">
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute w-64 h-64 rounded-full border border-pink-500/10"
          style={{ right: `${i * 18 - 5}%`, top: `${i % 2 === 0 ? -20 : 60}%` }}
          animate={{ rotate: -360 }} transition={{ duration: 30 + i * 5, repeat: Infinity, ease: 'linear' }} />
      ))}

      <div className="relative w-full max-w-md">
        <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-7">
            <div className="w-16 h-16 fest-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg glow-orange">
              <Sparkles size={26} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-1">Create Account</h1>
            <p className="text-gray-400 text-sm">Join the festive shopping revolution!</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <p className="text-gray-400 text-xs font-medium mb-3 text-center uppercase tracking-wider">Register As</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'customer' as Role, label: 'Customer', icon: User, desc: 'I want to shop', color: 'from-orange-500 to-pink-500' },
                { value: 'vendor' as Role, label: 'Vendor', icon: Store, desc: 'I want to sell', color: 'from-purple-500 to-blue-500' },
              ].map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${role === r.value ? 'border-orange-400 bg-orange-500/20' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">{r.label}</div>
                      <div className="text-gray-400 text-xs">{r.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {[
              { label: 'Full Name', value: name, setter: setName, type: 'text', icon: User, placeholder: 'Your full name' },
              { label: 'Email Address', value: email, setter: setEmail, type: 'email', icon: Mail, placeholder: 'you@example.com' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{field.label}</label>
                <div className="relative">
                  <field.icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.setter(e.target.value)}
                    required
                    placeholder={field.placeholder}
                    className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-all text-sm"
                  />
                </div>
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Minimum 6 characters"
                  className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter password"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-all text-sm"
                />
              </div>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-4 fest-gradient text-white rounded-xl font-bold text-base shadow-lg hover:opacity-90 transition-all disabled:opacity-60 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

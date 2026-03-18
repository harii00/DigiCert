import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(email, password);
      toast.success('Access Granted. Welcome back.');
      navigate(data.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-20"
      >
        <div className="surface-glass p-10 md:p-14 border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)]">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8 group">
              <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:-rotate-6 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">DigitalCert</span>
            </Link>

            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles className="w-3 h-3" />
              <span>Sovereign Identity</span>
            </div>
            <h1 className="text-6xl font-extrabold tracking-tighter text-slate-900 mb-2 leading-none">Access Portal</h1>
            <p className="text-slate-900 font-black text-xl">Verify your institutional or student role</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2 group">
              <label className="text-[14px] font-black uppercase tracking-widest text-slate-800 ml-5 group-focus-within:text-indigo-600 transition-colors">Identity Credential</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-saas pl-14"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-5 mr-1">
                <label className="text-[14px] font-black uppercase tracking-widest text-slate-800 group-focus-within:text-indigo-600 transition-colors">Access Signature</label>
                <button type="button" className="text-[12px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-saas pl-14 font-mono pb-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-saas-primary group py-5 shadow-xl hover:shadow-indigo-500/10"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="text-sm font-bold uppercase tracking-widest">Verify & Access</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 mb-6">Secured by Protocol Node-ALPHA</p>
            <div className="flex items-center justify-center space-x-2 opacity-50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[12px] font-black uppercase tracking-widest text-slate-800 italic">Encrypted Connection Validated</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

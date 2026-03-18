import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, formData);
            toast.success('Admin account created. Please log in.');
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
            <div className="noise-overlay"></div>
            <div className="mesh-container"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-20"
            >
                <div className="surface-glass p-10 md:p-14 border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)]">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-2 leading-none">
                            Admin Registration
                        </h1>
                        <p className="text-slate-500 font-semibold text-base">
                            Create an admin account to manage certificates.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="space-y-2 group">
                            <label className="text-[13px] font-black uppercase tracking-widest text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    placeholder="Enter your full name"
                                    className="input-saas pl-12"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2 group">
                            <label className="text-[13px] font-black uppercase tracking-widest text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="input-saas pl-12"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2 group">
                            <label className="text-[13px] font-black uppercase tracking-widest text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    className="input-saas pl-12"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    <span className="text-sm font-bold uppercase tracking-widest">Create Admin Account</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                        <div className="flex items-center justify-center space-x-2 opacity-50 mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[12px] font-black uppercase tracking-widest text-slate-800">Secure Registration</span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link to="/login" className="text-slate-900 font-extrabold hover:text-indigo-600 transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

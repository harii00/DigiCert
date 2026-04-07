import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Award,
  User,
  Mail,
  Calendar,
  FileText,
  Send,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    rollNumber: '',
    studentName: '',
    studentEmail: '',
    event: '',
    issuedDate: new Date().toISOString().split('T')[0],
    status: 'Valid',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || '/api'}/certificates`, formData);
      toast.success('Certificate issued successfully.');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Issuance protocol failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRollNumberChange = async (e) => {
    const roll = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, rollNumber: roll }));

    if (roll.length >= 10) {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || '/api'}/users/students/roll/${roll}`);
        if (data && data.name && data.email) {
          setFormData(prev => ({
            ...prev,
            studentName: data.name,
            studentEmail: data.email
          }));
          toast.success('Student data auto-filled.', { id: 'autofill-success' });
        }
      } catch (error) {
        // Silently ignore 404s while typing, only show if it's a real network error
        if (error.response?.status !== 404) {
          console.error('Failed to fetch student by roll number:', error);
        }
      }
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Context Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group mb-16 flex items-center space-x-3 px-6 py-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
          <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-slate-900">Abort Protocol</span>
        </motion.button>

        <div className="flex justify-center">
          {/* Protocol Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            <div className="surface-glass p-1 shadow-2xl relative group">
              {/* Elite Form Background */}
              <div className="bg-white rounded-[2.2rem] p-12 md:p-16 border border-slate-100 relative overflow-hidden">
                <div className="mb-16">
                  <div className="flex items-center space-x-5 mb-8">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl transform group-hover:rotate-6 transition-transform">
                      <Award className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-[12px] font-black uppercase tracking-widest mb-1.5 border border-indigo-100/50">
                        <Sparkles className="w-3 h-3" />
                        <span>Issuance Authority</span>
                      </div>
                      <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Issue Certificate</h1>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid grid-cols-1 gap-10">
                    <div className="space-y-3 group">
                      <label className="text-[12px] font-black uppercase tracking-widest text-slate-600 ml-4 group-focus-within:text-indigo-600 transition-colors">Roll Number (Optional)</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          placeholder="e.g. 7376232CB119"
                          className="input-saas pl-14 uppercase"
                          value={formData.rollNumber}
                          onChange={handleRollNumberChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <label className="text-[12px] font-black uppercase tracking-widest text-slate-600 ml-4 group-focus-within:text-indigo-600 transition-colors">Name</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          placeholder="e.g. Yash Omre"
                          className="input-saas pl-14"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <label className="text-[12px] font-black uppercase tracking-widest text-slate-600 ml-4 group-focus-within:text-indigo-600 transition-colors">Email ID</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          type="email"
                          placeholder="student@mitsgwalior.in"
                          className="input-saas pl-14"
                          value={formData.studentEmail}
                          onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3 group">
                      <label className="text-[12px] font-black uppercase tracking-widest text-slate-600 ml-4 group-focus-within:text-indigo-600 transition-colors">Achievement</label>
                      <div className="relative">
                        <FileText className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                          placeholder="e.g. Lead Developer - Global Hackathon 2026"
                          className="input-saas pl-14"
                          value={formData.event}
                          onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                      <div className="space-y-3 group">
                        <label className="text-[12px] font-black uppercase tracking-widest text-slate-800 ml-4 group-focus-within:text-primary-500 transition-colors">Issue Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                          <input
                            type="date"
                            className="input-saas pl-14"
                            value={formData.issuedDate}
                            onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 relative group/btn">
                    <div className="absolute -inset-1 bg-primary-100/50 blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <button
                      type="submit"
                      className="w-full btn-saas-primary py-6 relative z-10"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="text-sm font-bold uppercase tracking-[0.2em]">Issue Certificate</span>
                          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;

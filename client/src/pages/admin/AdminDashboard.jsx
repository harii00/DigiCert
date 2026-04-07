import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Trophy,
  User,
  LogOut,
  Plus,
  Search,
  Database,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award,
  Users,
} from 'lucide-react';
import { Badge } from '../../components/UI';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminHeader from '../../components/AdminHeader';
import { requestAPI } from '../../services/api';

const AdminDashboard = () => {
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [certRes, reqRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || '/api'}/certificates`),
        requestAPI.getAll()
      ]);
      setRecentCertificates(certRes.data.slice(0, 8));
      
      const requests = reqRes.data || reqRes;
      const pendingCount = requests.filter(r => r.status === 'pending').length;
      setPendingRequestsCount(pendingCount);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Control Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-12">
          <div className="max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl font-black tracking-[-0.04em] text-slate-900 mb-3 leading-tight"
            >
              Welcome back, <span className="text-indigo-600">{user?.name?.split(' ')[0] || 'Admin'}</span>
            </motion.h1>
            <p className="text-slate-500 font-semibold text-lg">Manage certificates, students, and rankings from your dashboard.</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center space-x-3 justify-end flex-nowrap">
              <button
                onClick={() => navigate('/admin/courses')}
                className="btn-saas-secondary px-6 h-fit group"
              >
                <Database className="w-4 h-4 mr-2" />
                <span>Course Data</span>
              </button>
              <button
                onClick={() => navigate('/admin/requests')}
                className="btn-saas-secondary px-6 h-fit group relative"
              >
                <Award className="w-4 h-4 mr-2" />
                <span>Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1.5 -mr-1.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-slate-50"></span>
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/admin/students')}
                className="btn-saas-secondary px-6 h-fit group"
              >
                <Users className="w-4 h-4 mr-2" />
                <span>Students</span>
              </button>
              <button
                onClick={() => navigate('/admin/ranking')}
                className="btn-saas-secondary px-6 h-fit group"
              >
                <Trophy className="w-4 h-4 mr-2" />
                <span>Rankings</span>
              </button>
            </div>
            <button
              onClick={() => navigate('/admin/dashboard/issue')}
              className="btn-saas-primary px-12 h-fit shadow-2xl shadow-primary-500/10 group"
            >
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
              <span>Manual Issue</span>
            </button>
          </div>
        </div>



        {/* Registry & Activity Hub */}
        <div className="grid grid-cols-1 gap-12">
          <div className="w-full">
            <div className="surface-card bg-white border-slate-100 overflow-hidden shadow-sm">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight uppercase text-slate-900">Recent Synchronization Events</h2>
                </div>
                <Link to="/certificates" className="text-[12px] font-black uppercase tracking-widest text-primary-500 hover:underline flex items-center group">
                  Master Ledger <ArrowUpRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence>
                      {loading ? (
                        [1, 2, 3, 4].map(i => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-10 py-8"><div className="h-4 bg-slate-50 rounded-full w-48 mb-2"></div><div className="h-3 bg-slate-50 rounded-full w-24 opacity-50"></div></td>
                            <td className="px-10 py-8"><div className="h-6 bg-slate-50 rounded-lg w-20 ml-auto"></div></td>
                          </tr>
                        ))
                      ) : recentCertificates.map((cert) => (
                        <tr key={cert._id} className="hover:bg-slate-50/50 transition-colors group/row">
                          <td className="px-10 py-6">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 tracking-tight text-xl group-hover/row:text-indigo-600 transition-colors uppercase italic">{cert.studentName}</span>
                              <span className="text-[12px] text-slate-800 font-black uppercase tracking-widest group-hover/row:text-slate-900 transition-colors">{cert.courseName || cert.event}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="flex flex-col items-end gap-3">
                              <Badge variant={cert.status === 'Valid' ? 'success' : 'error'}>
                                <span className="px-1">{cert.status}</span>
                              </Badge>
                              <span className="font-mono text-[12px] text-slate-800 font-bold letter-spacing-tight uppercase">{cert.certificateId}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

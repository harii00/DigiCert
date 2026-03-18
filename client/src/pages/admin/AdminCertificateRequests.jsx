import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  Check, 
  X, 
  Clock, 
  ArrowLeft, 
  Search, 
  Filter,
  ExternalLink,
  Award,
  User,
  BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/UI';
import toast from 'react-hot-toast';
import AdminHeader from '../../components/AdminHeader';

const AdminCertificateRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [remarks, setRemarks] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/requests`);
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id, status, remarks = '') => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/requests/${id}`, { status, remarks });
      toast.success(data.message);
      fetchRequests();
      setShowRejectModal(false);
      setRemarks('');
      setSelectedReq(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const openRejectModal = (req) => {
    setSelectedReq(req);
    setShowRejectModal(true);
  };

  const filteredRequests = requests.filter(req => filterStatus === 'all' || req.status === filterStatus);

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-6 overflow-hidden">
      <AdminHeader />
      <div className="max-w-[1400px] mx-auto relative z-10">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase mb-2">Certificate Requests</h1>
            <p className="text-slate-500 font-semibold italic">Process and approve student qualification claims</p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm h-fit">
            {['pending', 'approved', 'rejected', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filterStatus === status 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card bg-white border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Student Info</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Course & Level</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Request Date</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Status</th>
                  <th className="px-10 py-6 text-right text-[10px] uppercase font-black tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-10 py-8 h-20 bg-slate-50/30"></td>
                    </tr>
                  ))
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Clock className="w-12 h-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold">No requests found for this category</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-900 border border-slate-200">
                            {req.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-tight">{req.studentName}</p>
                            <p className="text-[11px] font-mono font-bold text-slate-400">{req.studentRollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{req.course_name}</p>
                          <Badge variant="info" className="mt-1">Level {req.level}</Badge>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-slate-500">
                        {new Date(req.requestDate).toLocaleDateString()}
                      </td>
                      <td className="px-10 py-8">
                        <Badge variant={
                          req.status === 'approved' ? 'success' : 
                          req.status === 'rejected' ? 'error' : 'warning'
                        }>
                          <span className="uppercase tracking-widest text-[9px] font-black">{req.status}</span>
                        </Badge>
                        {req.status === 'rejected' && req.admin_remarks && (
                          <p className="mt-2 text-[10px] font-medium text-rose-400 italic max-w-[150px]">
                            "{req.admin_remarks}"
                          </p>
                        )}
                      </td>
                      <td className="px-10 py-8 text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => openRejectModal(req)}
                              className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleProcess(req._id, 'approved')}
                              className="p-3 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                              title="Approve"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          </div>
                        ) : req.status === 'approved' ? (
                          <span className="text-[10px] font-mono font-black text-slate-300 tracking-tighter uppercase">{req.certificateId}</span>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase italic">Archived</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
                  <X className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Reject Request</h2>
                <p className="text-slate-500 font-semibold italic mt-1">Provide a reason for the rejection</p>
              </div>

              <div className="space-y-6">
                <div>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter rejection remarks..."
                    className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[12px] hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleProcess(selectedReq._id, 'rejected', remarks)}
                    disabled={!remarks.trim()}
                    className="flex-[2] py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[12px] shadow-lg shadow-rose-200 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificateRequests;

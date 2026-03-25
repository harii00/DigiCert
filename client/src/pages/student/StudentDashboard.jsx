import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Download,
  ExternalLink,
  Calendar,
  User,
  LogOut,
  TrendingUp,
  BookOpen,
  Send,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Badge } from '../../components/UI';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { certificateAPI, courseAPI, requestAPI, userAPI } from '../../services/api';

const StudentDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [requesting, setRequesting] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user && user.isPasswordChanged === false) {
      setShowPasswordModal(true);
    }
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.error('Please enter a new password');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    
    setUpdatingPassword(true);
    try {
      const data = await userAPI.updateProfile({ password: newPassword });
      setUser({ ...user, ...data });
      setShowPasswordModal(false);
      toast.success('Password updated successfully');
      
      // Force reload to completely refresh the state and load the dashboard freshly
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [certData, rankData, courseData, requestData] = await Promise.all([
        certificateAPI.getStudentCertificates(),
        certificateAPI.getRanking(),
        courseAPI.getMyCourses(),
        requestAPI.getMyRequests(),
      ]);
      setCertificates(certData.data || certData);
      setCourses(courseData.data || courseData);
      setRequests(requestData.data || requestData);
      
      const ranks = rankData.data || rankData;
      // Find current student's rank from the ranking list
      if (user && ranks) {
        const myRank = ranks.find(r => r.studentId?.toString() === user._id?.toString());
        setRank(myRank?.rank ?? null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (course) => {
    setRequesting(course._id);
    try {
      await requestAPI.create({
        course_name: course.course_name,
        level: course.level
      });
      toast.success('Certificate request submitted');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    } finally {
      setRequesting(null);
    }
  };

  const handleDownload = async (cert) => {
    try {
      await certificateAPI.download(cert._id, cert.certificateId);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen pb-24 px-6 overflow-hidden">

      {/* ─── Custom Top Header (Mirrors AdminHeader) ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        {/* Left: Profile + Certificates */}
        <div className="flex items-center space-x-3">
            <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
            >
                <User className="w-4 h-4" />
                <span>Profile</span>
            </button>
            <button
                onClick={() => navigate('/student/certificate-request')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
            >
                <Award className="w-4 h-4" />
                <span>Requests</span>
            </button>
        </div>

        {/* Center: DigiCert brand */}
        <span
            className="absolute left-1/2 -translate-x-1/2 text-[1.6rem] font-black text-slate-900 leading-none select-none cursor-pointer hover:text-indigo-600 transition-colors duration-300"
            style={{ fontFamily: '"Black Ops One", system-ui, sans-serif', letterSpacing: '0.02em', textTransform: 'uppercase' }}
            onClick={() => navigate('/student/dashboard')}
        >
            DigiCert
        </span>

        {/* Right: Logout */}
        <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 text-sm font-bold"
        >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
        </button>
      </header>

      {/* ─── Page Body ─── */}
      <div className="max-w-5xl mx-auto relative z-10 pt-28">

        {/* ─── Greeting Section ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-6xl md:text-7xl font-black tracking-[-0.05em] text-slate-900 mb-4 leading-tight"
            >
              Hello,{' '}
              <span className="text-indigo-500">{user?.name?.split(' ')[0]}</span>
              <br />
              <span className="text-slate-400 text-5xl md:text-6xl">Your Registry is Secure.</span>
            </motion.h1>
          </div>
          <button
            onClick={() => navigate('/student/certificate-request')}
            className="btn-saas-primary px-10 py-5 h-fit shadow-2xl shadow-indigo-200 group flex items-center space-x-3 mb-2"
          >
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="font-black uppercase tracking-[0.2em] text-[12px]">Certificate Request</span>
          </button>
        </div>

        {/* ─── Stats Row: Certificates + Rank ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="grid grid-cols-2 gap-6 mb-14 max-w-lg"
        >
          {/* Total Certificates */}
          <div className="surface-card p-7 bg-white border-slate-100 flex flex-col gap-2">
            <div className="flex items-center space-x-2 mb-1">
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Certificates</span>
            </div>
            <span className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
              {loading ? '–' : certificates.length}
            </span>
            <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest">Earned</span>
          </div>

          {/* Rank */}
          <div className="surface-card p-7 bg-white border-slate-100 flex flex-col gap-2">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Overall Rank</span>
            </div>
            <span className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
              {loading ? '–' : rank ? `#${rank}` : '—'}
            </span>
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
              {rank ? 'Global Standing' : 'No Rank Yet'}
            </span>
          </div>
        </motion.div>

        {/* ─── Main Area ─── */}
        <div className="space-y-12">

          {/* Certificate Cards */}
          <div className="space-y-8">
            <div className="flex items-center px-2 space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">Recent Issuances</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {loading ? (
                  [1, 2].map(i => (
                    <div key={i} className="surface-card h-64 animate-pulse bg-slate-50 border-slate-100" />
                  ))
                ) : certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <motion.div
                      key={cert._id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="surface-card p-1 group hover-lift border-transparent hover:border-slate-100"
                    >
                      <div className="bg-white p-10 rounded-[1.8rem] flex flex-col h-full">
                        <div className="flex justify-between items-start mb-12">
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:rotate-6">
                            <Award className="w-6 h-6" />
                          </div>
                          <Badge variant="success">Validated</Badge>
                        </div>

                        <div className="mb-12">
                          <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-2 truncate group-hover:text-indigo-600 transition-colors uppercase italic">
                            {cert.courseName || cert.event}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            <span className="text-[14px] font-black uppercase tracking-widest text-slate-800">
                              Deployed {new Date(cert.issuedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-auto">
                          <Link
                            to={`/certificates/${cert._id}`}
                            className="flex-1 py-4 bg-slate-50 hover:bg-slate-900 text-slate-500 hover:text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Auditor</span>
                          </Link>
                          <button
                            onClick={() => handleDownload(cert)}
                            className="p-4 bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-2xl transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-24 surface-card flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed border-slate-200">
                    <div className="p-8 bg-white shadow-sm border border-slate-100 rounded-full text-slate-200 mb-8">
                      <Award className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Vault Empty</h3>
                    <p className="text-slate-400 font-medium max-w-xs">No credentials have been deployed to your identity yet.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Academic Progress Section */}
          <div className="space-y-8 mt-16">
            <div className="flex items-center px-2 space-x-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">Academic Progress</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="surface-card h-40 animate-pulse bg-slate-50 border-slate-100" />
                  ))
                ) : courses.length > 0 ? (
                  courses.map((course) => {
                    const request = requests.find(r => r.course_name === course.course_name && r.level === course.level);
                    return (
                      <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedCourse(course)}
                        className="surface-card p-6 bg-white border-slate-100 flex flex-col justify-between cursor-pointer hover:border-indigo-200 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          {request ? (
                            <Badge variant={
                              request.status === 'approved' ? 'success' : 
                              request.status === 'rejected' ? 'error' : 'warning'
                            }>
                              {request.status}
                            </Badge>
                          ) : (
                            <Badge variant="info">Completed</Badge>
                          )}
                        </div>

                        <div>
                          <h3 className="font-black text-slate-900 uppercase tracking-tight line-clamp-1 group-hover:text-indigo-600 transition-colors">{course.course_name}</h3>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Level {course.level}</p>
                        </div>

                        {!request && (
                          <button
                            onClick={() => handleRequest(course)}
                            disabled={requesting === course._id}
                            className="mt-6 w-full py-3 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
                          >
                            {requesting === course._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Request Certificate</span>
                              </>
                            )}
                          </button>
                        )}
                        {request && request.status === 'pending' && (
                          <div className="mt-6 flex items-center justify-center space-x-2 text-amber-500 font-bold text-[10px] uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Verification in progress</span>
                          </div>
                        )}
                        {request && request.status === 'approved' && (
                          <div className="mt-6 flex items-center justify-center space-x-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Certificate Issued</span>
                          </div>
                        )}
                        {request && request.status === 'rejected' && (
                          <div className="mt-6 flex items-center justify-center space-x-2 text-rose-500 font-bold text-[10px] uppercase tracking-widest">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Request Rejected</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 surface-card flex flex-col items-center justify-center text-center bg-slate-50/50 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No progress data available yet.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* Modal for Course Details */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 flex items-start justify-between border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase line-clamp-2">
                      {selectedCourse.course_name}
                    </h2>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      Level {selectedCourse.level} • Academic Record
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Completion Status</span>
                    <Badge variant="info">Completed</Badge>
                  </div>
                  
                  {(() => {
                    const request = requests.find(r => r.course_name === selectedCourse.course_name && r.level === selectedCourse.level);
                    return (
                      <div className="flex flex-col space-y-4 pt-2">
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Certification Details</span>
                        {request ? (
                          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-4">
                            {request.status === 'approved' ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                            ) : request.status === 'rejected' ? (
                              <XCircle className="w-5 h-5 text-rose-500 mt-0.5" />
                            ) : (
                              <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-900 mb-1">
                                {request.status === 'approved' ? 'Certificate Issued' :
                                 request.status === 'rejected' ? 'Request Rejected' :
                                 'Verification in Progress'}
                              </p>
                              {request.adminRemarks && (
                                <p className="text-xs font-medium text-slate-500 mt-2 bg-white p-3 rounded-lg border border-slate-100 italic">
                                  "{request.adminRemarks}"
                                </p>
                              )}
                              {request.status === 'pending' && (
                                <p className="text-xs text-slate-500 mt-1">Your request is currently being reviewed by an administrator. Check back later.</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
                            <h4 className="text-sm font-bold text-indigo-900 mb-2">Eligible for Certification</h4>
                            <p className="text-xs text-indigo-600 mb-5">You have completed this course and can now request a formal digital certificate.</p>
                            <button
                              onClick={() => {
                                handleRequest(selectedCourse);
                                setSelectedCourse(null);
                              }}
                              disabled={requesting === selectedCourse._id}
                              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[12px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-200 flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              {requesting === selectedCourse._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>Submit Request</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forced Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-indigo-600">
                  <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase italic">Secure Your Account</h2>
                <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                  Welcome to DigiCert! To protect your identity and credentials, please change your default password before proceeding.
                </p>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="New Secure Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 font-bold outline-none focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 transition-all"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full py-5 bg-indigo-600 hover:bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {updatingPassword ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Update Identity Key</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 flex justify-center items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <TrendingUp className="w-3 h-3" />
                    <span>Security Protocol Active</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentDashboard;

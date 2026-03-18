import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Send, 
  Loader2, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Download,
  AlertCircle,
  User,
  Award,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { courseAPI, requestAPI, certificateAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StudentCertificateRequest = () => {
  const [courses, setCourses] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseData, requestData] = await Promise.all([
        courseAPI.getMyCourses(),
        requestAPI.getMyRequests(),
      ]);
      setCourses(courseData.data || courseData);
      setRequests(requestData.data || requestData);
    } catch (error) {
      toast.error('Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (course) => {
    setRequestingId(course._id);
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
      setRequestingId(null);
    }
  };

  const handleDownload = async (certId, certificateId) => {
    try {
      await certificateAPI.download(certId, certificateId);
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const getRequestForCourse = (course) => {
    return requests.find(r => r.course_name === course.course_name && r.level === course.level);
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
                onClick={() => navigate('/student/dashboard')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
            >
                <Award className="w-4 h-4" />
                <span>Dashboard</span>
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
            onClick={() => { /* Logout handled in AuthContext, assuming standard flow if needed, or simply redirect to home */ navigate('/'); }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 text-sm font-bold opacity-0 pointer-events-none"
        >
             {/* Invisible placeholder for centering */}
            <ArrowLeft className="w-4 h-4" />
        </button>
      </header>

      <div className="max-w-6xl mx-auto relative z-10 pt-32">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 uppercase">Certificate Requests</h1>
          <p className="text-slate-500 font-semibold italic mt-2">Claim your credentials for completed academic levels</p>
        </div>

        <div className="surface-card bg-white border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Course Name</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Level</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400">Request Status</th>
                  <th className="px-10 py-6 text-right text-[10px] uppercase font-black tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-10 py-10 h-24 bg-slate-50/20"></td>
                    </tr>
                  ))
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-10 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <BookOpen className="w-12 h-12 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold max-w-xs mx-auto">
                          No completed courses found for your roll number.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => {
                    const req = getRequestForCourse(course);
                    return (
                      <tr key={course._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-10 py-8">
                          <div>
                            <p className="font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors italic truncate max-w-md">
                              {course.course_name}
                            </p>
                            {req?.status === 'rejected' && (
                              <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start space-x-2">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest">Admin Remarks</p>
                                  <p className="text-[12px] font-bold text-rose-600 mt-0.5 leading-relaxed">
                                    {req.admin_remarks || 'No remarks provided.'}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <Badge variant="info">Level {course.level}</Badge>
                        </td>
                        <td className="px-10 py-8">
                          {!req ? (
                            <Badge variant="outline">Not Requested</Badge>
                          ) : (
                            <Badge variant={
                              req.status === 'approved' ? 'success' : 
                              req.status === 'rejected' ? 'error' : 'warning'
                            }>
                              <span className="uppercase tracking-widest text-[9px] font-black">{req.status}</span>
                            </Badge>
                          )}
                        </td>
                        <td className="px-10 py-8 text-right">
                          {!req || req.status === 'rejected' ? (
                            <button
                              onClick={() => handleRequest(course)}
                              disabled={requestingId === course._id}
                              className={`pill-button px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center space-x-2 ${
                                req?.status === 'rejected' 
                                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border-rose-100' 
                                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100'
                              } border shadow-sm`}
                            >
                              {requestingId === course._id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{req?.status === 'rejected' ? 'Request Again' : 'Request Certificate'}</span>
                                </>
                              )}
                            </button>
                          ) : req.status === 'pending' ? (
                            <div className="inline-flex items-center space-x-2 text-amber-500 font-black text-[10px] uppercase tracking-widest">
                              <Clock className="w-3.5 h-3.5" />
                              <span>In Review</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDownload(req.certificateObjectId, req.certificateId)}
                              className="pill-button px-6 py-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100 text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center space-x-2"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCertificateRequest;

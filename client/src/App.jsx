import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CertificateDirectory from './pages/CertificateDirectory';
import CertificateDetail from './pages/CertificateDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import IssueCertificate from './pages/admin/IssueCertificate';
import StudentManagement from './pages/admin/StudentManagement';
import RankingDashboard from './pages/admin/RankingDashboard';
import AdminCourseCompletion from './pages/admin/AdminCourseCompletion';
import AdminCertificateRequests from './pages/admin/AdminCertificateRequests';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCertificateRequest from './pages/student/StudentCertificateRequest';
import VerifyCertificate from './pages/VerifyCertificate';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { AnimatePresence } from 'framer-motion';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f9]">
      <div className="noise-overlay"></div>
      <div className="mesh-container"></div>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Establishing Node</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
      <Toaster position="bottom-right" />
      <div className="noise-overlay"></div>
      <div className="mesh-container"></div>

      <div>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute role="admin">
                  <CertificateDirectory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates/:id"
              element={
                <ProtectedRoute>
                  <CertificateDetail />
                </ProtectedRoute>
              }
            />
            <Route path="/verify/:certId" element={<CertificateDetail />} />
            <Route path="/verify-certificate" element={<VerifyCertificate />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/issue"
              element={
                <ProtectedRoute role="admin">
                  <IssueCertificate />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <StudentManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ranking"
              element={
                <ProtectedRoute role="admin">
                  <RankingDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute role="admin">
                  <AdminCourseCompletion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute role="admin">
                  <AdminCertificateRequests />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute role="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/certificate-request"
              element={
                <ProtectedRoute role="student">
                  <StudentCertificateRequest />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile role="user" />
                </ProtectedRoute>
              }
            />

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
      </div>
    </div>
  );
}

export default App;

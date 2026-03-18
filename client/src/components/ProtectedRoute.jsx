import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ProtectedRoute({ children, role }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const location = useLocation();

  useEffect(() => {
    authAPI
      .getSession()
      .then((data) => {
        setSession(data);
      })
      .catch(() => setSession({ loggedIn: false }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && session.user?.role !== role) {
    if (session.user?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (session.user?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

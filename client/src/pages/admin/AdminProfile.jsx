import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI
      .getProfile()
      .then(setUser)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="card">Loading...</div>;
  if (!user) return <div className="alert alert-error">Profile not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Admin Profile</h1>
        <p>Your account information.</p>
      </div>
      <div className="card">
        <dl style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Role</dt>
            <dd>
              <span className="badge badge-success">{user.role}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

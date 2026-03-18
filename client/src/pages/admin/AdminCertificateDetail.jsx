import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

export default function AdminCertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    certificateAPI
      .getById(id)
      .then(setCertificate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRevoke = async () => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) return;
    setRevoking(true);
    try {
      await certificateAPI.revoke(id);
      setCertificate((c) => ({ ...c, isValid: false }));
    } catch (err) {
      setError(err.message);
    } finally {
      setRevoking(false);
    }
  };

  if (loading) return <div className="card">Loading...</div>;
  if (error || !certificate) return <div className="alert alert-error">{error || 'Not found'}</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Certificate Details</h1>
          <p>{certificate.certificateId}</p>
        </div>
        <span className={`badge ${certificate.isValid ? 'badge-success' : 'badge-danger'}`}>
          {certificate.isValid ? 'Valid' : 'Invalid / Revoked'}
        </span>
      </div>
      <div className="card">
        <dl style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Certificate ID</dt>
            <dd>{certificate.certificateId}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Student Name</dt>
            <dd>{certificate.studentName}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Student Email</dt>
            <dd>{certificate.studentEmail}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Course</dt>
            <dd>{certificate.course}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Date of Completion</dt>
            <dd>{new Date(certificate.dateOfCompletion).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Grade</dt>
            <dd>{certificate.grade}</dd>
          </div>
        </dl>
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => navigate('/admin/certificates')} className="btn btn-secondary">
            Back to List
          </button>
          {certificate.isValid && (
            <button onClick={handleRevoke} className="btn btn-danger" disabled={revoking}>
              {revoking ? 'Revoking...' : 'Revoke Certificate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

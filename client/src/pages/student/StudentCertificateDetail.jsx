import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

export default function StudentCertificateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    certificateAPI
      .getStudentCertificateById(id)
      .then(setCertificate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/certificates/${id}/download`, { credentials: 'include' });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate?.certificateId || 'cert'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setDownloading(false);
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
          {certificate.isValid ? 'Valid' : 'Invalid'}
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
          <button onClick={() => navigate('/student/certificates')} className="btn btn-secondary">
            Back to List
          </button>
          {certificate.isValid && (
            <button onClick={handleDownload} className="btn btn-primary" disabled={downloading}>
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

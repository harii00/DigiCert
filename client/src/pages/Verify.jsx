import { useState } from 'react';
import { certificateAPI } from '../services/api';

export default function Verify() {
  const [certificateId, setCertificateId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certificateId.trim() && !studentName.trim()) {
      setError('Enter Certificate ID or Student Name');
      return;
    }
    setError('');
    setResults(null);
    setLoading(true);
    try {
      const data = await certificateAPI.verify(
        certificateId.trim() || undefined,
        studentName.trim() || undefined
      );
      setResults(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Verify Certificate</h1>
        <p>Search and verify certificate authenticity. No login required.</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Certificate ID</label>
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="e.g. DCS-000001ABC"
              />
            </div>
            <div className="form-group">
              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Verify'}
          </button>
        </form>
      </div>
      {results && (
        <div className="card">
          <h2 className="card-title">Verification Results</h2>
          {results.length === 0 ? (
            <p className="empty-state">No certificates found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Date</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((c) => (
                    <tr key={c._id || c.certificateId}>
                      <td>{c.certificateId}</td>
                      <td>{c.studentName}</td>
                      <td>{c.course}</td>
                      <td>{new Date(c.dateOfCompletion).toLocaleDateString()}</td>
                      <td>{c.grade}</td>
                      <td>
                        <span className={`badge ${c.isValid ? 'badge-success' : 'badge-danger'}`}>
                          {c.isValid ? 'Valid' : 'Invalid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateAPI
      .getStudentCertificates()
      .then(setCertificates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>My Certificates</h1>
        <p>View and download your certificates.</p>
      </div>
      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : certificates.length === 0 ? (
          <p className="empty-state">You have no certificates yet.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Certificate ID</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c._id}>
                    <td>{c.certificateId}</td>
                    <td>{c.course}</td>
                    <td>{new Date(c.dateOfCompletion).toLocaleDateString()}</td>
                    <td>{c.grade}</td>
                    <td>
                      <span className={`badge ${c.isValid ? 'badge-success' : 'badge-danger'}`}>
                        {c.isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/student/certificate/${c._id}`} className="link">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  ShieldCheck,
  Shield,
  Award,
  Calendar,
  User,
  Download,
  Printer,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/UI';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState(searchParams.get('id') || '');
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');

  const verify = async (id) => {
    const trimmed = (id || certId).trim();
    if (!trimmed) {
      setValidationMsg('Certificate ID is required.');
      return;
    }
    setValidationMsg('');
    setLoading(true);
    setError('');
    setCertificate(null);
    setSearched(true);

    try {
      const { data } = await axios.get(`${process.env.VITE_API_URL || '/api'}/certificates/verify/${trimmed}`);
      setCertificate(data);
    } catch (err) {
      setError('No certificate found for this Certificate ID. Please check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    verify();
  };

  // Auto-verify if ID came from URL query param
  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      verify(idFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = () => {
    if (!certificate) return;
    const link = document.createElement('a');
    link.href = `${process.env.VITE_API_URL || '/api'}/certificates/public/${certificate.certificateId}/download`;
    link.download = `${certificate.certificateId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back to Login */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/"
            className="group mb-16 inline-flex items-center space-x-3 px-6 py-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800 group-hover:text-slate-900">Back to Home</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900 text-white rounded-full mb-6">
            <ShieldCheck className="w-3 h-3" />
            <span className="text-[12px] font-black uppercase tracking-[0.2em]">Public Verification</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-[-0.05em] text-slate-900 mb-4 leading-tight">
            Verify Certificate
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-md mx-auto italic">
            Enter a Certificate ID to validate its authenticity against the global registry.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="surface-glass p-1 shadow-2xl mb-12">
            <div className="bg-white rounded-[2.2rem] p-10 md:p-14 border border-slate-100">
              <form onSubmit={handleVerify} className="space-y-8">
                <div className="space-y-3 group">
                  <label className="text-[12px] font-black uppercase tracking-widest text-slate-600 ml-4 group-focus-within:text-indigo-600 transition-colors">Certificate ID</label>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="e.g. DCS-A1B2C3D4E5"
                      className="input-saas pl-14"
                      value={certId}
                      onChange={(e) => { setCertId(e.target.value); setValidationMsg(''); }}
                    />
                  </div>
                  {validationMsg && (
                    <p className="text-xs font-bold text-rose-500 ml-4">{validationMsg}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full btn-saas-primary py-5 group"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-sm font-bold uppercase tracking-widest">Verify Authenticity</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="surface-card p-10 mb-12 bg-rose-50 border-rose-100 text-center"
            >
              <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
              <h3 className="text-xl font-black text-rose-700 mb-2 uppercase tracking-tight">Verification Failed</h3>
              <p className="text-rose-600 font-bold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {certificate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              className="space-y-12"
            >
              {/* Status Banner */}
              <div className="surface-card p-10 bg-emerald-50 border-emerald-100 flex items-center space-x-6">
                <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-emerald-800 uppercase tracking-tight">Certificate Verified</h3>
                  <p className="text-emerald-600 font-bold text-sm">This certificate is authentic and registered in the global ledger.</p>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                  <div className="surface-glass p-1 shadow-2xl">
                    <div className="bg-white rounded-[2.2rem] p-10 md:p-14 border border-slate-100 space-y-10">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 text-[12px] font-black uppercase tracking-widest mb-1 border border-emerald-100">
                            <Sparkles className="w-3 h-3" />
                            <span>Verified Record</span>
                          </div>
                          <h2 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">Certificate Details</h2>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Certificate ID</p>
                            <p className="text-lg font-mono font-bold text-slate-900">{certificate.certificateId}</p>
                          </div>
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Status</p>
                            <Badge variant={certificate.status === 'Valid' ? 'success' : certificate.status === 'Revoked' ? 'error' : 'warning'}>
                              {certificate.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Student Name</p>
                          <p className="text-2xl font-black text-slate-900 tracking-tight">{certificate.studentName}</p>
                        </div>

                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Certificate Title</p>
                          <p className="text-xl font-bold text-slate-900">{certificate.event}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Issue Date</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{new Date(certificate.issuedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Issuing Admin</p>
                            </div>
                            <p className="text-lg font-bold text-slate-900">{certificate.issuedBy?.name || 'Institution Authority'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                  <div className="surface-glass p-8 bg-slate-900 text-white shadow-2xl relative overflow-hidden group border-white/10">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

                    <div className="flex items-center space-x-3 mb-10 relative z-10">
                      <div className="p-3 bg-white/10 rounded-2xl">
                        <Shield className="w-4 h-4 text-indigo-400" />
                      </div>
                      <h3 className="font-black tracking-tight text-[12px] uppercase tracking-[0.2em]">Actions</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all duration-500 group/btn font-bold text-xs"
                      >
                        <div className="flex items-center space-x-4">
                          <Download className="w-4.5 h-4.5" />
                          <span className="uppercase tracking-[0.2em]">Download PDF</span>
                        </div>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-500 group/btn font-bold text-xs"
                      >
                        <div className="flex items-center space-x-4">
                          <Printer className="w-4.5 h-4.5 text-indigo-400" />
                          <span className="uppercase tracking-[0.2em]">Print Certificate</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {certificate.qrCode && (
                    <div className="surface-card p-10 bg-white border-slate-100 flex flex-col items-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">QR Verification</p>
                      <img src={certificate.qrCode} alt="QR Code" className="w-32 h-32 opacity-80" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial State — No search yet */}
        {!searched && !certificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="p-8 bg-white shadow-sm border border-slate-100 rounded-full text-slate-200 mx-auto w-fit mb-8">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <p className="text-slate-400 font-bold italic">Enter a Certificate ID above to begin verification.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;

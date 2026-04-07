import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateAPI } from '../services/api';

const CertificateDetail = () => {
    const { id, certId } = useParams();
    const navigate = useNavigate();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCertificate();
    }, [id, certId]);

    const fetchCertificate = async () => {
        try {
            const response = await (certId
                ? certificateAPI.verify(certId)
                : certificateAPI.getById(id));
            setCertificate(response.data);
        } catch (error) {
            toast.error('Certificate not found');
            navigate('/certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            await certificateAPI.download(certificate._id, certificate.certificateId);
        } catch (error) {
            toast.error('Download failed. Session may have expired.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="noise-overlay"></div>
            <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!certificate) return null;

    return (
        <div className="min-h-screen relative pt-10 pb-24 px-6">
            <div className="max-w-6xl mx-auto relative z-10">

                {/* Back Navigation */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="group mb-12 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </motion.button>

                {/* Landscape Certificate Card (A4 PDF View) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="surface-glass p-2 border-white/60 shadow-[0_48px_96px_-16px_rgba(0,0,0,0.12)] rounded-[2.5rem]">
                        <div className="bg-slate-100 rounded-[2rem] overflow-hidden relative" style={{ aspectRatio: '1.414 / 1', width: '100%' }}>
                            {certificate ? (
                                <iframe
                                    src={`${import.meta.env.VITE_API_URL || '/api'}/certificates/${certificate._id}/download?inline=true&token=${localStorage.getItem('token')}&t=${Date.now()}`}
                                    className="w-full h-full border-0 absolute top-0 left-0"
                                    title="Certificate PDF"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Download Button */}
                <div className="flex justify-center mt-10">
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        onClick={handleDownload}
                        className="flex items-center space-x-3 px-10 py-5 bg-slate-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-[1.5rem] shadow-xl transition-all duration-300 active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        <span>Download Certificate</span>
                    </motion.button>
                </div>

            </div>
        </div>
    );
};

export default CertificateDetail;

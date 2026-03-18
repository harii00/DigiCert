import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Search,
    Calendar,
    ArrowRight,
    Fingerprint,
    SearchX,
    ArrowLeft
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/UI';

const CertificateDirectory = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/certificates`);
                setCertificates(data);
            } catch (error) {
                console.error('Error fetching certificates:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCertificates();
    }, []);

    const handleSearch = () => {
        setSearchTerm(searchQuery);
    };

    const filteredCertificates = certificates.filter((cert) => {
        if (!searchTerm) return true;
        return (
            cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateId?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="relative min-h-screen pt-10 pb-24 px-6 overflow-hidden bg-[#f8fafc]">
            <div className="mesh-container opacity-20"></div>
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* Back Button */}
                <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="flex items-center space-x-2 mb-10 px-5 py-2.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Dashboard</span>
                </button>

                {/* Header with Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-16"
                >
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2.5rem] p-12 md:p-20 text-white relative overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.1)] border border-white/5">
                        <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[80px] rounded-full animate-float-slow"></div>

                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12 relative z-10">
                            <div className="max-w-2xl">
                                <h1 className="text-6xl md:text-8xl font-black tracking-[-0.05em] mb-8 leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">
                                    Registry <br />
                                    Portal.
                                </h1>
                                <p className="text-slate-400 font-bold text-xl max-w-lg leading-relaxed tracking-tight">
                                    Audit of academic credentials issued across the network.
                                </p>
                            </div>

                            {/* Search Interface */}
                            <div className="flex-1 max-w-2xl w-full">
                                <div className="bg-white rounded-[2rem] p-2 flex flex-col md:flex-row items-center shadow-[0_24px_48px_rgba(0,0,0,0.06)] relative group border border-slate-100">
                                    <div className="flex-1 flex items-center px-6 w-full">
                                        <Search className="w-6 h-6 text-slate-300 group-focus-within:text-slate-900 transition-all duration-300 shrink-0" />
                                        <input
                                            placeholder="Search by ID, Name, or Course..."
                                            className="w-full py-5 bg-transparent border-none outline-none text-slate-800 font-bold placeholder:text-slate-300 ml-5 text-lg tracking-tight"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        className="w-full md:w-auto px-10 py-5 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[13px] rounded-[1.6rem] transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Certificate Table */}
                <div className="surface-glass p-1 border-white/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.04)] overflow-hidden rounded-[2.5rem]">
                    <div className="bg-white rounded-[2.4rem] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50">
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600">Certificate ID</th>
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600">Recipient</th>
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600">Credential</th>
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600">Issuance</th>
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600">Status</th>
                                        <th className="px-10 py-10 text-[14px] font-black uppercase tracking-[0.2em] text-slate-600 text-right">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {loading ? (
                                            [1, 2, 3, 4, 5, 6].map(i => (
                                                <tr key={i} className="animate-pulse">
                                                    {[1, 2, 3, 4, 5, 6].map(j => (
                                                        <td key={j} className="px-10 py-10">
                                                            <div className="h-4 bg-slate-50 rounded-full w-24"></div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        ) : filteredCertificates.length > 0 ? (
                                            filteredCertificates.map((cert, idx) => (
                                                <motion.tr
                                                    key={cert._id}
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.03 }}
                                                    className="group hover:bg-slate-50/80 transition-all cursor-pointer relative"
                                                    onClick={() => window.location.href = `/certificates/${cert._id}`}
                                                >
                                                    <td className="px-10 py-10">
                                                        <div className="flex items-center space-x-4">
                                                            <div className={`p-3 rounded-xl border transition-all duration-300
                                                                ${idx % 3 === 0 ? 'bg-indigo-50/50 text-indigo-600 border-indigo-100' :
                                                                    idx % 3 === 1 ? 'bg-slate-50/50 text-slate-600 border-slate-100' :
                                                                        'bg-blue-50/50 text-blue-600 border-blue-100'}
                                                                group-hover:bg-white group-hover:shadow-sm`}>
                                                                <Fingerprint className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-mono text-[13px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase">
                                                                {cert.certificateId || cert._id.slice(-8).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[11px] border border-slate-200">
                                                                {cert.studentName.split(' ').map(n => n[0]).join('')}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-900 font-bold uppercase tracking-tight text-[15px] leading-tight">
                                                                    {cert.studentName}
                                                                </span>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">Verified Identity</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10">
                                                        <span className="text-[14px] font-bold text-slate-700 uppercase tracking-tight">
                                                            {cert.courseName || cert.event}
                                                        </span>
                                                    </td>
                                                    <td className="px-10 py-10">
                                                        <div className="flex items-center space-x-3 text-slate-400 font-bold uppercase tracking-[0.1em] text-[11px]">
                                                            <Calendar className="w-3.5 h-3.5 opacity-40" />
                                                            <span>{new Date(cert.issuedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10">
                                                        <div className={`inline-flex items-center space-x-3 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest
                                                            ${cert.status === 'Valid' ? 'bg-emerald-50/50 text-emerald-700 border-emerald-100' : 'bg-amber-50/50 text-amber-700 border-amber-100'}`}>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${cert.status === 'Valid' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                            <span>{cert.status === 'Valid' ? 'Verified' : cert.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-10 text-right">
                                                        <Link
                                                            to={`/certificates/${cert._id}`}
                                                            className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] transition-all"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <span>Audit</span>
                                                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-24 text-center">
                                                    <div className="flex flex-col items-center justify-center opacity-40">
                                                        <SearchX className="w-12 h-12 mb-4" />
                                                        <p className="text-sm font-black uppercase tracking-[0.2em]">No records found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateDirectory;

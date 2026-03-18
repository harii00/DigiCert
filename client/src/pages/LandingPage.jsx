import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
    ShieldCheck,
    ArrowRight,
    Globe,
    Lock,
    Zap,
    CheckCircle2,
    Shield,
    Sparkles,
    MousePointer2,
    ChevronDown,
    Award,
    RefreshCw,
    Search,
    CheckCircle,
    ExternalLink,
} from 'lucide-react';
import CertificateCard from '../components/CertificateCard';

const LandingPage = () => {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);
    const [verifyId, setVerifyId] = useState('');
    const [verifyError, setVerifyError] = useState('');

    const handlePublicVerify = (e) => {
        e.preventDefault();
        const trimmed = verifyId.trim();
        if (!trimmed) {
            setVerifyError('Please enter a Certificate ID.');
            return;
        }
        setVerifyError('');
        navigate(`/verify-certificate?id=${encodeURIComponent(trimmed)}`);
    };

    const features = [
        {
            title: 'Sovereign Integrity',
            desc: 'Each credential is securely anchored, ensuring permanent, tamper-proof validity.',
            icon: <ShieldCheck className="w-6 h-6" />,
        },
        {
            title: 'Verification Engine',
            desc: 'A seamless, world-class verification protocol for institutions and employers worldwide.',
            icon: <Zap className="w-6 h-6" />,
        },
        {
            title: 'Universal Portability',
            desc: 'Digital credentials designed for the modern global academic and professional ecosystem.',
            icon: <Globe className="w-6 h-6" />,
        },
        {
            title: 'Trusted Security',
            desc: 'Built with elite encryption standards to protect institutional and student identity.',
            icon: <Lock className="w-6 h-6" />,
        },
    ];


    return (
        <div className="relative min-h-screen">

            {/* ─── DigiCert Brand Title (top-center) ─── */}
            <div className="w-full flex justify-center pt-8 pb-2">
                <span
                    className="select-none text-[4.5rem] md:text-[6rem] font-black text-slate-900 leading-none"
                    style={{ 
                        fontFamily: '"Black Ops One", system-ui, sans-serif',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                    }}
                >
                    DIGICERT
                </span>
            </div>

            {/* Hero Section */}
            <section className="relative pt-4 pb-16 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Content Prop */}
                        <div className="max-w-xl z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50/50 border border-indigo-100 rounded-full mb-8 backdrop-blur-sm"
                            >
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                                    Next-Gen Credentialing
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[3.8rem] md:text-[5.5rem] font-extrabold leading-[1] tracking-[-0.05em] text-slate-900 mb-8"
                            >
                                The future of <br />
                                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">verified trust.</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-2xl text-slate-700 font-bold leading-relaxed mb-10 max-w-lg"
                            >
                                Elite-grade credentialing for world-class institutions. Store, issue, and verify academic achievements with absolute certainty.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-start gap-4"
                            >
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full sm:w-auto btn-saas-primary group"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="w-full sm:w-auto btn-saas-secondary"
                                    >
                                        <span>Join Platform</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => navigate('/verify-certificate')}
                                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white/60 hover:bg-white hover:border-indigo-200 text-slate-700 hover:text-indigo-700 transition-all duration-300 text-[12px] font-black uppercase tracking-[0.15em] shadow-sm group"
                                >
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 group-hover:text-indigo-600" />
                                    <span>Verify a Certificate</span>
                                </button>
                            </motion.div>

                            {/* Institutional Trust Badges */}
                            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap items-center gap-8 opacity-40">
                                <div className="flex items-center space-x-2">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-700">AES-256 Secured</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RefreshCw className="w-5 h-5" />
                                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-700">Real-time Sync</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive UI Preview */}
                        <div className="relative group hidden lg:block">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-100/30 blur-[120px] rounded-full -z-10 animate-pulse"></div>

                            <motion.div
                                initial={{ opacity: 0, rotateY: 15, x: 50 }}
                                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative z-10 perspective-1000"
                            >
                                <CertificateCard
                                    className="max-w-[500px] mx-auto animate-float-slow"
                                    certificate={{
                                        studentName: 'Julian Thorne',
                                        courseName: 'M.S. Advanced Security',
                                        issuer: 'Institute of Advanced Security',
                                        _id: '8821990x'
                                    }}
                                />

                                {/* Floating Trust Badge */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-10 -right-10 surface-card px-6 py-5 shadow-2xl z-20"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
                                            <Award className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                            <p className="text-sm font-black text-slate-900">Verified Elite</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Verification Glimpse */}
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-4 -left-6 surface-glass px-6 py-4 shadow-xl z-20"
                                >
                                    <div className="flex items-center space-x-4">
                                        <p className="text-[12px] font-bold text-slate-800 tracking-tight">+143 views</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

            </section>


            <section className="py-16 px-6 relative overflow-hidden">
                <div className="max-w-[1240px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 24px 64px rgba(99,102,241,0.13)' }}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`surface-card p-10 bg-white/50 hover:bg-white border-slate-100 hover:border-indigo-100 transition-all duration-400 cursor-default ${
                                    hoveredCard !== null && hoveredCard !== i
                                        ? 'opacity-50 blur-[1.5px] scale-[0.98]'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center space-x-5 mb-6">
                                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[1.2rem] flex-shrink-0 shadow-sm transition-all duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className={`text-2xl font-black tracking-tight uppercase transition-colors duration-300 ${
                                        hoveredCard === i ? 'text-indigo-600' : 'text-slate-900'
                                    }`}>{f.title}</h3>
                                </div>
                                <p className="text-slate-800 font-bold leading-relaxed text-lg pl-[4.5rem]">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works – compact */}
            <section className="py-16 px-6 mx-6 bg-slate-900 text-white relative overflow-hidden rounded-[3rem]">
                <div className="absolute top-0 right-0 w-[60%] h-full bg-indigo-500/10 blur-[160px] -z-10 translate-x-1/3"></div>

                <div className="max-w-[960px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-[2.4rem] font-extrabold tracking-[-0.04em] mb-10 leading-[1.1]">How the registry <br /> secures your integrity.</h2>
                        </motion.div>

                        <div className="space-y-10 relative">
                            <div className="absolute top-6 bottom-4 left-[23px] w-[2px] bg-gradient-to-b from-indigo-500/50 via-indigo-500/20 to-transparent"></div>

                            {[
                                { t: 'Establish Identity', d: 'Institutions create verifiable accounts on our network.' },
                                { t: 'Digital Deployment', d: 'Credentials are verified and issued to recipient profiles.' },
                                { t: 'Public Ledger', d: 'Every record is instantly added to the global registry.' },
                                { t: 'Infinite Ownership', d: 'Recipients own their achievements forever, verifiable by anyone, anywhere.' }
                            ].map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex space-x-8 relative group"
                                >
                                    <div className="w-12 h-12 bg-indigo-900/50 border border-indigo-500/30 rounded-full flex items-center justify-center flex-shrink-0 z-10 group-hover:bg-indigo-500 group-hover:scale-110 transition-all duration-500 font-black text-indigo-400 group-hover:text-white text-lg">
                                        {i + 1}
                                    </div>
                                    <div className="pt-1">
                                        <motion.h4
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            className="text-xl font-black mb-2 tracking-tight text-white group-hover:text-indigo-400 transition-colors uppercase italic inline-block origin-left"
                                        >{s.t}</motion.h4>
                                        <p className="text-slate-300 font-semibold leading-relaxed max-w-md text-base">{s.d}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Tech Abstract Visual – smaller orb */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="w-[320px] h-[320px] bg-indigo-500/5 rounded-[4rem] border border-indigo-500/10 flex items-center justify-center p-10 animate-pulse">
                            <div className="w-full aspect-square border-[2px] border-dashed border-indigo-500/20 rounded-full animate-spin-slow flex items-center justify-center p-8 relative">
                                <div className="absolute inset-0 bg-indigo-500/5 blur-[60px] rounded-full"></div>
                                <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/40 flex items-center justify-center z-10">
                                    <ShieldCheck className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute top-0 right-8 w-3 h-3 bg-indigo-400 rounded-full blur-[2px]"></div>
                                <div className="absolute bottom-14 left-0 w-2.5 h-2.5 bg-violet-400 rounded-full blur-[2px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Public Certificate Verification Section ─── */}
            <section className="py-24 px-6">
                <div className="max-w-[960px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="surface-glass p-1 shadow-2xl"
                    >
                        <div className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-100">
                            {/* Header */}
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full mb-6">
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Public Verification</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.04em] text-slate-900 mb-4 leading-tight">
                                    Verify a Certificate
                                </h2>
                                <p className="text-slate-500 font-bold text-lg max-w-md mx-auto leading-relaxed">
                                    Enter the certificate ID to validate an issued certificate instantly.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handlePublicVerify} className="space-y-5 max-w-xl mx-auto">
                                <div className="space-y-2 group">
                                    <div className="relative">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            id="landing-verify-input"
                                            type="text"
                                            placeholder="Enter Certificate ID"
                                            value={verifyId}
                                            onChange={(e) => { setVerifyId(e.target.value); setVerifyError(''); }}
                                            className="input-saas pl-14"
                                        />
                                    </div>
                                    {verifyError && (
                                        <p className="text-xs font-bold text-rose-500 ml-2">{verifyError}</p>
                                    )}
                                </div>
                                <button
                                    id="landing-verify-btn"
                                    type="submit"
                                    className="w-full btn-saas-primary group py-5"
                                >
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Verify Certificate</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform ml-auto" />
                                </button>
                            </form>

                            {/* Trust Footer row */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-400">
                                <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[12px] font-bold uppercase tracking-widest">No login required</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-200"></div>
                                <div className="flex items-center space-x-2">
                                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                                    <span className="text-[12px] font-bold uppercase tracking-widest">Instant validation</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-200"></div>
                                <div className="flex items-center space-x-2">
                                    <ExternalLink className="w-4 h-4 text-slate-400" />
                                    <Link
                                        to="/verify-certificate"
                                        className="text-[12px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors underline underline-offset-4"
                                    >
                                        Open Verify Page
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer SaaS Style */}
            <footer className="py-20 px-6 mt-20 border-t border-slate-100 bg-slate-50/20">
                <div className="max-w-[1240px] mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between text-slate-400 space-y-12 md:space-y-0">
                        <div className="flex flex-col items-center md:items-start space-y-6">
                            <div className="flex items-center space-x-3.5">
                                <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="text-[14px] font-black tracking-[0.2em] text-slate-900 uppercase">DigitalCert</span>
                            </div>
                            <p className="text-[14px] font-bold max-w-xs text-center md:text-left leading-relaxed text-slate-700">
                                The gold standard for digital academic credentialing and verification.
                            </p>
                        </div>


                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Award, CheckCircle2 } from 'lucide-react';

const CertificateCard = ({ certificate, className }) => {
    return (
        <div className={`group perspective-1000 ${className}`}>
            <div className="surface-glass p-1 border-white/50 relative overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                {/* Visual Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[60px] rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>

                <div className="bg-white rounded-[2.2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                    {/* Header Strip */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg transform group-hover:rotate-3 transition-transform">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-800">Auth Code</p>
                            <p className="text-[12px] font-mono font-bold text-slate-900">#{certificate?._id?.slice(-8).toUpperCase() || 'DC-882-X'}</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2 mb-10">
                        <div className="flex items-center space-x-2">
                            <Badge variant="success">Verified Registry</Badge>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {certificate?.studentName || 'Elite Recipient'}
                        </h3>
                        <p className="text-slate-900 font-black uppercase tracking-[0.2em] text-[14px]">
                            {certificate?.courseName || 'Academic Excellence'}
                        </p>
                    </div>

                    {/* QR Placeholder / Verified Badge */}
                    <div className="flex justify-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mb-8 relative group-hover:bg-indigo-50/30 transition-colors">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex justify-between items-end border-t border-slate-50 pt-6">
                        <div>
                            <p className="text-[12px] font-black uppercase tracking-widest text-slate-700 mb-1 font-serif italic">ISSUED BY</p>
                            <p className="text-sm font-black text-slate-900">{certificate?.issuer || 'Global Institute'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[12px] font-black uppercase tracking-widest text-slate-700 mb-1 font-serif italic">DATE</p>
                            <p className="text-sm font-black text-slate-900">Feb 2026</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
        info: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    };
    return (
        <span className={`px-4 py-2 rounded-full text-[12px] font-black uppercase tracking-widest ${variants[variant]}`}>
            {children}
        </span>
    );
};

export default CertificateCard;

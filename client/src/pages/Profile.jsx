import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { User, Mail, Shield, ArrowLeft, Camera, Check, X, Loader2, Building, PenTool } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = ({ role }) => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        profilePicture: user?.profilePicture || '',
        signature: user?.signature || ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                signature: user.signature
            }));
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                toast.error('Image size must be less than 1MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = await userAPI.updateProfile(formData);
            setUser({ ...user, ...data });
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            profilePicture: user?.profilePicture || '',
            signature: user?.signature || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-[#f8fafc] px-4 relative overflow-hidden">
            <div className="mesh-container opacity-20"></div>
            
            <div className="max-w-2xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-slate-500 hover:text-indigo-600 mb-8 transition-all font-bold text-sm bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-100 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="p-0 overflow-hidden border-none shadow-[0_32px_84px_-20px_rgba(0,0,0,0.08)] bg-white/80 backdrop-blur-xl">
                        <div className="h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 relative overflow-hidden">
                            <div className="absolute inset-0 noise-overlay opacity-[0.05]"></div>
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full"></div>
                        </div>
                        
                        <div className="px-8 pb-10 flex flex-col items-center">
                            <div className="relative -mt-20 mb-8">
                                <div className="w-40 h-40 rounded-[2.5rem] bg-white p-2 shadow-2xl relative group">
                                    <div className="w-full h-full rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300 text-5xl font-black overflow-hidden border border-slate-100">
                                        {formData.profilePicture ? (
                                            <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0)
                                        )}
                                    </div>
                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => fileInputRef.current.click()}
                                                className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 border-4 border-white"
                                            >
                                                <Camera className="w-5 h-5" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {isEditing ? 'Editing Profile' : user?.name}
                                </h1>
                                <div className="flex items-center justify-center mt-3 space-x-3">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                        {user?.role?.toUpperCase()}
                                    </span>
                                    <span className="text-slate-400 text-xs font-bold tracking-tight">Refined Node Integrity</span>
                                </div>
                            </div>

                            <div className="w-full space-y-4">
                                <div className="p-1 items-stretch bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center p-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Full Identity</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-500/20"
                                                />
                                            ) : (
                                                <p className="text-slate-900 font-black text-lg tracking-tight">{user?.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center p-4 border-t border-slate-100/50">
                                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Authenticated Mail</p>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-500/20"
                                                />
                                            ) : (
                                                <p className="text-slate-900 font-bold text-lg tracking-tight">{user?.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 border-t border-slate-100/50">
                                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Institutional Roll Number</p>
                                            <p className="text-slate-900 font-mono font-bold text-lg tracking-tight">{user?.roll_number || 'Not Assigned'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-4 border-t border-slate-100/50">
                                        <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                            <Building className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Academic Department</p>
                                            <p className="text-slate-900 font-bold text-lg tracking-tight">{user?.department || 'Not Assigned'}</p>
                                        </div>
                                    </div>

                                    {user?.role === 'admin' && (
                                        <div className="flex items-center p-4 border-t border-slate-100/50">
                                            <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                                <PenTool className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">E-Signature</p>
                                                {isEditing ? (
                                                    <div className="mt-2 space-y-3">
                                                        <div className="h-24 bg-white border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                                            {formData.signature ? (
                                                                <img src={formData.signature} alt="Signature" className="h-full object-contain p-2" />
                                                            ) : (
                                                                <span className="text-sm font-bold text-slate-400">Upload Signature Image</span>
                                                            )}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        if (file.size > 1024 * 1024) {
                                                                            toast.error('Signature limits to 1MB');
                                                                            return;
                                                                        }
                                                                        const render = new FileReader();
                                                                        render.onloadend = () => setFormData({ ...formData, signature: render.result });
                                                                        render.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                                                                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">Click to Browse</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium">Please upload a clean signature on a transparent background (PNG).</p>
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 h-20 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-2">
                                                        {user?.signature ? (
                                                            <img src={user.signature} alt="Signature" className="h-full object-contain" />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-400">No Signature on File</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex items-center p-4 border-t border-slate-100/50">
                                                    <div className="p-3 bg-white rounded-xl shadow-sm mr-4 text-slate-400 border border-slate-100">
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Update Security Key</p>
                                                        <input
                                                            type="password"
                                                            placeholder="Leave blank to keep current"
                                                            value={formData.password}
                                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                            className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-500/20"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="w-full mt-10 pt-8 border-t border-slate-100 flex justify-center space-x-4">
                                {!isEditing ? (
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="px-10 py-5 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-[13px] rounded-2xl shadow-xl transition-all active:scale-95"
                                    >
                                        Edit Node Profile
                                    </Button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center space-x-2 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-200 transition-all border border-slate-200"
                                        >
                                            <X className="w-4 h-4" />
                                            <span>Discard</span>
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            <span>Synchronize</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;

import { useNavigate } from 'react-router-dom';
import { User, Award, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminHeader = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
            {/* Left: Profile + Certificates */}
            <div className="flex items-center space-x-3">
                <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
                >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                </button>
                <button
                    onClick={() => navigate('/certificates')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 text-sm font-bold"
                >
                    <Award className="w-4 h-4" />
                    <span>Certificates</span>
                </button>
            </div>

            {/* Center: DigiCert brand */}
            <span
                className="absolute left-1/2 -translate-x-1/2 text-[1.6rem] font-black text-slate-900 leading-none select-none cursor-pointer"
                style={{ fontFamily: '"Black Ops One", system-ui, sans-serif', letterSpacing: '0.02em', textTransform: 'uppercase' }}
                onClick={() => navigate('/admin/dashboard')}
            >
                DigiCert
            </span>

            {/* Right: Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200 text-sm font-bold"
            >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
            </button>
        </header>
    );
};

export default AdminHeader;

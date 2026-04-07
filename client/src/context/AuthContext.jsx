import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchProfile();
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`${process.env.VITE_API_URL || '/api'}/users/profile`);
            setUser(data);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const { data } = await axios.post(`${process.env.VITE_API_URL || '/api'}/auth/login`, { email, password });
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post(`${process.env.VITE_API_URL || '/api'}/auth/register`, userData);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

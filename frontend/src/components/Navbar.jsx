import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, loginSuccess } from '../features/auth/authSlice';
import { Briefcase, User, LogOut, X, Shield } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Admin Quick Login using logo clicks
    const clickCount = useRef(0);
    const clickTimer = useRef(null);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    const handleLogoClick = () => {
        clickCount.current += 1;
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 2000);
        if (clickCount.current >= 5) {
            clickCount.current = 0;
            setShowAdminModal(true);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAdminLoading(true);
        try {
            const res = await api.post('/auth/login', { email: adminEmail, password: adminPassword });
            if (res.data.user.role !== 'admin') {
                toast.error('Access denied. Admin account required.');
                return;
            }
            dispatch(loginSuccess(res.data));
            setShowAdminModal(false);
            toast.success('Admin access granted!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <nav className="glass sticky top-0 z-50 py-4 px-6 mb-8 shadow-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div onClick={handleLogoClick} className="text-2xl font-bold text-primary flex items-center gap-2 cursor-pointer select-none">
                        <Briefcase className="w-8 h-8" />
                        <span>SkillBridge <span className="text-slate-800">India</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-slate-600 hover:text-primary font-medium transition-colors">Dashboard</Link>
                                {user.role === 'freelancer' && (
                                    <Link to="/jobs" className="text-slate-600 hover:text-primary font-medium transition-colors">Find Jobs</Link>
                                )}
                                {user.role === 'client' && (
                                    <Link to="/my-jobs" className="text-slate-600 hover:text-primary font-medium transition-colors">My Jobs</Link>
                                )}
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-slate-600 hover:text-primary font-medium transition-colors">Admin Panel</Link>
                                )}
                                <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                                        <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                                    </div>
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <User className="w-5 h-5 text-slate-600" />
                                    </div>
                                    <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-primary font-medium">Login</Link>
                                <Link to="/register" className="btn-primary">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Admin Quick Login Modal */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="glass max-w-md w-full p-8 rounded-3xl shadow-2xl relative border border-primary/20">
                        <button onClick={() => setShowAdminModal(false)} className="absolute right-5 top-5 p-2 hover:bg-slate-100 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-extrabold text-slate-900">Admin Access</h2>
                                <p className="text-sm text-slate-500 font-medium">Restricted — Authorized Personnel Only</p>
                            </div>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Admin Email</label>
                                <input
                                    type="email"
                                    required
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900"
                                    placeholder="admin@skillbridge.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Admin Password</label>
                                <input
                                    type="password"
                                    required
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    placeholder="Enter admin password"
                                />
                            </div>
                            <button type="submit" disabled={adminLoading} className="w-full btn-primary py-3.5 font-bold">
                                {adminLoading ? 'Authenticating...' : 'Access Admin Panel'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;


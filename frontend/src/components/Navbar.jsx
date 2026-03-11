import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Briefcase, User, Wallet, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="glass sticky top-0 z-50 py-4 px-6 mb-8 shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    <Briefcase className="w-8 h-8" />
                    <span>SkillBridge <span className="text-slate-800">India</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-slate-600 hover:text-primary font-medium transition-colors">Dashboard</Link>
                            {user.role === 'freelancer' && (
                                <Link to="/jobs" className="text-slate-600 hover:text-primary font-medium transition-colors">Find Jobs</Link>
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
    );
};

export default Navbar;

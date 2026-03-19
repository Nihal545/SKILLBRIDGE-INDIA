import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { Briefcase, Wallet, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState({ activeJobs: 0, earnings: 0, pendingBids: 0 });
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (user?.role === 'freelancer') {
                    const res = await api.get('/proposals/freelancer');
                    setProposals(res.data);
                }
                // Client specific stats could be loaded here
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading Dashboard...</div>;

    return (
        <div className="py-8">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
                    Welcome back, <span className="text-primary">{user?.name}</span>
                </h1>
                <p className="text-slate-600 font-medium">Here's what's happening with your projects today.</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    icon={<Briefcase className="w-6 h-6 text-primary" />}
                    label={user?.role === 'freelancer' ? 'Active Proposals' : 'Open Jobs'}
                    value={user?.role === 'freelancer' ? proposals.length : '0'}
                    color="bg-sky-50"
                />
                <StatCard 
                    icon={<Wallet className="w-6 h-6 text-accent" />}
                    label="Current Bids"
                    value={user?.bids || 0}
                    color="bg-amber-50"
                />
                <StatCard 
                    icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
                    label="Account Status"
                    value={user?.verified ? 'Verified' : 'Unverified'}
                    color="bg-emerald-50"
                />
            </div>

            {/* Role-Specific Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Recent Activity</h3>
                            {user?.role === 'freelancer' && (
                                <Link to="/proposals" className="text-sm font-bold text-primary hover:underline">View History</Link>
                            )}
                        </div>
                        <div className="space-y-4">
                            {user?.role === 'freelancer' && proposals.length === 0 && (
                                <p className="text-slate-500 text-sm">No recent proposals.</p>
                            )}
                            {user?.role === 'freelancer' && proposals.slice(0, 3).map((prop) => (
                                <ActivityItem 
                                    key={prop._id}
                                    title={`Applied to: ${prop.jobId?.title || 'Unknown Job'}`} 
                                    time={new Date(prop.createdAt).toLocaleDateString()} 
                                    status="Pending"
                                />
                            ))}
                            {user?.role === 'client' && (
                                <p className="text-slate-500 text-sm">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Conditionally render Need More Bids popup only if bids are low */}
                    {user?.bids < 5 && (
                        <div className="glass p-6 rounded-2xl bg-gradient-to-br from-rose-500 flex flex-col items-start to-rose-600 text-white shadow-md">
                            <h3 className="text-xl font-bold mb-2">Bids Running Low!</h3>
                            <p className="text-rose-100 text-sm mb-6">You only have {user.bids} bids left. Don't miss out on high-value jobs.</p>
                            <Link to="/wallet" className="w-full bg-white text-center text-rose-600 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-lg">
                                Buy Bids Now
                            </Link>
                        </div>
                    )}
                    
                    {user?.bids >= 5 && (
                        <div className="glass p-6 rounded-2xl bg-gradient-to-br from-primary flex flex-col items-start to-sky-600 text-white">
                            <h3 className="text-xl font-bold mb-2">Wallet Ready</h3>
                            <p className="text-sky-100 text-sm mb-6">You have a healthy balance of {user.bids} bids to apply for top jobs.</p>
                            <Link to="/find-jobs" className="w-full bg-white text-center text-primary font-bold py-3 rounded-xl hover:bg-sky-50 transition-colors shadow-lg">
                                Browse Jobs
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ${color}`}>
        <div className="p-3 bg-white rounded-xl shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ActivityItem = ({ title, time, status }) => (
    <div className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg">
        <div>
            <p className="font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" /> {time}
            </p>
        </div>
        <span className="text-[10px] font-black px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 uppercase tracking-wider">
            {status}
        </span>
    </div>
);

export default Dashboard;

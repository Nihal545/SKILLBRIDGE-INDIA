import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { Briefcase, Wallet, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState({ activeJobs: 0, earnings: 0, pendingBids: 0 });

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
                    value="12"
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
                        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <ActivityItem 
                                title="Applied to Frontend Developer Role" 
                                time="2 hours ago" 
                                status="Pending"
                            />
                            <ActivityItem 
                                title="Bid Package Purchased" 
                                time="Yesterday" 
                                status="Completed"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6 rounded-2xl bg-gradient-to-br from-primary to-sky-600 text-white">
                        <h3 className="text-xl font-bold mb-2">Need more bids?</h3>
                        <p className="text-sky-100 text-sm mb-6">Upgrade your plan to apply for more high-value jobs.</p>
                        <button className="w-full bg-white text-primary font-bold py-3 rounded-xl hover:bg-sky-50 transition-colors shadow-lg">
                            Buy Bids
                        </button>
                    </div>
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
    <div className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
        <div>
            <p className="font-semibold text-slate-800">{title}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {time}
            </p>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
            {status}
        </span>
    </div>
);

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Users, FileText, IndianRupee, UserCheck, Check, X } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, activeJobs: 0, revenue: 0, pendingVerifications: 0 });
    const [pendingUsers, setPendingUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, pendingRes, transRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/pending-verifications'),
                api.get('/admin/transactions')
            ]);
            setStats(statsRes.data);
            setPendingUsers(pendingRes.data);
            setTransactions(transRes.data);
        } catch (error) {
            toast.error('Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerify = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}/verify`, { status });
            toast.success(`User ${status}`);
            fetchData(); // Refresh data
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading control center...</div>;

    return (
        <div className="py-8">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Admin Control Center</h1>
                <p className="text-slate-600 font-medium">Global platform analytics and user management.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <AdminStatCard icon={<Users />} label="Total Users" value={stats.totalUsers} />
                <AdminStatCard icon={<FileText />} label="Active Jobs" value={stats.activeJobs} />
                <AdminStatCard icon={<IndianRupee />} label="Revenue" value={`₹${stats.revenue}`} />
                <AdminStatCard icon={<UserCheck />} label="Pending IDs" value={stats.pendingVerifications} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6">Pending Verifications</h3>
                    <div className="space-y-4">
                        {pendingUsers.length === 0 ? (
                            <p className="text-slate-400 text-sm">No pending verifications.</p>
                        ) : (
                            pendingUsers.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.idVerification.idType} • {user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleVerify(user._id, 'approved')} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => handleVerify(user._id, 'rejected')} className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass p-6 rounded-2xl">
                    <h3 className="text-xl font-bold mb-6">Recent Transactions</h3>
                    <div className="space-y-4 text-sm">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-slate-400 border-b border-slate-100">
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Amount</th>
                                    <th className="pb-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan="3" className="py-4 text-slate-400">No recent transactions.</td></tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx._id} className="border-b border-slate-50 last:border-0">
                                            <td className="py-4 font-semibold text-slate-700">{tx.userId?.name || 'User'}</td>
                                            <td className="py-4 font-bold text-emerald-600">₹{tx.amount}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-full ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminStatCard = ({ icon, label, value }) => (
    <div className="glass p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="text-primary mb-2">{icon}</div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
    </div>
);

export default AdminDashboard;

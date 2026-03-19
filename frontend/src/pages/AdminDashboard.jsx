import React, { useState, useEffect } from 'react';
import { Users, FileText, IndianRupee, UserCheck, Shield, Check, X, Ban, Trash2 } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'control_center'
    const [stats, setStats] = useState({ totalUsers: 0, activeJobs: 0, revenue: 0, pendingVerifications: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (error) {
            toast.error('Failed to fetch admin stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        }
    }, [activeTab]);

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading Admin Panel...</div>;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Super Admin Space</h1>
                    <p className="text-slate-600 font-medium">Global analytics and strict modular control.</p>
                </div>
                <div class="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('control_center')}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'control_center' ? 'bg-rose-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        <Shield size={16} /> Control Center
                    </button>
                </div>
            </header>

            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <AdminStatCard icon={<Users />} label="Total Users" value={stats.totalUsers} />
                        <AdminStatCard icon={<FileText />} label="Active Jobs" value={stats.activeJobs} />
                        <AdminStatCard icon={<IndianRupee />} label="Total Revenue" value={`₹${stats.revenue}`} />
                        <AdminStatCard icon={<UserCheck />} label="Pending KYC" value={stats.pendingVerifications} />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <RecentTransactions />
                    </div>
                </div>
            )}

            {activeTab === 'control_center' && (
                <div className="animate-fade-in">
                    <ControlCenter />
                </div>
            )}
        </div>
    );
};

// Sub Components
const AdminStatCard = ({ icon, label, value }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-primary mb-3 bg-primary/10 w-12 h-12 flex items-center justify-center rounded-xl">{icon}</div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
    </div>
);

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        api.get('/admin/transactions').then(res => setTransactions(res.data)).catch(() => {});
    }, []);
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Recent Revenue</h3>
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
                            <tr><td colSpan="3" className="py-4 text-slate-400 text-center font-medium">No transactions yet.</td></tr>
                        ) : (
                            transactions.map(tx => (
                                <tr key={tx._id} className="border-b border-slate-50 last:border-0">
                                    <td className="py-4 font-bold text-slate-700">{tx.userId?.name || 'Unknown User'}</td>
                                    <td className="py-4 font-black text-emerald-600">₹{tx.amount}</td>
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
    );
};

const ControlCenter = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [pending, setPending] = useState([]);

    const fetchAll = async () => {
        const [u, j, p] = await Promise.all([
            api.get('/admin/users'),
            api.get('/admin/jobs'),
            api.get('/admin/pending-verifications')
        ]);
        setUsers(u.data);
        setJobs(j.data);
        setPending(p.data);
    };

    useEffect(() => { fetchAll(); }, []);

    const toggleBanState = async (id) => {
        if(window.confirm('Toggle ban status for this user?')) {
            try { await api.put(`/admin/users/${id}/ban`); toast.success('User status updated'); fetchAll(); } 
            catch { toast.error('Action failed'); }
        }
    };

    const deleteJob = async (id) => {
        if(window.confirm('Delete this job permanently?')) {
            try { await api.delete(`/admin/jobs/${id}`); toast.success('Job removed'); fetchAll(); } 
            catch { toast.error('Action failed'); }
        }
    };

    const verifyID = async (id, status) => {
        try { await api.put(`/admin/users/${id}/verify`, { status }); toast.success(`ID ${status}`); fetchAll(); } 
        catch { toast.error('Verification failed'); }
    };

    return (
        <div className="space-y-8">
            {/* User Moderation */}
            <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><Users className="text-rose-500"/> User Moderation ({users.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 border-b">
                            <tr><th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Role</th><th className="pb-3">Action</th></tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {users.map(u => (
                                <tr key={u._id} className={`border-b border-slate-50 ${u.role==='banned'&&'bg-rose-50/50'}`}>
                                    <td className="py-3 font-bold">{u.name} {u.role === 'banned' && <span className="text-rose-500 ml-2">(BANNED)</span>}</td>
                                    <td className="py-3">{u.email}</td>
                                    <td className="py-3 uppercase text-xs font-bold">{u.role}</td>
                                    <td className="py-3">
                                        <button onClick={() => toggleBanState(u._id)} className="text-rose-500 hover:text-rose-700 flex items-center gap-1 font-bold text-xs"><Ban size={14}/> {u.role==='banned' ? 'UNBAN' : 'BAN'}</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && <tr><td colSpan="4" className="py-4 text-center">No users found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Job Moderation */}
            <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><FileText className="text-amber-500"/> Content & Job Moderation ({jobs.length})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-slate-400 border-b">
                            <tr><th className="pb-3">Title</th><th className="pb-3">Client</th><th className="pb-3">Budget</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr>
                        </thead>
                        <tbody className="text-slate-700">
                            {jobs.map(j => (
                                <tr key={j._id} className="border-b border-slate-50">
                                    <td className="py-3 font-bold truncate max-w-[200px]">{j.title}</td>
                                    <td className="py-3">{j.clientId?.name || 'Unknown'}</td>
                                    <td className="py-3 text-emerald-600 font-bold">₹{j.budget}</td>
                                    <td className="py-3 uppercase text-xs font-bold">{j.status}</td>
                                    <td className="py-3">
                                        <button onClick={() => deleteJob(j._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-bold text-xs"><Trash2 size={14}/> REMOVE</button>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && <tr><td colSpan="5" className="py-4 text-center">No jobs found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* KYC Verifications */}
            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2"><UserCheck className="text-blue-500"/> Pending KYC Approvals ({pending.length})</h3>
                <div className="space-y-4">
                    {pending.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center font-medium">No pending ID verifications.</p>
                    ) : (
                        pending.map(user => (
                            <div key={user._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-xl gap-4">
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{user.name} <span className="text-xs font-medium text-slate-500 ml-2">({user.email})</span></p>
                                    <p className="text-sm font-medium text-slate-500 mt-1">ID Type: <span className="text-slate-700 font-bold">{user.idVerification.idType}</span></p>
                                    <a href={user.idVerification.documentImage} target="_blank" rel="noreferrer" className="text-primary text-xs font-bold underline mt-2 inline-block">View Document Image</a>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => verifyID(user._id, 'approved')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-bold text-sm flex items-center gap-2">
                                        <Check size={16} /> Approve
                                    </button>
                                    <button onClick={() => verifyID(user._id, 'rejected')} className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-bold text-sm flex items-center gap-2">
                                        <X size={16} /> Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

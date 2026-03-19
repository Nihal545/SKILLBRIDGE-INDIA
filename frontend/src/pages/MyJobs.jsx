import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Link } from 'react-router-dom';
import { Briefcase, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/client');
            setJobs(res.data);
        } catch (error) {
            toast.error('Failed to load your jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCloseJob = async (id) => {
        if (!window.confirm('Are you sure you want to close this job? Freelancers will no longer be able to submit proposals.')) return;
        try {
            await api.put(`/jobs/${id}/close`);
            toast.success('Job closed successfully.');
            fetchJobs(); // refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to close job');
        }
    };

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading your jobs...</div>;

    return (
        <div className="py-8 max-w-5xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Posted Jobs</h1>
                    <p className="text-slate-600 font-medium">Manage your job listings and review incoming proposals.</p>
                </div>
                <Link to="/post-job" className="btn-primary w-full md:w-auto text-center">Post New Job</Link>
            </header>

            <div className="space-y-6">
                {jobs.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border-2 border-dashed border-slate-200">
                        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No Jobs Posted</h3>
                        <p className="text-slate-500 mt-2">You haven't created any job listings yet.</p>
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job._id} className="glass p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className={`text-2xl font-bold ${job.status === 'closed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                        {job.title}
                                    </h3>
                                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full tracking-wider ${
                                        job.status === 'closed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                        {job.status === 'closed' ? 'Closed' : 'Active'}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                                    <span>Budget: <span className="text-emerald-600 font-bold">₹{job.budget}</span></span>
                                    <span>Date Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 w-full md:w-auto">
                                <Link to={`/my-jobs/${job._id}/proposals`} className="btn-primary flex justify-center items-center gap-2">
                                    <Users className="w-4 h-4" /> View Proposals
                                </Link>
                                {job.status !== 'closed' && (
                                    <button 
                                        onClick={() => handleCloseJob(job._id)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Close Job
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyJobs;

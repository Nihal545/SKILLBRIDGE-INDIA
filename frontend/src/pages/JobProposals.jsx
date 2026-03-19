import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/api';
import { Star, CheckCircle, ArrowLeft, User } from 'lucide-react';
import toast from 'react-hot-toast';

const JobProposals = () => {
    const { jobId } = useParams();
    const [proposals, setProposals] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProposals = async () => {
        try {
            const res = await api.get(`/proposals/job/${jobId}`);
            setProposals(res.data);

            // Also fetch the job title
            const jobRes = await api.get(`/jobs/${jobId}`);
            setJobTitle(jobRes.data.title);
        } catch (error) {
            toast.error('Failed to load proposals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [jobId]);

    const handleHire = async (proposalId, freelancerName) => {
        if (!window.confirm(`Hire ${freelancerName} for this job? This will close the job and reject all other proposals.`)) return;
        try {
            await api.put(`/proposals/${proposalId}/hire`);
            toast.success(`${freelancerName} has been hired! 🎉`);
            fetchProposals(); // Refresh after hire
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to hire freelancer');
        }
    };

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading proposals...</div>;

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <Link to="/my-jobs" className="flex items-center gap-2 text-primary font-bold hover:underline mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to My Jobs
                </Link>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Proposals for: <span className="text-primary">{jobTitle}</span></h1>
                <p className="text-slate-600 font-medium">{proposals.length} freelancer(s) submitted a proposal.</p>
            </div>

            <div className="space-y-6">
                {proposals.length === 0 ? (
                    <div className="text-center py-20 glass rounded-2xl border-2 border-dashed border-slate-200">
                        <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No Proposals Yet</h3>
                        <p className="text-slate-500 mt-2">No freelancers have applied to this job yet. Check back later.</p>
                    </div>
                ) : (
                    proposals.map(prop => {
                        const isHired = prop.status === 'hired';
                        const isRejected = prop.status === 'rejected';
                        return (
                            <div key={prop._id} className={`glass p-6 rounded-2xl shadow-sm relative overflow-hidden ${isHired ? 'border-2 border-emerald-400' : ''}`}>
                                {isHired && (
                                    <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-black px-4 py-1 rounded-bl-xl flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> HIRED
                                    </div>
                                )}
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-lg">
                                                {prop.freelancerId?.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-lg">{prop.freelancerId?.name}</p>
                                                <p className="text-xs text-slate-500">{prop.freelancerId?.email}</p>
                                            </div>
                                            {prop.freelancerId?.verified && (
                                                <span className="text-[10px] font-black bg-sky-50 text-primary px-2 py-1 rounded-full border border-sky-100">✓ Verified</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 mt-1">
                                            <Star className="w-4 h-4 fill-amber-400" />
                                            <span className="text-sm font-bold">{prop.freelancerId?.rating || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Bid Amount</p>
                                        <p className="text-3xl font-black text-emerald-600">₹{prop.bidAmount}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                                    <p className="text-sm font-bold text-slate-500 mb-1">Cover Letter:</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{prop.coverLetter}</p>
                                </div>

                                {!isHired && !isRejected && (
                                    <button
                                        onClick={() => handleHire(prop._id, prop.freelancerId?.name)}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" /> Hire This Freelancer
                                    </button>
                                )}

                                {isRejected && (
                                    <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest">Proposal Rejected</p>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default JobProposals;

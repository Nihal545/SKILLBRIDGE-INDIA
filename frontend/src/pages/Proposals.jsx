import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { FileText, Clock, FileCheck } from 'lucide-react';

const Proposals = () => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const res = await api.get('/proposals/freelancer');
                setProposals(res.data);
            } catch (error) {
                console.error('Failed to load proposals', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProposals();
    }, []);

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading proposal history...</div>;

    return (
        <div className="py-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                    <FileText className="text-primary w-8 h-8"/> Proposal History
                </h1>
                <p className="text-slate-600 font-medium">Track all your submitted applications and their current status.</p>
            </header>

            <div className="space-y-6">
                {proposals.length === 0 ? (
                    <div className="glass p-12 rounded-2xl text-center border-dashed border-2 border-slate-200">
                        <FileCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">No Proposals Yet</h3>
                        <p className="text-slate-500 mt-2">Start exploring the job board to submit your first proposal.</p>
                    </div>
                ) : (
                    proposals.map(prop => (
                        <div key={prop._id} className="glass p-6 rounded-2xl hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{prop.jobId?.title || 'Job Unavailable'}</h3>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {new Date(prop.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                            prop.jobId?.status === 'open' ? 'bg-sky-50 text-sky-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            Job Status: {prop.jobId?.status || 'Unknown'}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Your Bid</p>
                                    <p className="text-2xl font-black text-emerald-600">₹{prop.bidAmount}</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                    <span className="font-bold block mb-1 text-slate-500">Cover Letter:</span>
                                    {prop.coverLetter}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Proposals;

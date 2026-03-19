import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, MapPin, DollarSign, ArrowRight, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const FindJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [coverLetter, setCoverLetter] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { user } = useSelector(state => state.auth);

    const fetchJobs = async () => {
        try {
            const { data } = await api.get('/jobs');
            setJobs(data);
        } catch (err) {
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => 
        job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job?.clientId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApply = async (e) => {
        e.preventDefault();
        if (!bidAmount || !coverLetter) return toast.error('All fields required');
        
        setSubmitting(true);
        try {
            await api.post('/proposals', {
                jobId: selectedJob._id,
                bidAmount: Number(bidAmount),
                coverLetter
            });
            toast.success('Proposal submitted successfully!');
            setSelectedJob(null);
            setBidAmount('');
            setCoverLetter('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Bidding failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="py-8">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Find Your Next Big <span className="text-primary">Opportunity</span></h1>
                <div className="max-w-2xl mx-auto relative mt-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for skills, titles, or keywords..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg shadow-sm"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-center py-20 font-bold text-slate-400">Loading amazing jobs...</div>
                ) : filteredJobs.length === 0 ? (
                    <div className="text-center py-20 font-bold text-slate-400">No jobs found matching your search.</div>
                ) : (
                    filteredJobs.map(job => (
                        <div key={job._id} className="glass p-6 rounded-2xl hover:border-primary/30 transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 bg-sky-100 text-primary text-xs font-bold rounded-full uppercase">Full Time</span>
                                    {job.urgent && <span className="px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full uppercase">Urgent</span>}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                <p className="text-slate-600 mb-4 line-clamp-2">{job.description}</p>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                    <span className="flex items-center gap-1 font-bold text-emerald-600"><DollarSign className="w-4 h-4" /> ₹{job.budget?.toLocaleString()}</span>
                                    <span className="flex items-center gap-1">Required: {job.bidsRequired || 5} Bids</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                                {user?.role === 'freelancer' && (
                                    <button 
                                        onClick={() => {
                                            setSelectedJob(job);
                                            setBidAmount(job.budget?.toString() || '');
                                        }}
                                        className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8"
                                    >
                                        Apply Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                )}
                                <p className="text-xs text-slate-400 font-medium italic">Posted by {job.clientId?.name}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bidding Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass max-w-lg w-full p-8 rounded-3xl shadow-2xl relative">
                        <button onClick={() => setSelectedJob(null)} className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Apply for {selectedJob.title}</h2>
                        <p className="text-slate-500 text-sm mb-6 font-medium">Required: <span className="font-bold text-slate-800">{selectedJob.bidsRequired} Bids</span> • Job Budget: <span className="font-bold text-emerald-600">₹{selectedJob.budget}</span></p>
                        
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Your Bid Proposed Amount (₹)</label>
                                <input 
                                    type="number" 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 text-emerald-600"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder="Enter your bid amount"
                                    required
                                />
                                <p className="text-xs text-slate-500 mt-1">Auto-calculated based on job budget. You can modify if needed.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Cover Letter</label>
                                <textarea 
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 h-40 resize-none"
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    placeholder="Why are you the perfect fit for this job?"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full btn-primary py-4 text-lg font-bold">
                                {submitting ? 'Submitting Proposal...' : 'Send Proposal'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindJobs;

import React, { useState } from 'react';
import api from '../api/api';
import { PlusCircle, Info, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        skills: '',
        urgent: false
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const jobData = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()),
                budget: Number(formData.budget)
            };
            await api.post('/jobs', jobData);
            toast.success('Job posted successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    const calculateBids = (budget, urgent) => {
        let bids = 2;
        const b = Number(budget) || 0;
        if (b > 50000) bids = 50;
        else if (b > 15000) bids = 20;
        else if (b > 5000) bids = 10;
        else if (b > 1000) bids = 5;
        else bids = 2;
        if (urgent) bids += 2;
        return bids;
    };

    return (
        <div className="py-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-2">
                <PlusCircle className="text-primary w-8 h-8" /> Post a New Job
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-2xl shadow-sm">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Project Title</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Build a Responsive Portfolio with React"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                    <textarea 
                        rows="6"
                        placeholder="Describe the project requirements, deliverables, and timeline..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-bold text-slate-700">Budget (₹)</label>
                            <span className="text-xs font-bold text-primary bg-sky-50 px-2 py-1 rounded-lg">
                                Cost: {calculateBids(formData.budget, formData.urgent)} Bids
                            </span>
                        </div>
                        <input 
                            type="number" 
                            placeholder="5000"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.budget}
                            onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Skills (Comma separated)</label>
                        <input 
                            type="text" 
                            placeholder="React, CSS, Node.js"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={formData.skills}
                            onChange={(e) => setFormData({...formData, skills: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-sky-50 rounded-xl border border-sky-100 italic text-sky-800 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>SkillBridge uses dynamic bidding. High budget or urgent jobs require more bids from freelancers.</span>
                </div>

                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="urgent"
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                        checked={formData.urgent}
                        onChange={(e) => setFormData({...formData, urgent: e.target.checked})}
                    />
                    <label htmlFor="urgent" className="text-sm font-bold text-slate-700">Mark as Urgent (Increases visibility & bidding cost)</label>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2 shadow-lg"
                >
                    <Sparkles className="w-5 h-5" /> {loading ? 'Posting...' : 'Post Job Now'}
                </button>
            </form>
        </div>
    );
};

export default PostJob;

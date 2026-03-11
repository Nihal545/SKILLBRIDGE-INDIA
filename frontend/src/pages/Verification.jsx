import React, { useState, useEffect } from 'react';
import { Shield, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

const Verification = () => {
    const [idType, setIdType] = useState('Aadhaar');
    const [idNumber, setIdNumber] = useState('');
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('none'); // none, pending, approved, rejected
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                setStatus(data.idVerification.status);
            } catch (error) {
                console.error('Error fetching verification status', error);
            }
        };
        fetchStatus();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!idNumber) return toast.error('Please enter your ID number');
        // if (!file) return toast.error('Please select a document'); // File upload disabled for now as per simple req
        
        setLoading(true);
        try {
            await api.post('/auth/verify', { idType, idNumber });
            setStatus('pending');
            toast.success('Verification request submitted!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 max-w-2xl mx-auto">
            <header className="text-center mb-10">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="text-primary w-10 h-10" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Identity Verification</h1>
                <p className="text-slate-600 mt-2">Verify your identity to unlock bidding and build trust.</p>
            </header>

            {status === 'pending' ? (
                <div className="glass p-10 rounded-3xl text-center shadow-sm">
                    <CheckCircle className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
                    <h2 className="text-2xl font-bold mb-2">Verification Pending</h2>
                    <p className="text-slate-500">Our team is reviewing your document. This usually takes 24-48 hours.</p>
                </div>
            ) : (
                <form onSubmit={handleUpload} className="glass p-8 rounded-3xl shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Select ID Type</label>
                        <div className="grid grid-cols-3 gap-4">
                            {['Aadhaar', 'PAN', 'Passport'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setIdType(type)}
                                    className={`py-3 rounded-xl font-bold text-sm transition-all ${idType === type ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">ID Number</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder={`Enter your ${idType} number`}
                            value={idNumber}
                            onChange={(e) => setIdNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors group cursor-pointer relative">
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files[0])}
                            accept="image/*,.pdf"
                        />
                        <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-primary transition-colors" />
                        <p className="font-bold text-slate-700">{file ? file.name : 'Click to upload or drag & drop'}</p>
                        <p className="text-xs text-slate-400 mt-2">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p>Your ID details are encrypted using AES-256 and stored securely. We only use this for verification purposes.</p>
                    </div>

                    <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-lg shadow-lg">
                        {loading ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Verification;

import React from 'react';
import { useSelector } from 'react-redux';
import { Wallet as WalletIcon, Plus, Send, History } from 'lucide-react';

const Wallet = () => {
    const { user } = useSelector(state => state.auth);

    const packages = [
        { id: 1, name: 'Starter', price: 200, bids: 50, popular: false },
        { id: 2, name: 'Growth', price: 500, bids: 140, popular: true },
        { id: 3, name: 'Pro', price: 900, bids: 300, popular: false },
        { id: 4, name: 'Elite', price: 2000, bids: 800, popular: false },
    ];

    return (
        <div className="py-8">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
                    <WalletIcon className="text-primary w-8 h-8" /> My Wallet
                </h1>
                <p className="text-slate-600">Manage your bids and transaction history.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-1 bg-gradient-to-br from-primary to-sky-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-sky-100 font-medium mb-1 text-sm uppercase tracking-widest">Available Bids</p>
                        <p className="text-6xl font-black mb-6">{user?.bids || 0}</p>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-white text-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> Add Bids
                            </button>
                            <button className="flex-1 bg-sky-400/30 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm">
                                <History className="w-4 h-4" /> History
                            </button>
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
                </div>

                <div className="lg:col-span-2 glass rounded-3xl p-8 flex flex-col justify-center">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> Why use bids?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm font-bold text-primary">1</div>
                            <p className="text-sm text-slate-600 font-medium">Use bids to apply for jobs that match your skills.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-white rounded-lg shadow-sm font-bold text-primary">2</div>
                            <p className="text-sm text-slate-600 font-medium">Premium jobs require more bids but offer higher pay.</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-8">Purchase Bid Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map(pkg => (
                    <div key={pkg.id} className={`relative glass p-6 rounded-3xl transition-all hover:scale-[1.03] flex flex-col items-center text-center ${pkg.popular ? 'border-2 border-primary ring-4 ring-primary/10 shadow-lg' : 'border border-slate-100'}`}>
                        {pkg.popular && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</span>
                        )}
                        <h4 className="text-lg font-bold text-slate-400 uppercase tracking-tighter mb-2">{pkg.name}</h4>
                        <p className="text-4xl font-black text-slate-800 mb-1">{pkg.bids} <span className="text-sm text-slate-400 font-medium">Bids</span></p>
                        <p className="text-xl font-bold text-primary mb-6">₹{pkg.price}</p>
                        <button className={`w-full py-3 rounded-xl font-bold transition-all ${pkg.popular ? 'bg-primary text-white shadow-md' : 'btn-secondary text-primary'}`}>
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wallet;

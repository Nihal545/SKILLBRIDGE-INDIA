import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FindJobs from './pages/FindJobs';
import PostJob from './pages/PostJob';
import Wallet from './pages/Wallet';
import Verification from './pages/Verification';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="max-w-7xl mx-auto px-6 pb-20">
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/jobs" element={<FindJobs />} />
                        <Route path="/post-job" element={<PostJob />} />
                        <Route path="/wallet" element={<Wallet />} />
                        <Route path="/verify" element={<Verification />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
                <Toaster position="bottom-right" />
            </div>
        </Router>
    );
};

export default App;

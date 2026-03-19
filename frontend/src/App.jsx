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
import Proposals from './pages/Proposals';

import ProtectedRoute from './components/ProtectedRoute';

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
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/proposals" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
                        <Route path="/jobs" element={<ProtectedRoute><FindJobs /></ProtectedRoute>} />
                        <Route path="/post-job" element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
                        <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                        <Route path="/verify" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    </Routes>
                </main>
                <Toaster position="bottom-right" />
            </div>
        </Router>
    );
};


export default App;

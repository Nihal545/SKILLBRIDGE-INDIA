import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(state => state.auth);
    // Token lives in localStorage, NOT in Redux state (Redux has only 'user' field)
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Not logged in -> Login page
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Unverified Freelancer -> force to Verification page
    // Backend returns flat user: { role, idVerification: { status } }
    if (
        user.role === 'freelancer' &&
        (!user.idVerification || user.idVerification?.status === 'none') &&
        location.pathname !== '/verify'
    ) {
        return <Navigate to="/verify" replace />;
    }

    // Success -> Render children
    return children;
};

export default ProtectedRoute;


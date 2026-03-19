import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { user, token } = useSelector(state => state.auth);
    const location = useLocation();

    // Not logged in -> Login page
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Unverified Freelancer strictly redirected to Verification page
    if (user.role === 'freelancer' && user.idVerification?.status === 'none' && location.pathname !== '/verify') {
        return <Navigate to="/verify" replace />;
    }

    // Success -> Render children
    return children;
};

export default ProtectedRoute;

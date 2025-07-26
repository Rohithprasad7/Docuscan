// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
    const token = localStorage.getItem('token'); // Get token
    const userRole = localStorage.getItem('role'); // Get role

    return (
        <Route
            {...rest}
            render={props => {
                if (!token) {
                    return <Navigate to="/login" />; // Redirect to login if not authenticated
                }

                if (roles && !roles.includes(userRole)) {
                    return <Navigate to="/unauthorized" />; // Redirect if not authorized
                }

                return <Component {...props} />; // Authorized
            }}
        />
    );
};

export default ProtectedRoute;

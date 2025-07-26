import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Upload from './components/UploadDocument';
import Users from './components/Users';
import EditUser from './components/EditUser';
import AdminAnalytics from './components/AdminAnalytics'; // Import the new AdminAnalytics component
import EditProfile from './components/EditProfile'; // Import the EditProfile component
const App = () => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [hasVisitedDashboard, setHasVisitedDashboard] = useState(() => {
        return localStorage.getItem('hasVisitedDashboard') === 'true';
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('hasVisitedDashboard');
        }
    }, [user]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Fetch the user profile details from the backend
            const fetchUserProfile = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUser(response.data); // Set the user data
                } catch (err) {
                    console.error('Error fetching user profile:', err);
                    // Optionally handle error, e.g., redirect to login
                }
            };
            fetchUserProfile();
        }
    }, []);

    const handleDashboardVisit = () => {
        setHasVisitedDashboard(true);
        localStorage.setItem('hasVisitedDashboard', 'true');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setHasVisitedDashboard(false);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <Router>
            <Navbar 
                isAuthenticated={!!user} 
                onLogout={handleLogout} 
                role={user?.role} 
                showAdminLink={hasVisitedDashboard} 
            />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />

                <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
                
                {/* Correctly formatted Dashboard route */}
                <Route 
                    path="/dashboard" 
                    element={user ? (
                        <Dashboard 
                            token={user.token} 
                            user={user} // Pass user data including username
                            onVisitDashboard={handleDashboardVisit}
                        />
                    ) : (
                        <Navigate to="/" />
                    )}
                />

                <Route path="/edit-profile" element={<EditProfile user={user} />} />
                <Route path="/upload" element={user ? <Upload /> : <Navigate to="/" />} />

                {/* Admin routes */}
                <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
                <Route path="/admin/users" element={isAdmin ? <Users /> : <Navigate to="/" />} />
                <Route path="/admin/analytics" element={isAdmin ? <AdminAnalytics /> : <Navigate to="/" />} />
                <Route path="/admin/users/edit/:id" element={isAdmin ? <EditUser /> : <Navigate to="/" />} />

            </Routes>
        </Router>
    );
};

export default App;

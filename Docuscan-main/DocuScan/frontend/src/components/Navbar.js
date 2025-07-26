import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout, role }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        onLogout();
        navigate('/'); // Redirect to Home after logout
    };

    return (
        <nav className="bg-blue-900 p-4">
            <div className="container mx-auto flex justify-between">
                <Link to="/" className="text-white text-lg font-bold">Home</Link>
                <div>
                    <Link to="/" className="text-white mx-2">Home</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-white mx-2">Dashboard</Link>
                            <Link to="/upload" className="text-white mx-2">Online OCR</Link>
                            {/* Show Admin Panel link on every page except Home if user is an admin */}
                            {role === 'admin' && location.pathname !== '/' && (
                                <Link to="/admin" className="text-white mx-2">Admin Panel</Link>
                            )}
                            <Link to="/edit-profile" className="text-white mx-2">Profile</Link>
                            <button onClick={handleLogout} className="text-white mx-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-white mx-2">Login</Link>
                            <Link to="/register" className="text-white mx-2">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

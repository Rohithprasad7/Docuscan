// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user?.username || 'User'}!</h2>
                <p className="text-gray-600 mb-2">Email: {user?.email || 'Not available'}</p>
                <p className="text-gray-600 mb-6">Manage your profile settings and documents below.</p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/edit-profile')}
                        className="w-full px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200 ease-in-out"
                    >
                        Edit Profile
                    </button>

                    <button
                        onClick={() => navigate('/upload')}
                        className="w-full px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
                    >
                        Upload Document
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// components/AdminPanel.js

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
    const [analytics, setAnalytics] = useState({
        documentsUploaded: 0,
        usersRegistered: 0,
        ocrSuccessRate: '0%',
    });

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/analytics');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Function to generate a circular rating effect
    const circularRating = (percentage) => {
        const radius = 40; // Adjust radius as needed
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        return {
            strokeDasharray: circumference,
            strokeDashoffset: offset,
        };
    };

    const { strokeDasharray, strokeDashoffset } = circularRating(parseFloat(analytics.ocrSuccessRate));

    return (
        <div className="flex flex-col justify-center min-h-screen ">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-5xl w-full mx-auto">
                {/* Analytics Section */}
                <div className="bg-white col-span-8 shadow-xl rounded-lg p-8 flex flex-col items-center">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Analytics Overview</h1>
                    <div className="space-y-4 w-full">
                        <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg shadow-md w-full">
                            <p className="text-lg text-gray-700">
                                Documents Uploaded: <span className="font-bold text-gray-900">{analytics.documentsUploaded}</span>
                            </p>
                        </div>
                        <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded-lg shadow-md w-full">
                            <p className="text-lg text-gray-700">
                                Users Registered: <span className="font-bold text-gray-900">{analytics.usersRegistered}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-sky-50 rounded-lg shadow-md">
                            <h3 className="text-lg text-gray-700 mb-2">OCR Success Rate</h3>
                            <div className="relative w-24 h-24">
                                <svg className="absolute" width="100%" height="100%">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="40"
                                        fill="transparent"
                                        stroke="lightgray"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="40"
                                        fill="transparent"
                                        stroke="skyblue"
                                        strokeWidth="8"
                                        style={{
                                            strokeDasharray: strokeDasharray,
                                            strokeDashoffset: strokeDashoffset,
                                            transition: 'stroke-dashoffset 0.5s ease-in-out',
                                        }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-800">
                                        {analytics.ocrSuccessRate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="bg-white shadow-xl col-span-4 rounded-lg p-8 flex flex-col items-center">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">User Management</h1>
                    <div className="flex flex-col space-y-4 w-full">
                        <Link to="/admin/users">
                            <button className="w-full px-6 py-4 bg-blue-700 hover:bg-blue-800 transition duration-300 text-white font-semibold rounded-lg shadow-lg">
                                Manage Users
                            </button>
                        </Link>
                        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-lg shadow-md w-full">
                            <p className="text-lg text-gray-700">
                                Last Login Time: <span className="font-bold text-gray-900">Just now</span>
                            </p>
                        </div>
                        <div className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg shadow-md w-full">
                            <p className="text-lg text-gray-700">
                                Total Active Users: <span className="font-bold text-gray-900">{analytics.usersRegistered}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;

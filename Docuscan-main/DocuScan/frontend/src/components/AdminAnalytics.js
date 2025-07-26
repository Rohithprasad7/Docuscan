import React, { useEffect, useState } from 'react';

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState({ 
        documentsUploaded: 0, 
        usersRegistered: 0, 
        ocrSuccessRate: '0%' 
    });

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/analytics'); // Ensure this matches your server route
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Analytics Data:', data); // Log fetched analytics for debugging
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    useEffect(() => {
        fetchAnalytics(); // Fetch data when the component mounts
    }, []);

    return (
        <div>
            <h1>Analytics</h1>
            <p>Documents Uploaded: {analytics.documentsUploaded}</p>
            <p>Users Registered: {analytics.usersRegistered}</p>
            <p>OCR Success Rate: {analytics.ocrSuccessRate}</p>
        </div>
    );
};

export default AdminAnalytics;

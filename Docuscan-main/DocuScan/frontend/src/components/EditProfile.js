import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = ({ user }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log('User profile fetched successfully:', response.data); // Debugging line

                // Ensure your response structure is correct
                if (response.data && response.data.user) {
                    setUsername(response.data.user.username || '');
                    setEmail(response.data.user.email || '');
                } else {
                    throw new Error('Unexpected response structure');
                }
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                setError('Failed to fetch user details. Please log in again.');
                navigate('/login');
            }
        };

        if (!user) {
            fetchUserProfile();
        } else {
            setUsername(user.username || '');
            setEmail(user.email || '');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found. Please log in again.');
            return;
        }
    
        try {
            const response = await axios.put(
                'http://localhost:5000/api/user/profile',
                { username, email },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            alert('Profile updated successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error('Error updating profile:', err.response?.data || err);
            setError(err.response?.data?.error || 'Failed to update profile');
        }
    };
    
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Update Profile
                    </button>
                </form>
                
            </div>
            
        </div>
    );
};

export default EditProfile;

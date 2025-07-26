import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state
    
        try {
            // Make the login request
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });
    
            // Log the response to check what is returned
            console.log('Login response:', response.data); // Ensure this is logging expected response
    
            const { token, user } = response.data; // Ensure response structure matches this
            if (token && user) {
                localStorage.setItem('token', token); // Store token in localStorage
                setUser({ ...user, token }); // Set user state with token
                navigate('/dashboard'); // Redirect to dashboard
            } else {
                setError('Login failed. Please try again.'); // If token or user is missing
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                setError(err.response?.data?.error || 'Login failed');
            } else {
                setError('Network error. Please try again later.');
            }
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div>
                        <label className="block text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </button>
                </form>
                 
                
            </div>
        </div>
    );
};

export default Login;

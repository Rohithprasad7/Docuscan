import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true
        setMessage(''); // Clear any previous messages
        setError(''); // Clear previous errors

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                email,
                password
            });

            // Only set success message on successful registration
            setMessage('Registration successful! Redirecting to login...');
            // Clear the input fields after success
            setUsername('');
            setEmail('');
            setPassword('');

            // Redirect to login after a brief delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            console.error('Registration error:', err.response || err.message);
            // Handle server error
            setError(err.response?.data.error || 'Registration failed');
            setMessage(''); // Clear the message on error
        } finally {
            setLoading(false); // Set loading back to false
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            <form onSubmit={handleRegister} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
            {message && (
                <div className="text-green-500 mt-4">
                    {message}
                </div>
            )}
            {error && (
                <div className="text-red-500 mt-4">
                    {error}
                </div>
            )}
        </div>
    );
};

export default Register;

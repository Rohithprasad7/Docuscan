import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // State for success message
    const navigate = useNavigate();

    // Fetch user data by ID
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/auth/admin/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const user = response.data;
            setUsername(user.username);
            setEmail(user.email);
            setRole(user.role);
        } catch (err) {
            console.error('Error fetching user data:', err);
            setError('Failed to fetch user data');
        }
    };

    // Handle form submission to update user data
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/auth/admin/users/${id}`, 
            { username, email, role }, 
            { headers: { 'Authorization': `Bearer ${token}` } });

            // Set the success message
            setSuccessMessage('User updated successfully!');

            // Optionally, you can navigate away after a short delay
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000); // Redirect after 2 seconds
        } catch (err) {
            console.error('Error updating user:', err);
            setError('Failed to update user');
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-center">Edit User</h2>
            {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>} {/* Success message */}
            <form onSubmit={handleUpdate} className="bg-white shadow-md rounded-lg p-8">
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-200 ease-in-out">
                    Update User
                </button>
            </form>
        </div>
    );
};

export default EditUser;

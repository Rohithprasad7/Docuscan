import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/auth/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            // Sort users in descending order by creation date or _id
            const sortedUsers = response.data.sort((a, b) => b._id.localeCompare(a._id)); // Assuming _id is a string that indicates creation
            setUsers(sortedUsers);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/auth/admin/users/${selectedUser}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setUsers(users.filter(user => user._id !== selectedUser));
            setShowModal(false);
            setAlertMessage('User deleted successfully');
            setTimeout(() => setAlertMessage(''), 3000);
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user');
            setShowModal(false);
        }
    };

    const handleUpdateAlert = (message) => {
        setAlertMessage(message);
        setTimeout(() => setAlertMessage(''), 3000);
    };

    const openDeleteModal = (userId) => {
        setSelectedUser(userId);
        setShowModal(true);
    };

    const handleUpdate = async (userId) => {
        // Simulate an update operation (You may need to call an actual update API)
        try {
            await axios.put(`http://localhost:5000/api/auth/admin/users/${userId}`, {
                // Your update data here
            });
            handleUpdateAlert('User updated successfully');
            // Optionally refetch users after update
            fetchUsers();
        } catch (err) {
            console.error('Failed to update user:', err);
            setError('Failed to update user');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Manage Users</h1>

            {alertMessage && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4 transition-opacity duration-300 ease-in-out">
                    {alertMessage}
                </div>
            )}

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 p-2">{user.username}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">{user.role}</td>
                            <td className="border border-gray-300 p-2 flex items-center justify-center space-x-2">
                                <Link
                                    to={`/admin/users/edit/${user._id}`}
                                    className="text-blue-500 hover:underline"
                                    onClick={() => handleUpdate(user._id)} // Call handleUpdate to trigger the alert
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg>
                                </Link>
                                <button onClick={() => openDeleteModal(user._id)} className="text-red-500 hover:underline">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
</svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal for delete confirmation */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold text-center">Are you sure you want to delete this user?</h2>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;

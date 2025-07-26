// routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as needed
const authMiddleware = require('../middleware/auth'); // Adjust the path as necessary
const mongoose = require('mongoose');

// In routes/userRoutes.js
// Assuming you have a route like this in your user-related routes
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log('User ID from token:', userId); // Log user ID

        const user = await User.findById(userId).select('-password');
        console.log('User found:', user); // Log the found user

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// PUT /api/user/profile
router.put('/profile', authMiddleware, async (req, res) => {
    const { username, email } = req.body;
    const userId = req.user.id; // Get user ID from decoded token

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true, runValidators: true } // Return the updated user with validation
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
});


module.exports = router;

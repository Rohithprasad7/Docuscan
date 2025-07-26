const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();


// Initialize nodemailer transporter (for SMTP email)
const transporter = nodemailer.createTransport({
    service: 'gmail', // or other service you prefer
    auth: {
        user: process.env.FROM_EMAIL, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your app password
    },
});

// Function to send welcome email
const sendWelcomeEmail = async (recipientEmail, userName) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL, // Your sending email
        to: recipientEmail,            // Recipient's email
        subject: 'Welcome to DocuScan!',
        text: `Hi ${userName},\n\nThank you for registering with DocuScan! We’re excited to have you onboard.\n\nBest regards,\nThe DocuScan Team`,
    };

    try {
        // Send email using nodemailer
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        console.log('Existing User Check:', existingUser); // Debugging line

        if (existingUser) {
            console.log('Email already registered:', email); // Debugging line
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password: hashedPassword });

        console.log('New User Created:', newUser); // Debugging line

        const token = jwt.sign({ id: newUser._id, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send welcome email after successful registration
        await sendWelcomeEmail(email, username); // Call the function to send email

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        console.log('Attempting to register user:', { username, email });

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log('New User Created:', newUser);

        // Generate a token
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send a welcome email
        await sendWelcomeEmail(email, username);

        // Respond with token and user info
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error('Error in registration:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already registered.' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create and send token
        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { username: user.username, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Get all users
router.get('/admin/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Failed to fetch user' });
    }
});

// Update user by ID
router.put('/admin/users/:id', async (req, res) => {
    try {
        const updatedData = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Failed to update user' });
    }
});

// Delete user by ID
router.delete('/admin/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Failed to delete user' });
    }
});







module.exports = router;

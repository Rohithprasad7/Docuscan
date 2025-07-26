const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRouter = require('./routes/upload');
const authRouter = require('./routes/auth');
const userRoutes = require('./routes/user');
const analyticsRouter = require('./routes/analytics'); // Ensure this is imported
const authMiddleware = require('./middleware/auth'); // Import your middleware
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Use the routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRouter); // This should be correctly registered

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

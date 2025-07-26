const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token is present
    if (!token) {
        return res.status(401).json({ error: 'No authentication token found' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log the decoded information for debugging
        console.log('Decoded token:', decoded);

        // Fetch user from the database
        req.user = await User.findById(decoded.id);

        // Check if user exists
        if (!req.user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error for debugging
        console.error('JWT verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;










// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer [token]'

//     if (!token) {
//         return res.status(403).json({ error: 'No token provided' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ error: 'Unauthorized: Token is invalid' });
//         }
//         req.user = decoded; // Attach decoded user info to the request
//         next();
//     });
// };

// module.exports = authMiddleware; // Export the middleware










// // middleware/auth.js

// const jwt = require('jsonwebtoken');

// // Auth middleware to check JWT
// // Auth middleware to check JWT
// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     if (!authHeader) return res.status(401).json({ message: 'No token provided' });

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             console.error('Token verification error:', err);
//             return res.status(403).json({ message: 'Invalid token' });
//         }
//         req.user = user; // Attach user information to the request
//         next();
//     });
// }

// // Role check middleware
// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//         return res.status(403).json({ message: 'Access forbidden' });
//     }
//     next();
// };

// module.exports = { authMiddleware, isAdmin };

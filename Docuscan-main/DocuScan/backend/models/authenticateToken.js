jwt = require('jsonwebtoken');
const User = require('./User'); // Adjust the path as necessary

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) return res.sendStatus(401); // No token

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token

        // Fetch user from the database if needed (to include role)
        const foundUser = await User.findById(user.id);
        req.user = foundUser; // Set req.user to the found user
        next();
    });
};

module.exports = authenticateToken;
// controllers/dashboardController.js

const User = require('../models/User');
const Document = require('../models/Document');

// Get dashboard analytics
exports.getDashboardData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const uploadedDocumentsCount = await Document.countDocuments(); // Total documents uploaded
        const userCount = await User.countDocuments();
        const accuracy = user.accuracy; // Assuming accuracy is stored in user model

        res.json({ uploadedDocumentsCount, userCount, accuracy });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

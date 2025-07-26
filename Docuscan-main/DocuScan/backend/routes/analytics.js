const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const User = require('../models/User');

router.get('/', async (req, res) => { // Change to '/' instead of '/analytics'
    try {
        const documentCount = await Document.countDocuments();
        const userCount = await User.countDocuments();
        const successfulOcrCount = await Document.countDocuments({
            ocrResult: { $ne: 'No text found' }
        });


        const ocrSuccessRate = documentCount > 0 
            ? ((successfulOcrCount / documentCount) * 100).toFixed(2) 
            : 0;

        res.json({
            documentsUploaded: documentCount,
            usersRegistered: userCount,
            ocrSuccessRate: `${ocrSuccessRate}%`
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Error fetching analytics' });
    }
});


router.get('/user-analytics', async (req, res) => {
    try {
        const users = await User.find().select('name'); // Adjust fields as needed
        const userAnalytics = await Promise.all(users.map(async (user) => {
            const documentCount = await Document.countDocuments({ userId: user._id }); // Assuming userId is stored in Document
            const successfulOcrCount = await Document.countDocuments({
                userId: user._id,
                ocrResult: { $ne: 'No text found' }
            });

            const ocrSuccessRate = documentCount > 0 
                ? ((successfulOcrCount / documentCount) * 100).toFixed(2) 
                : 0;

            return {
                username: user.name,
                documentCount: documentCount,
                ocrSuccessRate: `${ocrSuccessRate}%`
            };
        }));

        res.json(userAnalytics);
    } catch (error) {
        console.error('Error fetching user analytics:', error);
        res.status(500).json({ message: 'Error fetching user analytics' });
    }
});

module.exports = router;

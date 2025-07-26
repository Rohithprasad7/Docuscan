// routes/settings.js

const express = require('express');
const router = express.Router();
const { getUserSettings, updateUserSettings } = require('../controllers/settingsController'); // Ensure this path is correct

// Define your routes
router.get('/', getUserSettings); // This should be a function, check this line
router.put('/', updateUserSettings); // And this line

module.exports = router;

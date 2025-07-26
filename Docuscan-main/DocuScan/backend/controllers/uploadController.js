// backend/controllers/uploadController.js

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const Document = require('../models/Document'); // Assuming you have a Document model

// MongoDB URI
const mongoURI = 'your_mongodb_uri_here';

// Create a storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads' // Collection name
        };
    }
});

// Initialize multer
const upload = multer({ storage });

// Upload document route
exports.uploadDocument = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed', error: err });
        }
        const newDocument = new Document({
            fileUrl: req.file.id, // Save the file ID or URL
            ocrText: '', // Placeholder for OCR text
            uploadDate: new Date()
        });

        newDocument.save()
            .then(() => res.status(200).json({ message: 'File uploaded successfully', fileId: req.file.id }))
            .catch(error => {
                console.error(error);
                res.status(500).json({ message: 'Database error', error });
            });
    });
};

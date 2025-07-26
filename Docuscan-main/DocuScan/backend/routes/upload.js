const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const Document = require('../models/Document'); // Ensure the model path is correct

const router = express.Router();

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpg|jpeg|png|pdf/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new Error('File type not supported'));
    },
});

// OCR processing function with enhanced error handling
const processOCR = async (fileBuffer, filename) => {
    const formData = new FormData();
    formData.append('file', fileBuffer, { filename });

    try {
        const response = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: {
                ...formData.getHeaders(),
                'apikey': process.env.OCR_SPACE_API_KEY,
            },
        });

        console.log('OCR API Response:', response.data);

        if (response.data.IsErroredOnProcessing) {
            throw new Error(response.data.ErrorMessage[0] || 'Unknown error during OCR processing');
        }

        return response.data.ParsedResults[0]?.ParsedText || 'No text found';
    } catch (error) {
        console.error('Error during OCR processing:', error.message);
        throw new Error('OCR processing failed. Please check the API key or file format.');
    }
};

// Upload route
router.post('/', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const ocrResult = await processOCR(req.file.buffer, req.file.originalname);

        // Save the OCR result and file metadata to MongoDB
        const document = new Document({
            filename: req.file.originalname,
            ocrResult,
            uploadDate: new Date(),
        });

        await document.save();

        res.json({ message: 'Document uploaded and OCR processed successfully', document });
    } catch (error) {
        console.error('OCR processing error:', error);
        res.status(500).json({ message: error.message || 'OCR processing failed' });
    }
});

module.exports = router;

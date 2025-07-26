const mongoose = require('mongoose');

// Define the schema for the documents
const DocumentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    ocrResult: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

// Create the model from the schema
const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document; // Export the model

const fetch = require('node-fetch');

const OCR_API_KEY = process.env.OCR_API_KEY; // Add your OCR API key to .env

const ocrProcess = async (imageUrl) => {
    const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apikey: OCR_API_KEY,
            url: imageUrl,
            language: 'eng',
        }),
    });

    const data = await response.json();
    return data;
};

module.exports = { ocrProcess };

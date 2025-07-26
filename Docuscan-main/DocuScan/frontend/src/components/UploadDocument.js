import React, { useState } from 'react';

const UploadDocument = () => {
    const [file, setFile] = useState(null);
    const [ocrResult, setOcrResult] = useState('');
    const [jsonResult, setJsonResult] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showText, setShowText] = useState(true);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!file) {
            setErrorMessage('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                setOcrResult(data.document.ocrResult); // Ensure this matches the structure of your response
                setJsonResult(data.document); // Assuming 'document' contains full details
            } else {
                setErrorMessage(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error during upload:', error);
            setErrorMessage('Upload failed');
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setOcrResult('');
        setJsonResult({});
        setErrorMessage('');
    };

    const handleDownload = () => {
        const blob = new Blob([ocrResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'OCR_result.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="upload-container flex flex-col items-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="w-80 flex flex-col items-center mb-4">
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="border border-gray-300 p-2 mb-2 w-full rounded cursor-pointer"
                />
                <button
                    type="submit"
                    className="bg-sky-900 text-white p-2 rounded w-full hover:bg-sky-800 mb-2"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Start OCR'}
                </button>
            </form>

            {loading && (
                <div className="w-80 h-2 bg-gray-200 rounded mb-4">
                    <div className="bg-sky-500 h-full rounded animate-pulse" style={{ width: '50%' }} />
                </div>
            )}

            {errorMessage && (
                <div className="w-80 p-3 rounded bg-red-100 text-red-800 mb-4">
                    {errorMessage}
                </div>
            )}

            <div className="w-full max-w-lg bg-white p-4 rounded shadow mt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">OCR Result</h3>
                    {(ocrResult || Object.keys(jsonResult).length > 0) && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="bg-gray-300 text-black p-1 px-3 rounded hover:bg-gray-400"
                        >
                            Clear
                        </button>
                    )}
                </div>

                <div className="flex space-x-2 mb-4">
                    <button
                        className={`w-1/2 p-2 rounded ${showText ? 'bg-sky-900 text-white' : 'bg-gray-300'}`}
                        onClick={() => setShowText(true)}
                    >
                        Show Text
                    </button>
                    <button
                        className={`w-1/2 p-2 rounded ${!showText ? 'bg-sky-900 text-white' : 'bg-gray-300'}`}
                        onClick={() => setShowText(false)}
                    >
                        Show JSON
                    </button>
                </div>

                <div className="overflow-y-scroll max-h-64 border p-4 rounded bg-gray-50">
                    <p className="whitespace-pre-wrap text-gray-700">
                        {showText ? ocrResult : JSON.stringify(jsonResult, null, 2)}
                    </p>
                </div>

                {ocrResult && (
                    <button
                        onClick={handleDownload}
                        className="mt-4 bg-sky-900 text-white p-2 rounded hover:bg-sky-800"
                    >
                        Download Text
                    </button>
                )}
            </div>
        </div>
    );
};

export default UploadDocument;

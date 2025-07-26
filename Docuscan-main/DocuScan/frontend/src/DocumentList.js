import React, { useEffect, useState } from 'react';

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        const response = await fetch('http://localhost:5000/api/documents', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            setDocuments(data);
        } else {
            console.error('Failed to fetch documents:', data.message);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            fetchDocuments(); // Refresh the document list after deletion
        } else {
            const data = await response.json();
            console.error('Failed to delete document:', data.message);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return (
        <div className="document-list">
            <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
            <ul>
                {documents.map((doc) => (
                    <li key={doc._id} className="flex justify-between items-center p-2 border-b">
                        <span>{doc.file_url}</span>
                        <button onClick={() => handleDelete(doc._id)} className="text-red-500">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DocumentList;

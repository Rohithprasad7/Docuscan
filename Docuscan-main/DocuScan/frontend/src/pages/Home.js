// src/pages/Home.js

import React from 'react';

const Home = () => {
    return (
        <div className="home-page p-6">
            <header className="mb-8 text-center">
                <h1 className="text-4xl font-bold mb-2">Welcome to DocuScan</h1>
                <p className="text-lg text-gray-700">
                    Your AI-powered document scanning solution.
                </p>
            </header>

            <section className="features mb-10">
                <h2 className="text-3xl font-semibold mb-4 text-blue-800">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="feature-card p-4 border rounded shadow">
                        <h3 className="text-xl font-bold">Fast Scanning</h3>
                        <p className="text-gray-600">
                            Scan your documents in seconds with our advanced OCR technology.
                        </p>
                    </div>
                    <div className="feature-card p-4 border rounded shadow">
                        <h3 className="text-xl font-bold">Secure Storage</h3>
                        <p className="text-gray-600">
                            Your documents are securely stored in the cloud with encryption.
                        </p>
                    </div>
                    <div className="feature-card p-4 border rounded shadow">
                        <h3 className="text-xl font-bold">User-Friendly Interface</h3>
                        <p className="text-gray-600">
                            Our intuitive interface makes it easy for anyone to use.
                        </p>
                    </div>
                </div>
            </section>

            <section className="testimonials mb-10">
                <h2 className="text-3xl font-semibold mb-4 text-blue-800">What Our Users Say</h2>
                <div className="bg-gray-100 p-6 rounded shadow">
                    <p className="italic text-gray-700">
                        "DocuScan has transformed the way I manage my documents. It’s fast, efficient, and incredibly easy to use!" 
                    </p>
                    <p className="mt-4 text-right font-semibold">- Jane Doe</p>
                </div>
            </section>

            <section className="call-to-action text-center p-6 bg-blue-900 text-white rounded">
                <h2 className="text-3xl font-semibold mb-2">Get Started Today!</h2>
                <p className="mb-4">
                    Join thousands of satisfied users and streamline your document management process.
                </p>
                <a href="/register" className="bg-white text-blue-900 px-4 py-2 rounded font-bold hover:bg-gray-200">
                    Register Now
                </a>
            </section>
        </div>
    );
};

export default Home;

import React from 'react';
import { Head } from '@inertiajs/react';

interface WhopSuccessProps {
    receiptId: string;
    planDescription: string;
    status: string;
    message: string;
}

export default function WhopSuccess({
    receiptId,
    planDescription,
    status,
    message
}: WhopSuccessProps) {
    return (
        <>
            <Head title="Payment Successful" />
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="py-12 w-full">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl rounded-lg">
                            <div className="p-6 text-white">
                                {/* Success Icon */}
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-green-900/50 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            className="w-12 h-12 text-green-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>

                                    <h1 className="text-3xl font-bold text-white mb-4">
                                        Payment Successful!
                                    </h1>

                                    <p className="text-lg text-gray-300 mb-2">
                                        {message || 'Thank you for your purchase!'}
                                    </p>
                                </div>

                                {/* Purchase Details */}
                                <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-700">
                                    <h2 className="text-xl font-bold text-white mb-6 text-center">
                                        Purchase Details
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="text-sm text-gray-400 mb-1">Service</div>
                                            <div className="text-lg font-semibold text-white">
                                                {planDescription}
                                            </div>
                                        </div>

                                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="text-sm text-gray-400 mb-1">Status</div>
                                            <div className="text-lg font-semibold text-green-400 capitalize">
                                                {status}
                                            </div>
                                        </div>

                                        {receiptId && (
                                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 md:col-span-2">
                                                <div className="text-sm text-gray-400 mb-1">Receipt ID</div>
                                                <div className="text-sm font-mono text-gray-300 break-all">
                                                    {receiptId}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-bold text-blue-300 mb-4">
                                        What's Next?
                                    </h3>
                                    <ul className="space-y-3 text-gray-300">
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Check your email for your receipt and booking confirmation</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Chris will reach out to schedule your session</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>You can manage your purchase at any time through Whop</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="flex justify-center">
                                    <a
                                        href="/"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Return Home
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

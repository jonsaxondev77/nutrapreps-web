"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AwaitingApprovalPage: React.FC = () => {
    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                
                <h2 className="text-3xl font-bold text-gray-800">
                    Your Account is Awaiting Approval
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                    Thank you for completing your profile!
                </p>
                <p className="mt-2 text-md text-gray-700">
                    Our team needs to review and approve your account before you can place an order. This review process typically takes 24-48 hours.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    You will receive an email notification once your account has been activated. We appreciate your patience!
                </p>
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex justify-center py-3 px-5 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AwaitingApprovalPage;

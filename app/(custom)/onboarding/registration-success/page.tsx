"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MailCheck } from 'lucide-react';

const RegistrationSuccessPage: React.FC = () => {
    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                <div className="flex justify-center mb-6">
                    <MailCheck className="w-20 h-20 text-green-500" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800">
                    Registration Successful!
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                    Just one more step to get started.
                </p>
                <p className="mt-2 text-md text-gray-700">
                    We've sent a verification link to your email address. Please check your inbox (and spam folder, just in case) and click the link to activate your account.
                </p>
                
                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                    >
                        Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationSuccessPage;

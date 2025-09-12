"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp } from 'react-icons/fa';

const AwaitingApprovalPage: React.FC = () => {
    const whatsappUrl = "https://wa.me/+447469878640";
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
                <div className="mt-2 text-center">
                   
                    <p className="text-md text-gray-700 mb-3">
                        For faster approval, please message us on WhatsApp:
                    </p>
                    <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                        <div className="hidden md:block">
                            <Image
                                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://wa.me/+447568781243"
                                alt="WhatsApp QR Code"
                                width={160}
                                height={160}
                            />
                        </div>
                        <Link
                            href={whatsappUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                        >
                            <FaWhatsapp size={24} /> Message us on WhatsApp
                        </Link>
                    </div>
                </div>
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

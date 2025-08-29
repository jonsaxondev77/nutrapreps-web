"use client";

import { useState } from "react";
import { useForgotPasswordMutation } from "@/lib/store/services/authApi";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            setSubmitted(true);
        } catch (error) {
            toast.error("Could not send reset link. Please check the email address and try again.");
        }
    };

    if (submitted) {
        return (
            <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
                    <p className="mt-4 text-gray-600">
                        If an account with that email exists, we have sent a password reset link to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex justify-center items-center px-4 py-12 bg-gray-50">
            <Toaster position="top-center" />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                    Forgot Password
                </h1>
                <p className="mt-4 text-gray-600">
                    No problem! Enter your email below and we'll send you a link to reset it.
                </p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-12 w-full py-3 bg-gray-100 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50"
                    >
                        <span>{isLoading ? 'Sending...' : 'Send Reset Link'}</span>
                        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
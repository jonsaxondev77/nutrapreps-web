"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/lib/store/services/authApi";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

function ResetPasswordComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState(false);
    
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await resetPassword({ token, password, confirmPassword }).unwrap();
            setSuccess(true);
        } catch (error) {
            toast.error("Failed to reset password. The link may have expired.");
        }
    };

    if (success) {
        return (
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Password Reset!</h2>
                <p className="mt-4 text-gray-600">
                    You can now log in with your new password.
                </p>
                <button
                    onClick={() => router.push('/signin')}
                    className="mt-6 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700"
                >
                    Go to Login
                </button>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                Reset Your Password
            </h1>
            <p className="mt-4 text-gray-600">
                Please enter your new password below.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-12 w-full py-3 bg-gray-100 rounded-lg"
                    />
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-12 w-full py-3 bg-gray-100 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                    <span>{isLoading ? 'Resetting...' : 'Reset Password'}</span>
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
            </form>
        </div>
    );
}


export default function ResetPasswordPage() {
    return (
         <div className="flex-grow flex justify-center items-center px-4 py-12 bg-gray-50">
            <Toaster position="top-center" />
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordComponent />
            </Suspense>
        </div>
    )
}
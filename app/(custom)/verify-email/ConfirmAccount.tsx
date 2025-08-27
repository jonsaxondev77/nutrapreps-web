"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useConfirmEmailMutation } from '@/lib/store/services/authApi';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ConfirmAccount: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    // Local state for managing UI messages and status
    const [message, setMessage] = useState('Verifying your email...');
    const [isError, setIsError] = useState(false);

    // RTK Query mutation for email confirmation
    const [confirmEmail, { isLoading, isSuccess, isError: mutationFailed, error }] = useConfirmEmailMutation();

    useEffect(() => {
        // Effect to run the email confirmation process once the component mounts with a token.
        if (!token) {
            setMessage('No verification token found. Please check the link in your email.');
            setIsError(true);
            return;
        }

        const verifyToken = async () => {
            try {
                // Trigger the mutation and unwrap the result
                const userData = await confirmEmail(token).unwrap();
                
                setMessage(userData.message || 'Email successfully verified! Logging you in...');
                toast.success(userData.message || 'Email successfully verified!');

                // Automatically sign the user in using a special provider
                const result = await signIn('email-verification', {
                    redirect: false,
                    userData: JSON.stringify(userData),
                });

                if (result?.ok) {
                    // Redirect to the homepage on successful sign-in
                    router.push('/onboarding/complete-profile');
                } else {
                    throw new Error('Failed to create a session after email verification.');
                }

            } catch (err: any) {
                // Handle errors from the API mutation or sign-in process
                setIsError(true);
                const errorMessage = err.data?.message || err.message || 'An unexpected error occurred.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        };

        verifyToken();
    }, [token, router, confirmEmail]);

    // Render the UI based on the current state (loading, success, error)
    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                <div className="flex justify-center">
                    {isLoading && <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />}
                    {isSuccess && <CheckCircle className="w-16 h-16 text-green-500" />}
                    {isError && <XCircle className="w-16 h-16 text-red-500" />}
                </div>

                <h1 className="text-2xl font-bold text-gray-800">
                    {isLoading ? 'Verifying Your Account...' : isError ? 'Verification Failed' : 'Verification Successful!'}
                </h1>
                
                <p className="text-gray-600">{message}</p>

                {!isLoading && (
                    <div className="mt-6">
                        <button 
                            onClick={() => router.push(isError ? '/signin' : '/')} 
                            className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                        >
                            {isError ? 'Go to Login' : 'Continue to Site'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmAccount;

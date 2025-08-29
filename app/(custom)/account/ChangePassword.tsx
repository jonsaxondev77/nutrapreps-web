"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useChangePasswordMutation } from '@/lib/store/services/authApi';
import { Lock } from 'lucide-react';

// Zod schema for validation
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // path of error
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(changePasswordSchema),
    });

    const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
        toast.promise(
            changePassword(data).unwrap(),
            {
                loading: 'Updating password...',
                success: (response) => {
                    reset(); // Clear the form on success
                    return response.message || 'Password updated successfully!';
                },
                error: (err) => err.data?.message || 'Failed to update password. Please check your current password.',
            }
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
                <div>
                    <label htmlFor="currentPassword"
                           className="block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input
                            type="password"
                            id="currentPassword"
                            {...register('currentPassword')}
                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
                </div>

                <div>
                    <label htmlFor="newPassword"
                           className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input
                            type="password"
                            id="newPassword"
                            {...register('newPassword')}
                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                </div>

                <div>
                    <label htmlFor="confirmPassword"
                           className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            className="pl-10 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>

                <div className="text-right pt-4">
                    <button type="submit" disabled={isLoading}
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                        {isLoading ? 'Saving...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePassword;
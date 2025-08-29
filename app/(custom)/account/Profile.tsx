'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPhone, FaMapMarkerAlt, FaSearch, FaUser } from 'react-icons/fa';
import { LuSalad } from "react-icons/lu";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateUserProfileMutation, useGetUserProfileQuery } from '@/lib/store/services/authApi';
import { useLazyAutocompleteAddressQuery, useLazyGetAddressDetailsQuery } from '@/lib/store/services/addressApi';
import { useDebounce } from 'use-debounce';
import { Loader2 } from 'lucide-react';

// Define the validation schema using Zod
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  postCode: z.string().min(1, 'Postcode is required'),
  allergies: z.string().optional(),
  safePlaceDeliveryInstructions: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface AddressSuggestion {
  address: string;
  url: string;
  id: string;
}

// --- Address Autocomplete Component ---
const AddressAutocomplete = ({ onAddressSelected }: { onAddressSelected: (address: any) => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    
    const [triggerAutocomplete, { data: autocompleteData, isLoading: isAutocompleteLoading, isFetching }] = useLazyAutocompleteAddressQuery();
    const [triggerGetDetails, { isLoading: isDetailsLoading }] = useLazyGetAddressDetailsQuery();

    useEffect(() => {
        if (debouncedSearchTerm && debouncedSearchTerm.length > 2) {
            triggerAutocomplete(debouncedSearchTerm);
        } else {
            setSuggestions([]);
        }
    }, [debouncedSearchTerm, triggerAutocomplete]);

    useEffect(() => {
        if (autocompleteData) {
            setSuggestions(autocompleteData);
        }
    }, [autocompleteData]);

    const handleSelect = async (id: string) => {
        setSearchTerm('');
        setSuggestions([]);
        try {
            const details = await triggerGetDetails(id).unwrap();
            onAddressSelected(details);
        } catch (error) {
            toast.error("Could not fetch address details.");
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Start typing your address or postcode..."
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                />
                {(isAutocompleteLoading || isFetching || isDetailsLoading) && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>}
            </div>

            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            onClick={() => handleSelect(suggestion.id)}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        >
                            {suggestion.address}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// --- Main Profile Component ---
const Profile = () => {
    const { data: session } = useSession();
    const { data: profile, isLoading, isError } = useGetUserProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (profile) {
            reset({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phoneNumber: profile.phoneNumber || '',
                addressLine1: profile.addressLine1 || '',
                addressLine2: profile.addressLine2 || '',
                city: profile.city || '',
                postCode: profile.postCode || '',
                allergies: profile.allergies || '',
                safePlaceDeliveryInstructions: profile.safePlaceDeliveryInstructions || '',
                latitude: profile.latitude || '',
                longitude: profile.longitude || ''
            });
        }
    }, [profile, reset]);

    const handleAddressSelected = useCallback((address: any) => {
        setValue('addressLine1', address.line_1 || '', { shouldValidate: true });
        setValue('addressLine2', address.line_2 || '', { shouldValidate: true });
        setValue('city', address.town_or_city || '', { shouldValidate: true });
        setValue('postCode', address.postcode || '', { shouldValidate: true });
        setValue('latitude', address.latitude?.toString() || '');
        setValue('longitude', address.longitude?.toString() || '');
    }, [setValue]);

    const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        toast.promise(
            updateProfile(data).unwrap(),
            {
                loading: 'Updating profile...',
                success: 'Profile updated successfully!',
                error: 'Failed to update profile.',
            }
        );
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (isError || !profile) {
        return <p className="text-red-500">Could not load your profile details.</p>;
    }

    return (
        <div>
            <Toaster position="top-center" />
            <h2 className="text-2xl font-bold mb-6">My Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                        <input {...register('firstName')} id="firstName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input {...register('lastName')} id="lastName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" defaultValue={session?.user?.email || ''} disabled className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100" />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input {...register('phoneNumber')} id="phoneNumber" type="tel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
                </div>
                
                {/* Shipping Details */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-t pt-4">Shipping Address</h3>
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Find your address</label>
                        <AddressAutocomplete onAddressSelected={handleAddressSelected} />
                    </div>
                    <div>
                        <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input {...register('addressLine1')} id="addressLine1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                        {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                        <input {...register('addressLine2')} id="addressLine2" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                            <input {...register('city')} id="city" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="postCode" className="block text-sm font-medium text-gray-700">Postcode</label>
                            <input {...register('postCode')} id="postCode" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                            {errors.postCode && <p className="text-red-500 text-xs mt-1">{errors.postCode.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4">
                     <h3 className="text-lg font-semibold text-gray-800 border-t pt-4">Preferences</h3>
                    <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                        <textarea {...register('allergies')} id="allergies" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="safePlaceDeliveryInstructions" className="block text-sm font-medium text-gray-700">Delivery Instructions</label>
                        <textarea {...register('safePlaceDeliveryInstructions')} id="safePlaceDeliveryInstructions" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                </div>

                <div className="text-right pt-4">
                    <button type="submit" disabled={isUpdating} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors">
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
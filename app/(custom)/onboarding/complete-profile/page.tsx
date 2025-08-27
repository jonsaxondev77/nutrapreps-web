"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { FaPhone, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { LuSalad } from "react-icons/lu";
import { useCompleteProfileMutation } from '@/lib/store/services/authApi';
import { useLazyAutocompleteAddressQuery, useLazyGetAddressDetailsQuery } from '@/lib/store/services/addressApi';
import { useDebounce } from 'use-debounce';

interface AdditionalInfoRequest {
    addressLine1: string;
    addressLine2: string;
    city: string;
    postCode: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    allergies: string;
    safePlaceDeliveryInstructions: string;
}

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


// --- Main Component ---

const CompleteProfilePage: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    // RTK Query mutation hook
    const [completeProfile, { isLoading: isSubmitting, error: mutationError }] = useCompleteProfileMutation();

    // Form state
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [postCode, setPostCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [allergies, setAllergies] = useState('');
    const [safePlaceDeliveryInstructions, setSafePlaceDeliveryInstructions] = useState('');
    
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/signin?callbackUrl=/onboarding/complete-profile');
        }
    }, [session, status, router]);

    const handleAddressSelected = useCallback((address: any) => {
        setAddressLine1(address.line_1 || '');
        setAddressLine2(address.line_2 || '');
        setCity(address.town_or_city || '');
        setPostCode(address.postcode || '');
        setLatitude(address.latitude?.toString() || '');
        setLongitude(address.longitude?.toString() || '');
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.dismiss();

        const additionalInfo: AdditionalInfoRequest = {
            addressLine1, addressLine2, city, postCode, latitude, longitude, phoneNumber, allergies, safePlaceDeliveryInstructions
        };

        try {
            const data = await completeProfile(additionalInfo).unwrap();
            toast.success(data.message || 'Profile completed successfully!');
            router.push('/onboarding/awaiting-approval');
        } catch (err: any) {
            const errorMessage = err.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage);
        }
    };

    if (status === 'loading' || !session) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50">
                <p>Loading session...</p>
            </div>
        );
    }

    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
            <div className="max-w-3xl w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                        Complete Your Profile
                    </h2>
                    <p className="mt-2 text-base text-gray-600">
                        Please provide the additional information required to activate your account.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Find your address</label>
                    <AddressAutocomplete onAddressSelected={handleAddressSelected} />
                </div>

                <hr className="border-gray-200" />

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" value={latitude}/>
                    <input type="hidden" value={longitude}/>
                    
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input id="addressLine1" name="addressLine1" type="text" required placeholder="Address Line 1" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input id="addressLine2" name="addressLine2" type="text" placeholder="Address Line 2 (Optional)" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input id="city" name="city" type="text" required placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="relative">
                            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input id="postCode" name="postCode" type="text" required placeholder="Post Code" value={postCode} onChange={(e) => setPostCode(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input id="phoneNumber" name="phoneNumber" type="tel" required placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="relative">
                        <LuSalad className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                        <textarea id="allergies" name="allergies" rows={3} placeholder="Any allergies?" value={allergies} onChange={(e) => setAllergies(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                        <textarea id="safePlaceDeliveryInstructions" name="safePlaceDeliveryInstructions" rows={3} placeholder="Safe place for deliveries" value={safePlaceDeliveryInstructions} onChange={(e) => setSafePlaceDeliveryInstructions(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" />
                    </div>

                    {mutationError && 'data' in mutationError && (
                        <p className="text-red-500 text-sm text-center">{(mutationError.data as any)?.message || 'An error occurred'}</p>
                    )}

                    <div>
                        <button type="submit" disabled={isSubmitting} className={`w-full flex justify-center py-3 px-5 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200 mt-6 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isSubmitting ? 'Submitting...' : 'Complete Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;

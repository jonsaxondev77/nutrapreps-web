'use client';

import { useEffect, useState } from "react";
import { PlanAndDelivery } from "./Plan-Delivery";
import { MealSelection } from "./MealSelection";
import { ItemSelection } from "./ItemSelection";
import { ReviewAndConfirm } from "./ReviewAndConfirm";
import { useAppDispatch } from "@/lib/store/hooks";
import { resetOrder } from "@/lib/store/orderSlice";
import { useGetOrderingStatusQuery } from "@/lib/store/services/settingsApi";
import { useGetUserProfileQuery } from '@/lib/store/services/authApi';
import { Loader2, AlertTriangle, Mail, UserCheck } from 'lucide-react';
import OrderingCountdown from "./OrderingCountdown";
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import Image from 'next/image';

let appInsights: ApplicationInsights | null = null;

const initializeAppInsights = async () => {
    if (!appInsights) {
        try {
            const res = await fetch('/api/telemetry-config');
            const data = await res.json();
            const connectionString = data.connectionString;

            if (connectionString) {
                appInsights = new ApplicationInsights({
                    config: {
                        connectionString: connectionString,
                        enableAutoRouteTracking: true,
                    }
                });
                appInsights.loadAppInsights();
            }
        } catch (error) {
            console.error("Failed to fetch Application Insights config:", error);
        }
    }
};

export default function OrderPage() {
    const [step, setStep] = useState(1);
    const dispatch = useAppDispatch();

    const { data: statusData, isLoading: isLoadingStatus, isError: isStatusError } = useGetOrderingStatusQuery();
    const { data: userProfile, isLoading: isLoadingProfile, isError: isProfileError, error: profileError } = useGetUserProfileQuery();

    const isRestrictedUser = userProfile?.routeId === 10 || userProfile?.routeId === 12 || userProfile?.routeId === 13;

    useEffect(() => {
        initializeAppInsights();
    }, []);

    useEffect(() => {
        if (!isLoadingProfile && isRestrictedUser) {
            if (appInsights) {
                appInsights.trackEvent({
                    name: 'RestrictedUserAccess',
                    properties: {
                        name: `${userProfile?.firstName} ${userProfile?.lastName}`,
                        routeId: userProfile?.routeId,
                        email: userProfile?.email,
                        page: '/order'
                    }
                });
            } else {
                console.warn("Application Insights not yet initialized. Skipping event tracking.");
            }
        }
    }, [isRestrictedUser, isLoadingProfile, userProfile]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const restart = () => {
        dispatch(resetOrder());
        setStep(1);
    };

    if (isLoadingStatus || isLoadingProfile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg">Loading...</p>
            </div>
        );
    }
    
    if (isProfileError) {
        if (appInsights) {
            appInsights.trackException({ error: new Error('Failed to load user profile for ordering'), properties: { errorMessage: JSON.stringify(profileError) } });
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Error Loading Profile</h1>
                    <p className="text-gray-600 mt-2 mb-6">
                        We couldn't load your profile details. Please try refreshing the page or contact support if the problem persists.
                    </p>
                </div>
            </div>
        );
    }
    
    // Main access control logic starts here.
    if (userProfile && userProfile.accountStatus !== 'Active') {
        const status = userProfile.accountStatus;
        let title = '';
        let message = '';
        let icon = <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />;

        switch (status) {
            case 'Registered':
                title = 'Please confirm your email';
                message = 'You have successfully registered. Please check your inbox and remember to check your spam folder to confirm your email and activate your account.';
                icon = <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />;
                break;
            case 'EmailVerified':
                title = 'Complete Your Profile';
                message = 'Thank you for verifying your email. To activate your account and start ordering, please complete your profile.';
                icon = <UserCheck className="w-16 h-16 text-purple-500 mx-auto mb-4" />;
                break;
            case 'InfoCompleted':
                title = 'Account Awaiting Approval';
                message = 'Thank you for completing your profile. To activate your account, you must contact us on WhatsApp to discuss any allergens you may have.';
                icon = <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />;
                break;
            default:
                title = 'Account Not Activated';
                message = 'Your account is currently under review and cannot place orders. Please contact support for more information.';
                break;
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
                    {icon}
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600 mt-2 mb-6">
                        {message}
                    </p>
                    {status === 'EmailVerified' && (
                        <Link href="/onboarding/complete-profile" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                            Complete Profile
                        </Link>
                    )}
                    {status === 'InfoCompleted' && (
                        <div className="flex flex-col items-center justify-center space-y-4 mt-4">
                            <p className="text-sm text-gray-700 mb-2 font-semibold">
                                Please message us on WhatsApp so we can discuss any allergens before we can activate your account.
                            </p>
                            <div className="hidden md:block">
                                <Image
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://wa.me/+447469878640"
                                    alt="WhatsApp QR Code"
                                    width={160}
                                    height={160}
                                />
                            </div>
                            <Link
                                href="https://wa.me/+447469878640"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                            >
                                <FaWhatsapp size={24} /> Message us on WhatsApp
                            </Link>
                        </div>
                        
                    )}
                </div>
            </div>
        );
    }
    
    // Fallback: If accountStatus is 'Active', check for specific route restrictions.
    if (userProfile?.routeId === 10 || userProfile?.routeId === 12 || userProfile?.routeId === 13) {
        let title = 'Access Denied';
        let message = 'You cannot place an order at this time. Please contact support for more information.';
        let icon = <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />;
        
        if (userProfile.routeId === 12) {
            title = 'Out of Delivery Area';
            message = 'Your address is not within our delivery area at this time. Please check back as we constantly review our delivery areas.';
        }

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
                    {icon}
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-600 mt-2 mb-6">
                        {message}
                    </p>
                </div>
            </div>
        );
    }

    if (isStatusError || !statusData || !statusData.isOrderingEnabled && (userProfile.email !== 'jonsaxon@outlook.com')) {
        return <OrderingCountdown />;
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PlanAndDelivery onNext={nextStep} />;
            case 2:
                return <MealSelection onNext={nextStep} onBack={prevStep} />;
            case 3:
                return (
                    <ItemSelection
                        title="3. Add any Add-ons"
                        itemType="addon"
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <ItemSelection
                        title="4. Add any Desserts"
                        itemType="dessert"
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 5:
                return <ReviewAndConfirm onEdit={prevStep} onRestart={restart} />;
            default:
                return <PlanAndDelivery onNext={nextStep} />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {renderStep()}
        </div>
    );
}
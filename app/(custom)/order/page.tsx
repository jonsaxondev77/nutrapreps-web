// app/(custom)/order/page.tsx
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
import { Loader2, AlertTriangle } from 'lucide-react';
import OrderingCountdown from "./OrderingCountdown";

export default function OrderPage() {
    const [step, setStep] = useState(1);
    const dispatch = useAppDispatch();
    
    // Fetch ordering status and user profile
    const { data: statusData, isLoading: isLoadingStatus, isError: isStatusError } = useGetOrderingStatusQuery();
    const { data: userProfile, isLoading: isLoadingProfile, isError: isProfileError } = useGetUserProfileQuery();
    
    // Check if the user is restricted from ordering
    const isRestrictedUser = userProfile?.routeId === 10 || userProfile?.routeId === 12;

    useEffect(() => {
        dispatch(resetOrder());
    }, [dispatch]);

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
    
    // Display a message for restricted users
    if (isRestrictedUser) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-xl w-full">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Account Not Activated</h1>
            <p className="text-gray-600 mt-2 mb-6">
              Your account is currently under review and cannot place orders. Please contact support for more information.
            </p>
          </div>
        </div>
      );
    }
    
    if (isStatusError || isProfileError || !statusData || !statusData.isOrderingEnabled) {
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
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
import { Loader2 } from 'lucide-react';
import OrderingCountdown from "./OrderingCountdown"; // Add this line

export default function OrderPage() {
    const [step, setStep] = useState(1);
    const dispatch = useAppDispatch();
    
    const { data: statusData, isLoading: isLoadingStatus, isError: isStatusError } = useGetOrderingStatusQuery();

    useEffect(() => {
        dispatch(resetOrder());
    }, [dispatch]);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    
    const restart = () => {
        dispatch(resetOrder());
        setStep(1);
    };
    
    if (isLoadingStatus) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    // Now, instead of a simple message, render the new countdown component
    if (isStatusError || !statusData || !statusData.isOrderingEnabled) {
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
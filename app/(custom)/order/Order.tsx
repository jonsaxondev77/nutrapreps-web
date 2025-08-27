'use client';

import { useOrder } from "@/context/OrderContext";
import { useEffect, useState } from "react";
import { PlanAndDelivery } from "./PlanAndDelivery";
import { MealSelection } from "../(custom)/order/MealSelection";
import { ItemSelection } from "../(custom)/order/ItemSelection";
import { ReviewAndConfirm } from "./ReviewAndConfirm";
import { useCart } from "@/context/CartContext";

export default function Order() {
    const [step, setStep] = useState(1);
    const { setOrder, resetOrder } = useOrder();
    const { clearLastCompletedOrder } = useCart();

    /*
    useEffect(() => {
        clearLastCompletedOrder();
        resetOrder();
    }, [clearLastCompletedOrder, resetOrder]); // FIX: Added missing dependencies
    */

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const restart = () => {
        setStep(1);
    };

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

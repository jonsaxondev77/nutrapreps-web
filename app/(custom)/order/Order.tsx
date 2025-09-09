'use client';

import { useEffect, useState } from "react";

import { ReviewAndConfirm } from "./ReviewAndConfirm";
import { PlanAndDelivery } from "./Plan-Delivery";
import { MealSelection } from "./MealSelection";
import { ItemSelection } from "./ItemSelection";

export default function Order() {
    const [step, setStep] = useState(1);


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

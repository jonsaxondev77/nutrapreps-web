'use client';

import { useState } from 'react';
import { MealOption } from '@/types/ordering';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectMeal } from '@/lib/store/orderSlice';
import { useGetMealsQuery } from '@/lib/store/services/orderingApi';
import { X, ChefHat, CheckCircle2, PlusCircle } from 'lucide-react';

// --- Reusable Meal Card for the Modal (Text-Only Version) ---
const MealCard = ({ option, onSelect }: { option: MealOption, onSelect: () => void }) => (
    <div className="border bg-gray-50 rounded-lg overflow-hidden flex flex-col p-4 h-full group hover:shadow-lg hover:border-green-500 transition-all duration-200 cursor-pointer" onClick={onSelect}>
        <div className="flex items-start gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
                <ChefHat className="w-6 h-6 text-green-600 flex-shrink-0" />
            </div>
            <h4 className="font-bold text-lg text-gray-800 flex-grow pt-1">{option.meal.name}</h4>
        </div>
        <button
            className="mt-auto w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 group-hover:bg-green-700"
        >
            Select
        </button>
    </div>
);

// --- Meal Selection Modal ---
const MealSelectionModal = ({
    isOpen,
    onClose,
    mealOptions,
    onSelectMeal,
}: {
    isOpen: boolean;
    onClose: () => void;
    mealOptions: MealOption[];
    onSelectMeal: (option: MealOption) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Choose a Meal</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mealOptions.map(option => (
                            <MealCard key={option.id} option={option} onSelect={() => onSelectMeal(option)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main MealSelection Component ---
interface Props {
    onNext: () => void;
    onBack: () => void;
}

export const MealSelection = ({ onNext, onBack }: Props) => {
    const dispatch = useAppDispatch();
    const { plan, deliveryDays, meals } = useAppSelector((state) => state.order);
    const { data: mealOptionsList = [], error, isLoading } = useGetMealsQuery();

    const [isModalOpen, setModalOpen] = useState(false);
    const [activeSlot, setActiveSlot] = useState<{ day: 'sunday' | 'wednesday'; index: number } | null>(null);

    if (!plan || !deliveryDays) {
        return <p className="text-center p-8">Please select a plan and delivery day first.</p>;
    }

    const handleOpenModal = (day: 'sunday' | 'wednesday', index: number) => {
        setActiveSlot({ day, index });
        setModalOpen(true);
    };

    const handleSelectMeal = (option: MealOption) => {
        if (activeSlot) {
            dispatch(selectMeal({ ...activeSlot, option }));
        }
        setModalOpen(false);
        setActiveSlot(null);
    };

    const totalMeals = plan.mealsPerWeek;
    const isSplitDelivery = deliveryDays === 'Both';
    const mealsPerDay = isSplitDelivery ? totalMeals / 2 : totalMeals;

    const sundayMealsCount = deliveryDays === 'Sunday' ? totalMeals : (isSplitDelivery ? mealsPerDay : 0);
    const wednesdayMealsCount = deliveryDays === 'Wednesday' ? totalMeals : (isSplitDelivery ? mealsPerDay : 0);

    const allMealsSelected = meals.sunday.length === sundayMealsCount && meals.wednesday.length === wednesdayMealsCount &&
                             [...meals.sunday, ...meals.wednesday].every(m => m !== null);

    const renderMealSelectors = (day: 'sunday' | 'wednesday', count: number) => (
        <div key={day}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{day} Delivery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => {
                    const selectedMeal = meals[day][i];
                    const isSelected = !!selectedMeal;
                    return (
                        <div key={i} className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center text-center h-48 transition-all duration-200 ${isSelected ? 'border-green-500 bg-green-50' : 'bg-gray-50 border-dashed'}`}>
                            {selectedMeal ? (
                                <>
                                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                    <p className="font-semibold flex-grow text-gray-800">{selectedMeal.meal.name}</p>
                                    <button onClick={() => handleOpenModal(day, i)} className="mt-4 text-sm text-green-600 font-semibold hover:underline">
                                        Change Meal
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-4 font-medium">Meal {i + 1}</p>
                                    <button onClick={() => handleOpenModal(day, i)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg hover:bg-green-200 transition-colors">
                                        <PlusCircle size={20} />
                                        Select Meal
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            <MealSelectionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                mealOptions={mealOptionsList}
                onSelectMeal={handleSelectMeal}
            />
            {/* --- Progress Bar --- */}
            <div className="mb-8">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">Step 2 of 5: Select Meals</p>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Choose Your Delicious Meals</h1>
                    <p className="text-gray-500 mt-2">Select from our weekly rotating menu of fresh, healthy options.</p>
                </div>
                
                {isLoading && <div className="text-center p-8">Loading meals...</div>}
                {error && <div className="text-center p-8 text-red-500">Could not load meals. Please try again later.</div>}

                <div className="space-y-8">
                    {sundayMealsCount > 0 && renderMealSelectors('sunday', sundayMealsCount)}
                    {wednesdayMealsCount > 0 && renderMealSelectors('wednesday', wednesdayMealsCount)}
                </div>

                <div className="mt-12 pt-6 border-t flex items-center justify-between">
                    <button onClick={onBack} className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                        ← Back
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!allMealsSelected}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                    >
                        Next: Add-Ons →
                    </button>
                </div>
            </div>
        </div>
    );
};

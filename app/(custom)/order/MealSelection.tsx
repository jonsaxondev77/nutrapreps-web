'use client';

import { useState } from 'react';
import { MealOption } from '@/types/ordering';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectMeal } from '@/lib/store/orderSlice';
import { useGetMealsQuery } from '@/lib/store/services/orderingApi';
import { X, ChefHat, CheckCircle2, PlusCircle, Flame, Drumstick, Wheat, Beef, Tag } from 'lucide-react';
import { Modal } from '@/app/components/design/Modal';

const toProperCase = (str: string) => {
    const exceptions = ['and', 'in', 'of', 'a', 'with'];
    return str.replace(/\w\S*/g, (txt, i) => {
        if (i > 0 && exceptions.includes(txt.toLowerCase())) {
            return txt.toLowerCase();
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

// --- Reusable Macro Display Component ---
const MacroBadge = ({ label, value, color, icon: Icon }: { label: string, value: string, color: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-2 text-sm">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

// --- Meal Description Modal ---
const MealDescriptionModal = ({ meal, onClose }: { meal: any, onClose: () => void }) => {
    if (!meal) return null;

    return (
        <Modal onClose={onClose}>
            <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-4">{toProperCase(meal.name)}</h3>
                <div className="overflow-y-auto">
                    <p>{toProperCase(meal.description)}</p>
                </div>
            </div>
        </Modal>
    );
};


// --- Reusable Meal Card for the Modal (Now a Button) ---
const MealCard = ({ option, onSelect, onReadMore }: { option: MealOption, onSelect: () => void, onReadMore: () => void }) => (
    <div
        className="border rounded-lg overflow-hidden flex flex-col p-4 h-full group hover:shadow-lg hover:border-green-500 transition-all duration-200 text-left relative"
    >
        {parseFloat(option.meal.supplement) > 0 && (
            <div className="absolute top-0 right-0 bg-orange-500 text-white text-sm font-bold p-2 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
                <Tag size={16}/>
                +£{parseFloat(option.meal.supplement).toFixed(2)}
            </div>
        )}
        <div className="flex items-start gap-3 mb-4 mt-6">
            <div className="bg-green-100 p-2 rounded-full">
                <ChefHat className="w-6 h-6 text-green-600 flex-shrink-0" />
            </div>
            <h4 className="font-bold text-md text-gray-800 flex-grow pt-1">{option.meal.name}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
            {option.meal.description.length > 80
                ? (
                    <>
                        {`${toProperCase(option.meal.description).substring(0, 80)}...`}
                        <button onClick={onReadMore} className="text-blue-500 hover:underline ml-1">Read More</button>
                    </>
                )
                : toProperCase(option.meal.description)}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
            <MacroBadge label="Calories" value={option.meal.calories || 'N/A'} color="text-red-500" icon={Flame} />
            <MacroBadge label="Protein" value={`${option.meal.protein || 'N/A'}`} color="text-green-500" icon={Drumstick} />
            <MacroBadge label="Carbs" value={`${option.meal.carbs || 'N/A'}`} color="text-yellow-500" icon={Wheat} />
            <MacroBadge label="Fat" value={`${option.meal.fat || 'N/A'}`} color="text-blue-500" icon={Beef} />
        </div>
        {option.meal.allergies && (
            <div className="mb-4">
                <p className="text-xs text-gray-500"><span className="font-semibold">Allergens:</span> {option.meal.allergies}</p>
            </div>
        )}
        <div className="mt-auto w-full">
            <button onClick={onSelect} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-semibold group-hover:bg-green-700 transition duration-300 text-center">
                Select
            </button>
        </div>
    </div>
);

// --- Meal Selection Modal ---
const MealSelectionModal = ({
    isOpen,
    onClose,
    mealOptions,
    onSelectMeal,
    onOpenDescription,
}: {
    isOpen: boolean;
    onClose: () => void;
    mealOptions: MealOption[];
    onSelectMeal: (option: MealOption) => void;
    onOpenDescription: (meal: any) => void;
}) => {
    if (!isOpen) return null;

    return (
        <Modal onClose={onClose}>
            <div className="flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Choose a Meal</h3>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mealOptions.map(option => (
                            <MealCard key={option.id} option={option} onSelect={() => onSelectMeal(option)} onReadMore={() => onOpenDescription(option.meal)} />
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
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
    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedMealForDescription, setSelectedMealForDescription] = useState(null);
    const [activeSlot, setActiveSlot] = useState<{ day: 'sunday' | 'wednesday'; index: number } | null>(null);

    if (!plan || !deliveryDays) {
        return <p className="text-center p-8">Please select a plan and delivery day first.</p>;
    }

    const handleOpenMealModal = (day: 'sunday' | 'wednesday', index: number) => {
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

    const handleOpenDescriptionModal = (meal: any) => {
        setSelectedMealForDescription(meal);
        setDescriptionModalOpen(true);
    };

    const handleCloseDescriptionModal = () => {
        setSelectedMealForDescription(null);
        setDescriptionModalOpen(false);
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
                        <div key={i} className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center text-center h-48 transition-all duration-200 cursor-pointer ${isSelected ? 'border-green-500 bg-green-50' : 'border-dashed hover:border-green-400'}`}>
                            {selectedMeal ? (
                                <>
                                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                    <p className="font-semibold flex-grow text-gray-800">{selectedMeal.meal.name}</p>
                                    <span className="mt-4 text-sm text-green-600 font-semibold">
                                        <button onClick={() => handleOpenMealModal(day, i)}>Change Meal</button>
                                    </span>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 mb-4 font-medium">Meal {i + 1}</p>
                                    <button onClick={() => handleOpenMealModal(day, i)} className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 font-bold rounded-lg group-hover:bg-green-200 transition-colors">
                                        <PlusCircle size={20} />
                                        Select Meal
                                    </button>
                                </>
                            )}
                            {selectedMeal && (
                                <button onClick={() => handleOpenDescriptionModal(selectedMeal.meal)} className="mt-2 text-sm text-blue-500 hover:underline">
                                    Read Description
                                </button>
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
                onOpenDescription={handleOpenDescriptionModal}
            />
            {isDescriptionModalOpen && (
                <MealDescriptionModal meal={selectedMealForDescription} onClose={handleCloseDescriptionModal} />
            )}
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
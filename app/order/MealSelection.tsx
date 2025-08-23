'use client';

import { useOrder } from '@/context/OrderContext';
import { getMealsApi } from '@/api/orders';
import { useEffect, useState } from 'react';
import { MealOption } from '@/types';
import { useSession } from 'next-auth/react';
import { appSettingConfig } from '@/lib/config';

const removeSpecialChars = (str: string): string => {
  if (!str) return '';
  // This regular expression finds any character that is NOT a letter (a-z, A-Z),
  // a number (0-9), or a space, and replaces it with an empty string.
  return str.replace(/[^a-zA-Z0-9 ]/g, '');
};

const toProperCase = (str: string) => {
    if (!str) return '';
    return str.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

// The props are now correctly typed to use MealOption
const MealDropdown = ({ day, index, selectedOption, onSelect, optionsList }: { day: 'sunday' | 'wednesday', index: number, selectedOption: MealOption | null, onSelect: (day: 'sunday' | 'wednesday', index: number, option: MealOption) => void, optionsList: MealOption[] }) => (
    <select
        // Value is the selected option's ID
        value={selectedOption?.id || ''}
        onChange={(e) => {
            const option = optionsList.find(o => o.id === parseInt(e.target.value));
            if (option) onSelect(day, index, option);
        }}
        className="w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <option value="" disabled>Select a meal...</option>
        {/* Map over options and access the nested meal name */}
        {optionsList.map(option => (
            <option key={option.id} value={option.id}>{toProperCase(removeSpecialChars(option.meal.name))}</option>
        ))}
    </select>
);

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const MealSelection = ({ onNext, onBack }: Props) => {
    const { order, setOrder } = useOrder();
    const { data: session, status } = useSession();
    
    // State now correctly holds a list of MealOption
    const [mealOptionsList, setMealOptionsList] = useState<MealOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMeals = async () => {
            // Ensure session and token exist before fetching
            if (session?.user?.jwtToken) {
                try {
                    const jwtToken = session.user.jwtToken;
                    const apiBaseUrl = appSettingConfig.nutraPrepsApi;
                    const fetchedOptions = await getMealsApi(jwtToken, apiBaseUrl);
                    setMealOptionsList(fetchedOptions);
                } catch (err) {
                    console.error(err);
                    setError('Failed to load meals. Please check your connection and try again.');
                } finally {
                    setIsLoading(false);
                }
            } else if (status !== 'loading') {
                // If session is loaded but there's no token
                setError('You must be logged in to select meals.');
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, [session, status]); // FIX: Added session and status to dependency array

    // FIX: Moved this useEffect hook before the early return to respect the Rules of Hooks.
    useEffect(() => {
        // This effect should only run if the plan and deliveryDays are already set.
        if (!order.plan || !order.deliveryDays) return;

        setOrder(prev => {
            // Redundant check, but good for safety
            if (!prev.plan || !prev.deliveryDays) return prev;
            
            const isSplitDelivery = prev.deliveryDays === 'Both';
            const totalMeals = prev.plan.mealsPerWeek;
            const mealsPerDay = isSplitDelivery ? totalMeals / 2 : totalMeals;
            const newMeals = { ...prev.meals };
            const sundayMealsNeeded = isSplitDelivery || prev.deliveryDays === 'Sunday' ? mealsPerDay : 0;
            const wednesdayMealsNeeded = isSplitDelivery || prev.deliveryDays === 'Wednesday' ? mealsPerDay : 0;

            // Only update if the length is different to avoid re-renders
            if (newMeals.sunday.length !== sundayMealsNeeded) {
                newMeals.sunday = Array(sundayMealsNeeded).fill(null);
            }
            if (newMeals.wednesday.length !== wednesdayMealsNeeded) {
                newMeals.wednesday = Array(wednesdayMealsNeeded).fill(null);
            }
            
            return { ...prev, meals: newMeals };
        });
    }, [order.plan, order.deliveryDays, setOrder]); // Dependencies are now more specific

    if (!order.plan || !order.deliveryDays) {
        return <p>Please select a plan and delivery day first.</p>;
    }

    // The handler now correctly accepts a MealOption
    const handleMealSelect = (day: 'sunday' | 'wednesday', index: number, option: MealOption) => {
        setOrder(prev => {
            const newMealsForDay = [...prev.meals[day]];
            newMealsForDay[index] = option; // Store the entire MealOption object
            return { ...prev, meals: { ...prev.meals, [day]: newMealsForDay } };
        });
    };

    const sundayMealsComplete = order.meals.sunday.every(m => m !== null);
    const wednesdayMealsComplete = order.meals.wednesday.every(m => m !== null);
    const allMealsSelected = sundayMealsComplete && wednesdayMealsComplete;

    const renderMealSelectors = (day: 'sunday' | 'wednesday', count: number) => (
        <div key={day}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">{day} Meals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-1">
                        <label className="font-medium text-gray-600">Meal {i + 1}</label>
                        <MealDropdown 
                          day={day} 
                          index={i} 
                          selectedOption={order.meals[day][i]} 
                          onSelect={handleMealSelect} 
                          optionsList={mealOptionsList}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
    
    if (isLoading) return <div className="p-8 text-center">Loading meals...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

    const totalMeals = order.plan.mealsPerWeek;
    const isSplitDelivery = order.deliveryDays === 'Both';
    const mealsPerDay = isSplitDelivery ? totalMeals / 2 : totalMeals;

    return (
        <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-7xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">2. Select Your Meals</h2>
            <div className="space-y-8">
                {order.deliveryDays === 'Sunday' && renderMealSelectors('sunday', totalMeals)}
                {order.deliveryDays === 'Wednesday' && renderMealSelectors('wednesday', totalMeals)}
                {isSplitDelivery && (
                    <>
                        {renderMealSelectors('sunday', mealsPerDay)}
                        {renderMealSelectors('wednesday', mealsPerDay)}
                    </>
                )}
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                    ← Back
                </button>
                <button onClick={onNext} disabled={!allMealsSelected} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors">
                    Next: Add-Ons →
                </button>
            </div>
        </div>
    );
};

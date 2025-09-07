// app/(custom)/menu/page.tsx
'use client';

import { useGetMealsQuery, useGetAddonsQuery, useGetExtrasQuery } from '@/lib/store/services/orderingApi';
import { Flame, Drumstick, Wheat, Beef, ChefHat, Cookie, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useGetOrderingStatusQuery } from '@/lib/store/services/settingsApi'; // Add this line


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
    <div className="flex items-center gap-2 text-sm text-gray-600">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

// --- Meal Description Modal ---
const MealDescriptionModal = ({ meal, onClose }: { meal: any, onClose: () => void }) => {
    if (!meal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">{toProperCase(meal.name)}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <p>{toProperCase(meal.description)}</p>
                </div>
            </div>
        </div>
    );
};


// --- Reusable Meal Card ---
const MealCard = ({ option, onSelect }: { option: any, onSelect: (meal: any) => void }) => (
    <div
        className="border rounded-lg overflow-hidden flex flex-col p-4 h-full group hover:shadow-lg hover:border-green-500 transition-all duration-200"
    >
        
        <div className="flex items-start gap-3 mb-4">
            <div className="bg-green-100 p-2 rounded-full">
                <ChefHat className="w-6 h-6 text-green-600 flex-shrink-0" />
            </div>
            <h4 className="font-bold text-lg text-gray-800 flex-grow pt-1">{toProperCase(option.meal.name)}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4 pl-12">
            {option.meal.description.length > 80
                ? (
                    <>
                        {`${toProperCase(option.meal.description).substring(0, 80)}...`}
                        <button onClick={() => onSelect(option.meal)} className="text-blue-500 hover:underline ml-1">Read More</button>
                    </>
                )
                : option.meal.description}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4 pl-12">
            <MacroBadge label="Calories" value={option.meal.calories || 'N/A'} color="text-red-500" icon={Flame} />
            <MacroBadge label="Protein" value={`${option.meal.protein || 'N/A'}g`} color="text-green-500" icon={Drumstick} />
            <MacroBadge label="Carbs" value={`${option.meal.carbs || 'N/A'}g`} color="text-yellow-500" icon={Wheat} />
            <MacroBadge label="Fat" value={`${option.meal.fat || 'N/A'}g`} color="text-blue-500" icon={Beef} />
        </div>
        {option.meal.allergies && (
            <div className="mb-4 pl-12">
                <p className="text-xs text-gray-500"><span className="font-semibold">Allergens:</span> {toProperCase(option.meal.allergies)}</p>
            </div>
        )}
    </div>
);

const DessertCard = ({ dessert }: { dessert: any }) => (
    <div
        className="border rounded-lg overflow-hidden flex flex-col p-4 h-full group hover:shadow-lg hover:border-green-500 transition-all duration-200"
    >
        
        <div className="flex items-start gap-3 mb-4">
            <div className="bg-orange-100 p-2 rounded-full">
                <Cookie className="w-6 h-6 text-orange-600 flex-shrink-0" />
            </div>
            <h4 className="font-bold text-md text-gray-800 flex-grow pt-1">{dessert.name}</h4>
        </div>
        <p className="font-bold text-lg text-green-600 mb-2 pl-12">£{parseFloat(dessert.price).toFixed(2)}</p>
        {dessert.allergens && (
            <div className="mb-4 pl-12">
                <p className="text-xs text-gray-500"><span className="font-semibold">Allergens:</span> {dessert.allergens}</p>
            </div>
        )}
    </div>
);


export default function MenuPage() {
    const [activeTab, setActiveTab] = useState('meals');
    const [selectedMeal, setSelectedMeal] = useState(null);
    const { data: mealOptionsList = [], error: mealsError, isLoading: mealsLoading } = useGetMealsQuery();
    const { data: addonOptionsList = [], error: addonsError, isLoading: addonsLoading } = useGetAddonsQuery();
    const { data: dessertsList = [], error: dessertsError, isLoading: dessertsLoading } = useGetExtrasQuery();
    
    // Get ordering status
    const { data: statusData, isLoading: isLoadingStatus } = useGetOrderingStatusQuery();
    const isOrderingEnabled = statusData?.isOrderingEnabled ?? false;

    const isLoading = mealsLoading || addonsLoading || dessertsLoading || isLoadingStatus;
    const error = mealsError || addonsError || dessertsError;

    const openModal = (meal: any) => {
        setSelectedMeal(meal);
    };

    const closeModal = () => {
        setSelectedMeal(null);
    };

    return (
        <div className="bg-gray-50">
            {selectedMeal && <MealDescriptionModal meal={selectedMeal} onClose={closeModal} />}
            <div className="relative h-100">
                <Image
                    src="/images/menu-4.png"
                    alt="A vibrant salad with fresh ingredients"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="z-0"
                    style={{ objectPosition: '80% 20%'}}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <h1 className="text-5xl font-bold text-white">This Week's Menu</h1>
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600">
                        Discover our delicious and healthy meals, expertly crafted to help you achieve your wellness goals.
                    </p>
                </div>

                <div className="flex justify-center border-b mb-8">
                    <button
                        className={`px-6 py-3 text-lg font-semibold ${activeTab === 'meals' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('meals')}
                    >
                        Meals
                    </button>
                    <button
                        className={`px-6 py-3 text-lg font-semibold ${activeTab === 'addons' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('addons')}
                    >
                        Add-ons
                    </button>
                    <button
                        className={`px-6 py-3 text-lg font-semibold ${activeTab === 'desserts' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('desserts')}
                    >
                        Desserts
                    </button>
                </div>


                {isLoading && (
                    <div className="text-center">
                        <p className="text-lg text-gray-500">Loading menu...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500">
                        <p>There was an error loading the menu. Please try again later.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div>
                        {activeTab === 'meals' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {mealOptionsList.map((option: any) => (
                                    <MealCard key={option.id} option={option} onSelect={openModal} />
                                ))}
                            </div>
                        )}
                        {activeTab === 'addons' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {addonOptionsList.map((option: any) => (
                                    <MealCard key={option.id} option={option} onSelect={openModal} />
                                ))}
                            </div>
                        )}
                        {activeTab === 'desserts' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {dessertsList.map((dessert: any) => (
                                    <DessertCard key={dessert.id} dessert={dessert} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="text-center mt-12">
                    <Link
                        href={isOrderingEnabled ? "/order" : "#"}
                        className={`bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition duration-300 text-lg font-semibold ${!isOrderingEnabled ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400' : ''}`}
                        onClick={(e) => {
                            if (!isOrderingEnabled) {
                                e.preventDefault();
                                alert("Ordering is currently disabled."); // Or a more elegant solution like a toast
                            }
                        }}
                    >
                        Order Now
                    </Link>
                </div>
            </div>
        </div>
    )
}
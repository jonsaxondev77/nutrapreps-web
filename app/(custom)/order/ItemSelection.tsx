'use client';

import { useState } from 'react';
import { OrderItem } from '@/types/ordering';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { updateAddonQuantity, updateDessertQuantity } from '@/lib/store/orderSlice';
import { Plus, Minus, Cookie, Salad, Info, Flame, Drumstick, Wheat, Beef, Tag } from 'lucide-react';
import { useGetAddonsQuery, useGetExtrasQuery } from '@/lib/store/services/orderingApi';

// --- Reusable Quantity Selector (New Design) ---
interface QuantitySelectorProps {
    quantity: number;
    onDecrement: () => void;
    onIncrement: () => void;
}

const QuantitySelector = ({ quantity, onDecrement, onIncrement }: QuantitySelectorProps) => (
    <div className="flex items-center border border-gray-300 rounded-md">
        <button
            onClick={onDecrement}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors duration-200"
            aria-label="Decrement quantity"
        >
            <Minus size={16} />
        </button>
        <span className="w-12 text-center text-lg font-semibold text-gray-500 border-l border-r">{quantity}</span>
        <button
            onClick={onIncrement}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors duration-200"
            aria-label="Increment quantity"
        >
            <Plus size={16} />
        </button>
    </div>
);

const MacroBadge = ({ label, value, color, icon: Icon }: { label: string, value: string, color: string, icon: React.ElementType }) => (
    <div className="flex items-center gap-2 text-sm">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="font-semibold">{label}:</span>
        <span>{value}</span>
    </div>
);

// --- New: Spice Rating Component ---
const SpiceRating = ({ rating }: { rating: number }) => {
    // If rating is 0, display a "Mild" badge.
    if (!rating || rating === 0) {
        return (
            <div className="flex items-center space-x-1">
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">Mild</span>
            </div>
        );
    }
    
    // Otherwise, display chili icons for ratings 1-5.
    return (
        <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-orange-500' : 'text-gray-300'} fill-current`}
                />
            ))}
        </div>
    );
};


// --- Main ItemSelection Component ---
interface ItemSelectionProps {
    title: string;
    itemType: 'addon' | 'dessert';
    onNext: () => void;
    onBack: () => void;
}

export const ItemSelection = ({ title, itemType, onNext, onBack }: ItemSelectionProps) => {
    const dispatch = useAppDispatch();
    const order = useAppSelector((state) => state.order);

    const { data: addonsData, error: addonsError, isLoading: addonsLoading } = useGetAddonsQuery(undefined, { skip: itemType !== 'addon' });
    const { data: extrasData, error: extrasError, isLoading: extrasLoading } = useGetExtrasQuery(undefined, { skip: itemType !== 'dessert' });

    const isLoading = addonsLoading || extrasLoading;
    const error = extrasError || addonsError;

    const items: any[] = (itemType === 'addon'
        ? addonsData?.map(a => ({
            id: a.id,
            name: a.meal.name,
            price: parseFloat(a.meal.supplement),
            calories: a.meal.calories,
            protein: a.meal.protein,
            fat: a.meal.fat,
            carbs: a.meal.carbs,
            allergens: a.meal.allergies,
            spiceRating: a.meal.spiceRating,
           }))
        : extrasData?.map(e => ({ id: e.id, name: e.name, price: parseFloat(e.price), allergens: e.allergens }))
    ) || [];

    const renderAddonSelector = () => {
        const showSunday = order.deliveryDays === 'Sunday' || order.deliveryDays === 'Both';
        const showWednesday = order.deliveryDays === 'Wednesday' || order.deliveryDays === 'Both';

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => {
                    const sundayQuantity = order.addons.sunday.find(ci => ci.item.id === item.id)?.quantity || 0;
                    const wednesdayQuantity = order.addons.wednesday.find(ci => ci.item.id === item.id)?.quantity || 0;
                    const hasSupplementPrice = parseFloat(item.price) > 0;

                    return (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-full mt-1">
                                    <Salad className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-md text-gray-800 mb-2">{item.name}</p>
                                    <SpiceRating rating={item.spiceRating || 0} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4 pl-11">
                                <MacroBadge label="Calories" value={item.calories || 'N/A'} color="text-red-500" icon={Flame} />
                                <MacroBadge label="Protein" value={`${item.protein || 'N/A'}`} color="text-green-500" icon={Drumstick} />
                                <MacroBadge label="Carbs" value={`${item.carbs || 'N/A'}`} color="text-yellow-500" icon={Wheat} />
                                <MacroBadge label="Fat" value={`${item.fat || 'N/A'}`} color="text-blue-500" icon={Beef} />
                            </div>
                            {item.allergens && (
                                <div className="mb-4 pl-11">
                                    <p className="text-xs text-gray-500"><span className="font-semibold">Allergens:</span> {item.allergens}</p>
                                </div>
                            )}
                            {hasSupplementPrice && (
                                <p className="text-lg text-gray-800 font-bold mt-3 pl-12">
                                    +£{parseFloat(item.price).toFixed(2)} each
                                </p>
                            )}
                            <div className="mt-auto flex flex-col gap-4 pl-11 pr-11">
                                <hr className="text-gray-100"/>
                                {showSunday && (
                                    <div className="flex items-center justify-between">
                                        <label className="font-medium text-gray-600">Sunday:</label>
                                        <QuantitySelector
                                            quantity={sundayQuantity}
                                            onDecrement={() => dispatch(updateAddonQuantity({ item, quantity: sundayQuantity - 1, day: 'sunday' }))}
                                            onIncrement={() => dispatch(updateAddonQuantity({ item, quantity: sundayQuantity + 1, day: 'sunday' }))}
                                        />
                                    </div>
                                )}
                                {showWednesday && (
                                    <div className="flex items-center justify-between">
                                        <label className="font-medium text-gray-600">Wednesday:</label>
                                         <QuantitySelector
                                            quantity={wednesdayQuantity}
                                            onDecrement={() => dispatch(updateAddonQuantity({ item, quantity: wednesdayQuantity - 1, day: 'wednesday' }))}
                                            onIncrement={() => dispatch(updateAddonQuantity({ item, quantity: wednesdayQuantity + 1, day: 'wednesday' }))}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const renderDessertSelector = () => {
        if (order.deliveryDays === 'Sunday') {
            return (
                <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-center gap-4">
                    <Info className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-800">Desserts Available for Wednesday Delivery Only</h3>
                        <p className="text-yellow-700 mt-1">
                           To add desserts, please go back and select either Wednesday or Both for your delivery days.
                        </p>
                    </div>
                </div>
            )
        }

        return (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map(item => {
                    const currentQuantity = order.desserts.find(ci => ci.item.id === item.id)?.quantity || 0;
                    return (
                        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col gap-4">
                            <div className="flex items-start gap-3 w-full">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Cookie className="w-6 h-6 text-orange-600 flex-shrink-0" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-lg text-gray-800">{item.name}</p>
                                    <p className="text-gray-500 font-bold">£{item.price.toFixed(2)}</p>
                                    {item.allergens && (
                                        <p className="text-xs text-gray-500 mt-1"><span className="font-semibold">Allergens:</span> {item.allergens}</p>
                                    )}
                                </div>
                            </div>
                            <hr className="w-full border-t border-gray-200" />
                            <div className="w-full flex justify-center">
                                <QuantitySelector
                                    quantity={currentQuantity}
                                    onDecrement={() => dispatch(updateDessertQuantity({ item, quantity: currentQuantity - 1 }))}
                                    onIncrement={() => dispatch(updateDessertQuantity({ item, quantity: currentQuantity + 1 }))}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="mb-8">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: itemType === 'addon' ? '60%' : '80%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">Step {itemType === 'addon' ? 3 : 4} of 5: {title.substring(3)}</p>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <p className="text-gray-500 mt-2">Fancy something extra? Add snacks, drinks, or desserts to your order.</p>
                </div>

                {isLoading && <div className="text-center p-8">Loading items...</div>}
                {error && <div className="text-center p-8 text-red-500">Could not load items. Please try again later.</div>}

                {itemType === 'addon' ? renderAddonSelector() : renderDessertSelector()}

                <div className="mt-12 pt-6 border-t flex items-center justify-between">
                    <button onClick={onBack} className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                        ← Back
                    </button>
                    <button onClick={onNext} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
                        {itemType === 'addon' ? 'Next: Desserts →' : 'Review Your Box ✓'}
                    </button>
                </div>
            </div>
        </div>
    );
};
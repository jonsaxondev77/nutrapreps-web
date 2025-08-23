'use client';

import { useState } from "react";
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addItem } from "@/lib/store/cartSlice";
import { Package, ChefHat, Salad, Cookie, ShoppingCart, CheckCircle } from 'lucide-react';

interface Props {
  onEdit: () => void;
  onRestart: () => void;
}

export const ReviewAndConfirm = ({ onEdit, onRestart }: Props) => {
    const dispatch = useAppDispatch();
    const order = useAppSelector((state) => state.order);
    const [isAdded, setIsAdded] = useState(false);

    if (!order.plan) {
        return <p className="text-center p-8">Your box configuration is empty. Please go back and select a plan.</p>;
    }

    const addonsTotal = order.addons.sunday.reduce((total, addon) => total + addon.price * addon.quantity, 0)
                      + order.addons.wednesday.reduce((total, addon) => total + addon.price * addon.quantity, 0);

    const dessertsTotal = order.desserts.reduce((total, dessert) => total + dessert.price * dessert.quantity, 0);
    const grandTotal = order.plan.price + addonsTotal + dessertsTotal;

    const handleAddToCart = () => {
        dispatch(addItem({ order, totalPrice: grandTotal }));
        setIsAdded(true);
    };

    const allMeals = [...order.meals.sunday, ...order.meals.wednesday].filter(Boolean);

    if (isAdded) {
        return (
            <div className="w-full max-w-5xl mx-auto">
                 <div className="p-8 bg-white shadow-lg rounded-2xl text-center animate-fade-in">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">Box Added to Cart!</h2>
                    <p className="text-gray-600 mb-8">You can now build another box or proceed to checkout.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onRestart}
                            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Build Another Box
                        </button>
                        <Link
                            href="/checkout"
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* --- Progress Bar --- */}
            <div className="mb-8">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">Step 5 of 5: Review & Confirm</p>
            </div>

            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Review Your Custom Box</h1>
                    <p className="text-gray-500 mt-2">Almost there! Please confirm your selections below.</p>
                </div>

                <div className="space-y-6">
                    {/* Plan & Delivery Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-6 h-6 text-green-600"/>
                            <h3 className="font-bold text-xl">Plan & Delivery</h3>
                        </div>
                        <p className="pl-9"><strong>Plan:</strong> {order.plan.name} ({order.plan.mealsPerWeek} meals)</p>
                        <p className="pl-9"><strong>Delivery:</strong> {order.deliveryDays}</p>
                    </div>

                    {/* Selected Meals Section */}
                    <div className="p-4 bg-gray-50 rounded-lg border">
                         <div className="flex items-center gap-3 mb-2">
                            <ChefHat className="w-6 h-6 text-green-600"/>
                            <h3 className="font-bold text-xl">Selected Meals ({allMeals.length})</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-9">
                            {allMeals.map((option, i) => <li key={i}>{option.meal.name}</li>)}
                        </ul>
                    </div>

                    {/* Add-ons Section */}
                    {(order.addons.sunday.length > 0 || order.addons.wednesday.length > 0) && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3 mb-2">
                                <Salad className="w-6 h-6 text-green-600"/>
                                <h3 className="font-bold text-xl">Selected Add-ons</h3>
                            </div>
                            <div className="pl-9">
                                {order.addons.sunday.length > 0 && (
                                    <div className="mb-2">
                                        <p className="font-semibold text-gray-800">Sunday:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                                            {order.addons.sunday.map(addon => (
                                                <li key={addon.id}>{addon.quantity}x {addon.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {order.addons.wednesday.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-gray-800">Wednesday:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                                            {order.addons.wednesday.map(addon => (
                                                <li key={addon.id}>{addon.quantity}x {addon.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Desserts Section */}
                    {order.desserts.length > 0 && (
                         <div className="p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-3 mb-2">
                                <Cookie className="w-6 h-6 text-green-600"/>
                                <h3 className="font-bold text-xl">Selected Desserts</h3>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-9">
                                {order.desserts.map(dessert => (
                                    <li key={dessert.id}>{dessert.quantity}x {dessert.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Price Calculation Section */}
                <div className="mt-10 pt-6 border-t">
                    <div className="space-y-2 text-lg">
                        <div className="flex justify-between"><span>Plan: {order.plan.name}</span> <span>£{order.plan.price.toFixed(2)}</span></div>
                        {addonsTotal > 0 && <div className="flex justify-between text-gray-600"><span>Add-ons</span> <span>£{addonsTotal.toFixed(2)}</span></div>}
                        {dessertsTotal > 0 && <div className="flex justify-between text-gray-600"><span>Desserts</span> <span>£{dessertsTotal.toFixed(2)}</span></div>}
                        <div className="flex justify-between font-bold text-2xl border-t pt-2 mt-2">
                            <span>Total for this box</span>
                            <span>£{grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="mt-12 flex justify-between">
                    <button onClick={onEdit} className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                        ← Edit Selections
                    </button>
                    <button onClick={handleAddToCart} className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
                        <ShoppingCart size={20} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

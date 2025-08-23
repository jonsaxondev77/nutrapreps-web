'use client';

import { useOrder } from "@/context/OrderContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import Link from 'next/link';

interface Props {
  onEdit: () => void;
  onRestart: () => void;
}

export const ReviewAndConfirm = ({ onEdit, onRestart }: Props) => {
    const { order } = useOrder();
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    if (!order.plan) {
        return <p>Your box configuration is empty.</p>;
    }

    const sundayAddonsTotal = order.addons.sunday.reduce((total, addon) => total + addon.item.price * addon.quantity, 0);
    const wednesdayAddonsTotal = order.addons.wednesday.reduce((total, addon) => total + addon.item.price * addon.quantity, 0);
    const addonsTotal = sundayAddonsTotal + wednesdayAddonsTotal;

    const dessertsTotal = order.desserts.reduce((total, dessert) => total + dessert.item.price * dessert.quantity, 0);
    const grandTotal = order.plan.price + addonsTotal + dessertsTotal;

    const handleAddToCart = () => {
        addItem(order, grandTotal);
        setIsAdded(true);
    };

    const allMeals = [...order.meals.sunday, ...order.meals.wednesday].filter(Boolean);

    if (isAdded) {
        return (
            <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-7xl text-center animate-fade-in">
                <h2 className="text-3xl font-bold mb-4 text-green-600">✅ Box Added to Cart!</h2>
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
        )
    }

    return (
        <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-7xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">5. Review Your Custom Box</h2>

            <div className="space-y-6 border-b pb-6 mb-6">
                {/* Plan & Delivery Section */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-xl mb-2">Plan & Delivery</h3>
                    <p><strong>Plan:</strong> {order.plan.name}</p>
                    <p><strong>Delivery:</strong> {order.deliveryDays}</p>
                </div>

                {/* Selected Meals Section */}
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold text-xl mb-2">Selected Meals ({allMeals.length})</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {allMeals.map((option, i) => <li key={i}>{option?.meal.name}</li>)}
                    </ul>
                </div>

                {/* --- UPDATED SECTION FOR ADD-ONS --- */}
                {(order.addons.sunday.length > 0 || order.addons.wednesday.length > 0) && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-xl mb-2">Selected Add-ons</h3>
                        {order.addons.sunday.length > 0 && (
                            <div className="mb-2">
                                <p className="font-semibold text-gray-800">Sunday:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                                    {order.addons.sunday.map(addon => (
                                        <li key={addon.item.id}>{addon.quantity}x {addon.item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {order.addons.wednesday.length > 0 && (
                            <div>
                                <p className="font-semibold text-gray-800">Wednesday:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                                    {order.addons.wednesday.map(addon => (
                                        <li key={addon.item.id}>{addon.quantity}x {addon.item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}


                {/* --- NEW SECTION FOR DESSERTS --- */}
                {order.desserts.length > 0 && (
                     <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold text-xl mb-2">Selected Desserts</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {order.desserts.map(dessert => (
                                <li key={dessert.item.id}>{dessert.quantity}x {dessert.item.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Price Calculation Section */}
            <div className="space-y-2 text-lg mb-8">
                <div className="flex justify-between"><span>Plan: {order.plan.name}</span> <span>£{order.plan.price.toFixed(2)}</span></div>
                {addonsTotal > 0 && <div className="flex justify-between"><span>Add-ons</span> <span>£{addonsTotal.toFixed(2)}</span></div>}
                {dessertsTotal > 0 && <div className="flex justify-between"><span>Desserts</span> <span>£{dessertsTotal.toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-2xl border-t pt-2 mt-2">
                    <span>Total for this box</span>
                    <span>£{grandTotal.toFixed(2)}</span>
                </div>
            </div>

            {/* Buttons Section */}
            <div className="mt-8 flex justify-between">
                <button onClick={onEdit} className="px-8 py-3 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-colors">
                    ← Edit Selections
                </button>
                <button onClick={handleAddToCart} className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};
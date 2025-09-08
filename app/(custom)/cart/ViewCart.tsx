'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { removeItem } from '@/lib/store/cartSlice';
import { resetOrder } from '@/lib/store/orderSlice';
import { useGetShippingDetailsQuery } from '@/lib/store/services/authApi';
import { ShoppingCart, Trash2 } from 'lucide-react';

export default function ViewCart() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.cartItems);
    const router = useRouter();
    const { data: shippingData } = useGetShippingDetailsQuery();

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    
    // Check if any cart item is for dual delivery
    const isDualDelivery = cartItems.some((item) => item.deliveryDays === 'Both');
    const baseShippingCost = shippingData?.cost ?? 0;
    
    // Dynamically set the shipping cost
    const shippingCost = isDualDelivery ? baseShippingCost * 2 : baseShippingCost;
    
    const total = subtotal + shippingCost;

    const handleContinueShopping = () => {
        dispatch(resetOrder());
        router.push('/order');
    };

    if (cartItems.length === 0) {
        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-4">
                <div className="p-8 bg-white shadow-lg rounded-2xl text-center animate-fade-in">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h1>
                    <p className="text-gray-500 mt-2 mb-8">Looks like you haven&apos;t added any meal boxes yet.</p>
                    <button
                        onClick={handleContinueShopping}
                        className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                        Start Your Order
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                    <p className="text-gray-500 mt-2">Review the items in your cart below.</p>
                </div>

                <div className="space-y-6">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg">
                            <Image
                                src="https://placehold.co/200x200/e2e8f0/4a5568?text=Meal+Box"
                                alt={item.plan?.name || 'Meal Box'}
                                width={128}
                                height={128}
                                className="rounded-md w-32 h-32 object-cover flex-shrink-0"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{item.plan?.name}</h3>
                                        <p className="text-sm text-gray-500">{item.deliveryDays} Delivery</p>
                                    </div>
                                    <p className="font-semibold text-lg">£{item.totalPrice.toFixed(2)}</p>
                                </div>
                                <div className="mt-2 text-xs text-gray-600 space-y-2">
                                    {(item.addons.sunday.length > 0 || item.addons.wednesday.length > 0) && (
                                        <div>
                                            <p className="font-semibold">Add-ons:</p>
                                            <ul className="list-disc list-inside pl-2">
                                                {item.addons.sunday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name} (Sun)</li>)}
                                                {item.addons.wednesday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name} (Wed)</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {item.desserts.length > 0 && (
                                        <div>
                                            <p className="font-semibold">Desserts:</p>
                                            <ul className="list-disc list-inside pl-2">
                                                {item.desserts.map(dessert => <li key={dessert.item.id}>{dessert.quantity}x {dessert.item.name}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button onClick={() => dispatch(removeItem(item.id))} className="text-gray-400 hover:text-red-500 ml-auto sm:ml-4 flex-shrink-0">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="mt-10 pt-6 border-t space-y-2">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
                    <div className="flex justify-between font-bold text-xl text-gray-800 mt-2 pt-2 border-t"><span>Total</span><span>£{total.toFixed(2)}</span></div>
                </div>

                {/* Actions */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button onClick={handleContinueShopping} className="text-green-600 font-medium hover:underline">
                        ← Build Another Box
                    </button>
                    <Link
                        href="/checkout"
                        className="w-full sm:w-auto bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-8 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-center"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}
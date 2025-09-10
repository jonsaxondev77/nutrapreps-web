'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { removeItem } from '@/lib/store/cartSlice';
import { resetOrder } from '@/lib/store/orderSlice';
import { useGetShippingDetailsQuery } from '@/lib/store/services/authApi';
import { ShoppingCart, Trash2, Tag, X, ChefHat, Salad, Cookie } from 'lucide-react';
import { Modal } from '@/app/components/design/Modal';

// --- New: Order Details Modal Component ---
const OrderDetailsModal = ({ item, onClose }: { item: any, onClose: () => void }) => {
    if (!item) return null;

    const sundayMeals = item.meals.sunday.filter(Boolean);
    const wednesdayMeals = item.meals.wednesday.filter(Boolean);

    return (
        <Modal onClose={onClose}>
            <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-xl font-bold mb-4">Your Selections for the {item.plan.name} Box</h3>

                <div className="space-y-6">
                     {/* Meals Section */}
                    {(sundayMeals.length > 0 || wednesdayMeals.length > 0) && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><ChefHat size={20}/> Meals</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {sundayMeals.map((mealOption) => (
                                    <li key={mealOption!.id} className="flex items-center text-gray-700">
                                        <span className="mr-1">{mealOption!.meal.name} (Sunday)</span>
                                        {parseFloat(mealOption!.meal.supplement) > 0 && (
                                            <span className="bg-orange-500 text-white text-xs font-bold px-1 py-0.5 rounded-full flex items-center gap-1">
                                                <Tag size={10} /> +£{parseFloat(mealOption!.meal.supplement).toFixed(2)}
                                            </span>
                                        )}
                                    </li>
                                ))}
                                {wednesdayMeals.map((mealOption) => (
                                    <li key={mealOption!.id} className="flex items-center text-gray-700">
                                        <span className="mr-1">{mealOption!.meal.name} (Wednesday)</span>
                                        {parseFloat(mealOption!.meal.supplement) > 0 && (
                                            <span className="bg-orange-500 text-white text-xs font-bold px-1 py-0.5 rounded-full flex items-center gap-1">
                                                <Tag size={10} /> +£{parseFloat(mealOption!.meal.supplement).toFixed(2)}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Add-ons Section */}
                    {(item.addons.sunday.length > 0 || item.addons.wednesday.length > 0) && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                             <h4 className="font-semibold text-lg flex items-center gap-2 mb-2"><Salad size={20}/> Add-ons</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {item.addons.sunday.map(addon => <li key={addon.item.id} className="text-gray-700">{addon.quantity}x {addon.item.name} (Sun)</li>)}
                                {item.addons.wednesday.map(addon => <li key={addon.item.id} className="text-gray-700">{addon.quantity}x {addon.item.name} (Wed)</li>)}
                            </ul>
                        </div>
                    )}

                    {/* Desserts Section */}
                    {item.desserts.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
                                <Cookie size={20}/> Desserts <span className="text-sm text-gray-500 font-normal ml-2">(Wednesday Delivery Only)</span>
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {item.desserts.map(dessert => <li key={dessert.item.id} className="text-gray-700">{dessert.quantity}x {dessert.item.name}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default function ViewCart() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.cartItems);
    const router = useRouter();
    const { data: shippingData } = useGetShippingDetailsQuery();

    const planSubtotal = cartItems.reduce((acc, item) => acc + (item.plan?.price ?? 0), 0);

    const supplementsTotal = cartItems.reduce((acc, item) => {
        const mealSupplements = [...item.meals.sunday, ...item.meals.wednesday]
            .filter(Boolean)
            .reduce((total, mealOption) => total + parseFloat(mealOption!.meal.supplement), 0);
        return acc + mealSupplements;
    }, 0);

    const addonsTotal = cartItems.reduce((acc, item) => {
      const allAddons = [...item.addons.sunday, ...item.addons.wednesday];
      const addonPrice = allAddons.reduce((total, addon) => total + (addon.item.price * addon.quantity), 0);
      return acc + addonPrice;
    }, 0);

    const dessertsTotal = cartItems.reduce((acc, item) => {
      const dessertPrice = item.desserts.reduce((total, dessert) => total + (dessert.item.price * dessert.quantity), 0);
      return acc + dessertPrice;
    }, 0);

    const subtotal = planSubtotal + addonsTotal + dessertsTotal;

    // Check if any cart item is for dual delivery
    const isDualDelivery = cartItems.some((item) => item.deliveryDays === 'Both');
    const baseShippingCost = shippingData?.cost ?? 0;

    // Dynamically set the shipping cost
    const shippingCost = isDualDelivery ? baseShippingCost * 2 : baseShippingCost;

    const total = subtotal + supplementsTotal + shippingCost;

    // State to manage the modal
    const [selectedCartItem, setSelectedCartItem] = useState(null);

    const handleContinueShopping = () => {
        dispatch(resetOrder());
        router.push('/order');
    };

    const openDetailsModal = (item: any) => {
        setSelectedCartItem(item);
    };

    const closeDetailsModal = () => {
        setSelectedCartItem(null);
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
            {selectedCartItem && (
                <OrderDetailsModal item={selectedCartItem} onClose={closeDetailsModal} />
            )}
            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
                    <p className="text-gray-500 mt-2 mb-4">Review the items in your cart below.</p>
                    <p className="text-sm text-green-600 font-medium">Click on the image of the box to see what's inside!</p>
                </div>

                <div className="space-y-6">
                    {cartItems.map(item => {
                        const allMeals = [...item.meals.sunday, ...item.meals.wednesday].filter(Boolean);
                        const hasSupplements = allMeals.some(meal => parseFloat(meal.meal.supplement) > 0);

                        return (
                            <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg">
                                <button onClick={() => openDetailsModal(item)}>
                                    <Image
                                        src="/images/upfs.jpg"
                                        alt={item.plan?.name || 'Meal Box'}
                                        width={128}
                                        height={128}
                                        className="rounded-md w-32 h-32 object-cover flex-shrink-0 cursor-pointer"
                                    />
                                </button>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-800">{item.plan?.name}</h3>
                                            <p className="text-sm text-gray-500">{item.deliveryDays} Delivery</p>
                                        </div>
                                        <p className="font-semibold text-lg">£{item.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-600 space-y-2">
                                        <div className="space-y-1">
                                            <p className="font-semibold text-sm">Meals:</p>
                                            <ul className="list-disc list-inside pl-2">
                                                {item.deliveryDays === 'Both' ? (
                                                    <>
                                                        <li>{item.meals.sunday.length} meals for Sunday</li>
                                                        <li>{item.meals.wednesday.length} meals for Wednesday</li>
                                                    </>
                                                ) : (
                                                    <li>{allMeals.length} meals for {item.deliveryDays}</li>
                                                )}
                                            </ul>
                                        </div>

                                        {(item.addons.sunday.length > 0 || item.addons.wednesday.length > 0) && (
                                            <div>
                                                <p className="font-semibold text-sm">Add-ons:</p>
                                                <ul className="list-disc list-inside pl-2">
                                                    {item.addons.sunday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name} (Sun)</li>)}
                                                    {item.addons.wednesday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name} (Wed)</li>)}
                                                </ul>
                                            </div>
                                        )}
                                        {item.desserts.length > 0 && (
                                            <div>
                                                <p className="font-semibold text-sm">Desserts:</p>
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
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="mt-10 pt-6 border-t space-y-2">
                    <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                    {supplementsTotal > 0 && (
                        <div className="flex justify-between text-gray-600">
                            <span>Meal Supplements</span>
                            <span>£{supplementsTotal.toFixed(2)}</span>
                        </div>
                    )}
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
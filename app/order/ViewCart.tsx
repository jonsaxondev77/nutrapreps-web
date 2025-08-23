'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';

export default function ViewCart() {
    const { cartItems, removeItem } = useCart();
    const { resetOrder } = useOrder();
    const router = useRouter();

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const shippingCost = 5.00;
    const total = subtotal + shippingCost;

    const handleContinueShopping = () => {
        resetOrder();
        router.push('/order'); // Navigate to the main builder page
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center">Shopping Cart</h1>

                <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

                        {cartItems.length > 0 ? (
                            <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                {cartItems.map((item, itemIdx) => (
                                    <li key={item.id} className="flex py-6 sm:py-10">
                                        {/* FIX: Replaced <img> with <Image> and adjusted parent div */}
                                        <div className="flex-shrink-0 relative w-24 h-24 sm:w-48 sm:h-48">
                                            <Image
                                                src="https://placehold.co/200x200/e2e8f0/4a5568?text=Meal+Box"
                                                alt={item.plan?.name || 'Meal Box'}
                                                layout="fill"
                                                className="rounded-md object-center object-cover"
                                            />
                                        </div>

                                        <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-sm">
                                                            <span className="font-medium text-gray-700 hover:text-gray-800">{item.plan?.name}</span>
                                                        </h3>
                                                    </div>
                                                    <div className="mt-1 flex text-sm">
                                                        <p className="text-gray-500">{item.deliveryDays} delivery</p>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-gray-900">£{item.totalPrice.toFixed(2)}</p>
                                                    
                                                    <div className="mt-2 text-xs text-gray-600">
                                                        {(item.addons.sunday.length > 0 || item.addons.wednesday.length > 0) && (
                                                            <div>
                                                                {item.addons.sunday.length > 0 && (
                                                                    <div className="mb-1">
                                                                        <p className="font-semibold">Sunday Add-ons:</p>
                                                                        <ul className="list-disc list-inside pl-2">
                                                                            {item.addons.sunday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {item.addons.wednesday.length > 0 && (
                                                                    <div>
                                                                        <p className="font-semibold">Wednesday Add-ons:</p>
                                                                        <ul className="list-disc list-inside pl-2">
                                                                            {item.addons.wednesday.map(addon => <li key={addon.item.id}>{addon.quantity}x {addon.item.name}</li>)}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {item.desserts.length > 0 && (
                                                            <div className="mt-1">
                                                                <p className="font-semibold">Desserts:</p>
                                                                <ul className="list-disc list-inside pl-2 mt-1">
                                                                    {item.desserts.map(dessert => <li key={dessert.item.id}>{dessert.quantity}x {dessert.item.name}</li>)}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mt-4 sm:mt-0 sm:pr-9">
                                                    <div className="absolute top-0 right-0">
                                                        <button type="button" onClick={() => removeItem(item.id)} className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500">
                                                            <span className="sr-only">Remove</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 py-16">Your cart is currently empty.</p>
                        )}
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">£{subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Shipping estimate</dt>
                                <dd className="text-sm font-medium text-gray-900">£{shippingCost.toFixed(2)}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">£{total.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 block text-center"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                        <div className="mt-6 text-center text-sm">
                            <p>
                                or{' '}
                                <button type="button" onClick={handleContinueShopping} className="text-indigo-600 font-medium hover:text-indigo-500">
                                    Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                </button>
                            </p>
                        </div>
                    </section>
                </form>
            </div>
        </div>
    );
}

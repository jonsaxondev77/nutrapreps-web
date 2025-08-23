// components/Ordering/Checkout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { IoClose } from "react-icons/io5";
import { placeOrderApi } from '@/api';
import { useSession } from 'next-auth/react';
import { MealOption, OrderedMealDto, OrderExtraDto, OrderItemDto, PlaceOrderRequestDto } from '@/types';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { appSettingConfig } from '@/lib/config';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeWrapper from '../Stripe/StripeWrapper';

const CheckoutForm = () => {
    const { cartItems, removeItem, completeOrder } = useCart();
    const { resetOrder } = useOrder();
    const router = useRouter();
    const { data: session } = useSession();
    const stripe = useStripe();
    const elements = useElements();

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const shippingCost = 0.00;
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (total > 0 && session?.user?.id) {
            fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                }),
            }).then((res) => res.json()).then((data) => setClientSecret(data.clientSecret));
        }
    }, [total, session]);

    const handlePlaceOrder = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setProcessing(false);
            return;
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (stripeError) {
            toast.error(stripeError.message || "An error occurred with the payment.");
            setProcessing(false);
            return;
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            
            const weekstartDate = new Date();
            const orderItems: OrderItemDto[] = cartItems.map(cartItem => {
                const sundayMeals: OrderedMealDto[] = cartItem.meals.sunday
                    .filter((option): option is MealOption => option !== null)
                    .map(option => ({ mealOptionId: option.id, day: 'Sunday', quantity: 1 }));

                const wednesdayMeals: OrderedMealDto[] = cartItem.meals.wednesday
                    .filter((option): option is MealOption => option !== null)
                    .map(option => ({ mealOptionId: option.id, day: 'Wednesday', quantity: 1 }));

                const sundayAddons: OrderedMealDto[] = cartItem.addons.sunday.map(addon => ({
                    mealOptionId: addon.item.id,
                    day: 'Sunday',
                    quantity: addon.quantity
                }));

                const wednesdayAddons: OrderedMealDto[] = cartItem.addons.wednesday.map(addon => ({
                    mealOptionId: addon.item.id,
                    day: 'Wednesday',
                    quantity: addon.quantity
                }));

                return {
                    planId: cartItem.plan!.id,
                    deliveryDay: cartItem.deliveryDays!,
                    meals: [...sundayMeals, ...wednesdayMeals, ...sundayAddons, ...wednesdayAddons],
                };
            });

            const aggregatedExtras = new Map<number, number>();

            for (const cartItem of cartItems) {
                for (const dessert of cartItem.desserts) {
                    const existingQuantity = aggregatedExtras.get(dessert.item.id) || 0;
                    aggregatedExtras.set(dessert.item.id, existingQuantity + dessert.quantity);
                }
            }

            const extras: OrderExtraDto[] = Array.from(aggregatedExtras.entries()).map(([extraId, quantity]) => ({
                extraId,
                quantity,
            }));

            const orderDto: PlaceOrderRequestDto = {
                weekstart: weekstartDate.toISOString(),
                orderItems: orderItems,
                extras: extras,
            };

            try {
                const result = await placeOrderApi(
                    orderDto,
                    session!.user.jwtToken,
                    appSettingConfig.nutraPrepsApi || ''
                );

                if (result && result.success) {
                    const orderId = result.orderId;
                    const customerId = session?.user?.id;
                    const customerName = session?.user?.name;

                    await fetch('/api/update-payment-intent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            paymentIntentId: paymentIntent.id,
                            metadata: { customer_id: customerId, customer_name: customerName, order_id: orderId }
                        }),
                    });

                    toast.success('Order placed successfully!');
                    completeOrder(cartItems);
                    router.push(`/order-confirmation?orderId=${result.orderId}`);
                } else {
                    toast.error('An unknown error occurred.');
                }

            } catch (error) {
                console.error("Failed to place order:", error);
                toast.error(`Error placing order: ${(error as Error).message}`);
            }
        }
        setProcessing(false);
    };

    const handleContinueShopping = () => {
        resetOrder();
        router.push('/order');
    };

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Confirm Your Order
                    </h1>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handlePlaceOrder} className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900">Order summary</h2>

                            {cartItems.length > 0 ? (
                                <>
                                    <ul role="list" className="divide-y divide-gray-200 mt-6">
                                        {cartItems.map((item) => (
                                            <li key={item.id} className="flex py-6 space-x-4">
                                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden relative">
                                                    <Image
                                                        src="https://placehold.co/200x200/e2e8f0/4a5568?text=Meal+Box"
                                                        alt={item.plan?.name || 'Meal Box'}
                                                        layout="fill"
                                                        className="object-center object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.plan?.name}</h3>
                                                        <div className="flex items-center space-x-4">
                                                            <p>£{item.totalPrice.toFixed(2)}</p>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-red-500 transition-colors"
                                                                aria-label="Remove item"
                                                            >
                                                                <IoClose className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6 space-y-2 border-t border-gray-200 pt-6">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-sm text-gray-600">Subtotal</dt>
                                            <dd className="text-sm font-medium text-gray-900">£{subtotal.toFixed(2)}</dd>
                                        </div>
                                        <div className="flex items-center justify-between text-base font-medium text-gray-900 border-t border-gray-200 pt-4 mt-4">
                                            <dt>Total</dt>
                                            <dd>£{total.toFixed(2)}</dd>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-500 mt-6 py-8">Your cart is empty.</p>
                            )}
                            <div className="mt-6">
                                <CardElement options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                }} />
                            </div>
                            <div className="mt-8">
                                <button type="submit" disabled={!stripe || !clientSecret || processing} className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {processing ? 'Processing...' : `Pay £${total.toFixed(2)}`}
                                </button>
                            </div>

                            <div className="mt-6 text-center text-sm text-gray-500">
                                <p>
                                    or <button type="button" onClick={handleContinueShopping} className="font-medium text-indigo-600 hover:text-indigo-500">Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default function Checkout() {
    return (
        <StripeWrapper>
            <CheckoutForm />
        </StripeWrapper>
    )
}
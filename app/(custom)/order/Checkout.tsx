'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { removeItem } from '@/lib/store/cartSlice';
import { resetOrder } from '@/lib/store/orderSlice';
import { Lock, ArrowRight, Trash2 } from 'lucide-react';
import { usePlaceOrderMutation } from '@/lib/store/services/orderingApi';

export default function Checkout() {
    const dispatch = useAppDispatch();
    const cartItems = useAppSelector((state) => state.cart.cartItems);
    const router = useRouter();
    const [processing, setProcessing] = useState(false);
    const [placeOrder] = usePlaceOrderMutation();

    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const shippingCost = 5.00; // Example shipping cost
    const total = subtotal + shippingCost;

    const handleCheckout = async () => {
        setProcessing(true);
        toast.loading('Preparing your order...');

        try {

            const orderResponse = await placeOrder(cartItems).unwrap();
            const orderId = orderResponse.orderId;

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems, orderId }),
            });

            const data = await response.json();

            if (response.ok && data.url) {
                router.push(data.url);
            } else {
                toast.dismiss();
                toast.error(data.error || 'Could not initiate payment. Please try again.');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('An error occurred. Please try again.');
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const handleContinueShopping = () => {
        dispatch(resetOrder());
        router.push('/order');
    };

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
                    <p className="text-gray-500 mt-2">Please review your order before proceeding to payment.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Order</h2>
                        <div className="space-y-4">
                            {cartItems.length > 0 ? cartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <Image src="https://placehold.co/100x100/e2e8f0/4a5568?text=Box" alt={item.plan?.name || 'Meal Box'} width={64} height={64} className="rounded-md" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.plan?.name}</p>
                                        <p className="text-sm text-gray-500">{item.deliveryDays} Delivery</p>
                                    </div>
                                    <p className="font-semibold">£{item.totalPrice.toFixed(2)}</p>
                                    <button onClick={() => dispatch(removeItem(item.id))} className="text-gray-400 hover:text-red-500">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            )) : <p className="text-gray-500">Your cart is empty.</p>}
                        </div>
                        <div className="mt-6 pt-6 border-t space-y-2">
                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>£{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>£{shippingCost.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-xl text-gray-800"><span>Total</span><span>£{total.toFixed(2)}</span></div>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="flex flex-col items-center justify-center bg-gray-50 p-8 rounded-lg">
                         <h2 className="text-xl font-semibold text-gray-800 mb-4">Ready to Order?</h2>
                         <p className="text-gray-600 text-center mb-6">You will be redirected to our secure payment partner, Stripe, to complete your purchase.</p>
                         <button 
                            onClick={handleCheckout}
                            disabled={processing || cartItems.length === 0}
                            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400 hover:bg-green-700 transition-colors shadow-sm"
                        >
                            {processing ? 'Redirecting...' : <>
                                <Lock size={20} />
                                Proceed to Secure Payment
                                <ArrowRight size={20} />
                            </>}
                        </button>
                         <div className="mt-6 text-center text-sm">
                            <button onClick={handleContinueShopping} className="text-green-600 font-medium hover:underline">
                                ← Or Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { Order } from '@/types';
import { useSession } from 'next-auth/react';
import { getOrderByIdApi } from '@/api';
import { useOptionalPuck } from '@/hooks/useOptionalPuck'; // Import the new hook
import { appSettingConfig } from '@/lib/config';

export default function OrderConfirmation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const orderId = searchParams.get('orderId');

    // Use the custom hook to safely determine if we are in the editor.
    const puckState = useOptionalPuck();
    const isEditing = !!puckState;

    useEffect(() => {
        if (isEditing) {
            setIsLoading(false);
            return;
        }

        if (!orderId || !session?.user.jwtToken) {
            // Redirect if essential info is missing and we're not in edit mode
            if (!isEditing) router.replace('/order');
            return;
        }

        getOrderByIdApi(orderId, session.user.jwtToken, appSettingConfig.nutraPrepsApi || '')
            .then(fetchedOrder => {
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                } else {
                    if (!isEditing) router.replace('/order');
                }
            })
            .finally(() => setIsLoading(false));

    }, [orderId, session, isEditing, router]);
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p>Loading order confirmation...</p>
            </div>
        );
    }
    
    if (isEditing) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-700">Order Confirmation</h2>
                        <p className="mt-2 text-gray-500">This component will display the order summary after a customer successfully checks out.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        // This can happen if the order fetch fails or if redirected.
        // Returning null prevents a flash of content before redirect.
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                    <FaCheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Thank You For Your Order!</h1>
                    <p className="mt-2 text-lg text-gray-600">Your order #{order.id} has been placed successfully.</p>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/order" className="text-indigo-600 font-medium hover:text-indigo-500">
                        Place Another Order &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}

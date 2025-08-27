'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { useGetOrderBySessionIdQuery } from '@/lib/store/services/orderingApi';
import { useAppDispatch } from '@/lib/store/hooks';
import { clearCart } from '@/lib/store/cartSlice';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function OrderConfirmation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const sessionId = searchParams.get('session_id');

    const { data: order, error, isLoading } = useGetOrderBySessionIdQuery(sessionId!, {
        skip: !sessionId,
    });

    useEffect(() => {
        if (sessionId) {
            dispatch(clearCart());
        }
    }, [sessionId, dispatch]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-600">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg">Finalizing your order...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
                <p className="text-gray-600 mb-8">We couldn't find the details for this order. If you believe this is an error, please contact support.</p>
                <Link href="/" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    Back to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                <div className="text-center mb-10">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Thank You, {order.customerName}!</h1>
                    <p className="text-gray-500 mt-2">Your order #{order.id} has been placed successfully.</p>
                </div>
                
                <div className="mt-10 pt-6 border-t text-center">
                     <p className="text-2xl font-bold">Total Paid: £{order.totalPrice.toFixed(2)}</p>
                     <p className="text-gray-500 mt-2">A confirmation email has been sent to you.</p>
                </div>

                <div className="mt-10 flex justify-center gap-4">
                    <Link href="/order" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Build Another Box
                    </Link>
                    <Link href="/account" className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                        Go to My Account
                    </Link>
                </div>
            </div>
        </div>
    );
}

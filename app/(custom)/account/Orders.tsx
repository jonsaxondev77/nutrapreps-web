'use client';

import { useState } from 'react';
import { useGetOrderHistoryQuery } from '@/lib/store/services/orderingApi';
import { Loader2, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const Orders = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 5; // Display 5 orders per page

    const { data, isLoading, isError } = useGetOrderHistoryQuery({ pageNumber, pageSize });

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (isError) {
        return <p className="text-red-500">Could not load your order history.</p>;
    }

    if (!data || data.data.length === 0) {
        return (
            <div className="text-center">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">You haven&apos;t placed any orders with us. When you do, they&apos;ll appear here.</p>
                <Link href="/order" className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    Start Your First Order
                </Link>
            </div>
        );
    }

    const { data: orders, totalPages } = data;

    const handlePrevious = () => {
        setPageNumber(p => Math.max(1, p - 1));
    };

    const handleNext = () => {
        setPageNumber(p => Math.min(totalPages, p + 1));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            <div className="space-y-4">
                {orders.map(order => (
                    <div key={order.id} className="p-4 border rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-bold">Order #{order.id}</p>
                            <p className="text-sm text-gray-500">Placed on: {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">£{order.totalPrice.toFixed(2)}</p>
                            <p className={`text-sm font-semibold ${order.hasPayment ? 'text-green-600' : 'text-orange-500'}`}>
                                {order.hasPayment ? 'Paid' : 'Payment Pending'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={pageNumber === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={pageNumber === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Orders;


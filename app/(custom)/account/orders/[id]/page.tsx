'use client';

import { useGetDetailedOrderQuery } from '@/lib/store/services/orderingApi';
import { useParams } from 'next/navigation';
import { Loader2, XCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Package, ChefHat, Salad, Cookie } from 'lucide-react';


const OrderDetailsPage = () => {
    const params = useParams();
    const orderId = params.id;

    // Use a new RTK Query hook for the details endpoint
    const { data: orderDetails, isLoading, isError, error } = useGetDetailedOrderQuery(orderId);

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    if (isError) {
        // Handle a 404 Not Found error specifically
        if (error?.status === 404) {
            return (
                <div className="text-center text-red-500">
                    <XCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
                    <p>The order you are looking for does not exist.</p>
                    <Link href="/account?tab=orders" className="mt-4 inline-block text-blue-600 hover:underline">
                        Go back to Order History
                    </Link>
                </div>
            );
        }
        return <p className="text-red-500">An error occurred while fetching order details.</p>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Link href="/account?tab=orders" className="text-gray-500 hover:text-gray-800 flex items-center mb-6">
                <ChevronLeft size={20} /> Back to Orders
            </Link>
            
            <h1 className="text-3xl font-bold mb-4">Order #{orderDetails.id}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="p-4 border rounded-lg">
                    <h2 className="font-bold text-lg mb-2">Customer Information</h2>
                    <p><span className="font-semibold">Name:</span> {orderDetails.customerName}</p>
                    <p><span className="font-semibold">Telephone:</span> {orderDetails.telephone}</p>
                </div>
                <div className="p-4 border rounded-lg">
                    <h2 className="font-bold text-lg mb-2">Payment Details</h2>
                    <p><span className="font-semibold">Total Price:</span> £{orderDetails.totalPrice.toFixed(2)}</p>
                    <p>
                        <span className="font-semibold">Payment Status:</span>
                        <span className={`ml-2 font-bold ${orderDetails.hasPayment ? 'text-green-600' : 'text-orange-500'}`}>
                            {orderDetails.hasPayment ? 'Paid' : 'Payment Pending'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Order Items Section */}
            <div className="p-4 border rounded-lg mb-4">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2"><Package size={24}/> Your Plan</h2>
                {orderDetails.orderItems.map(item => (
                    <div key={item.orderItemId} className="mb-4 p-3 border rounded-lg">
                        <p className="font-semibold text-gray-700">Plan: {item.planName}</p>
                        <p className="text-sm text-gray-500 mb-2">Delivery: {item.deliveryDay}</p>
                        <ul className="list-disc list-inside space-y-1">
                            {item.meals.map((meal, index) => (
                                <li key={index} className="text-sm">
                                    {meal.quantity} x {meal.mealName} ({meal.mealOptionName})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Extras Section */}
            {orderDetails.extras.length > 0 && (
                <div className="p-4 border rounded-lg">
                    <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Salad size={24}/> Add-ons & Desserts
                    </h2>
                     <ul className="list-disc list-inside space-y-1">
                        {orderDetails.extras.map((extra, index) => (
                            <li key={index} className="text-sm">
                                {extra.quantity} x {extra.extraName}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;
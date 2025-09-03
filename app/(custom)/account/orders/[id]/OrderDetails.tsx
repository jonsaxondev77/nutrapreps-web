'use client';

import { useGetDetailedOrderQuery } from '@/lib/store/services/orderingApi';
import { useParams } from 'next/navigation';
import { Loader2, XCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Package, ChefHat, Salad, Cookie } from 'lucide-react';

const OrderDetails = () => {
    const params = useParams();
    const orderId = params.id;

    // Use a new RTK Query hook for the details endpoint
    const { data: orderDetails, isLoading, isError, error } = useGetDetailedOrderQuery(orderId);

    if (isLoading) {
        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-4">
                <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in flex justify-center items-center">
                    <Loader2 className="w-12 h-12 animate-spin" />
                </div>
            </div>
        );
    }

    if (isError || !orderDetails) {
        // Handle a 404 Not Found error specifically
        return (
            <div className="w-full max-w-5xl mx-auto py-12 px-4">
                <div className="p-8 bg-white shadow-lg rounded-2xl text-center animate-fade-in">
                    <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h2 className="text-2xl font-bold mb-2 text-red-600">Order Not Found</h2>
                    <p className="text-gray-500 mb-6">The order you are looking for does not exist or could not be loaded.</p>
                    <Link href="/account?tab=orders" className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-colors">
                        <ChevronLeft size={20} /> Go back to Order History
                    </Link>
                </div>
            </div>
        );
    }

    const hasAddonsOrDesserts = orderDetails.extras.length > 0 || orderDetails.orderItems.some(item => item.addons && item.addons.length > 0);

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4">
            <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
                 <div className="flex items-center gap-4 mb-8">
                    <Link href="/account?tab=orders" className="text-gray-500 hover:text-gray-800 flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Order #{orderDetails.id}</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Customer & Payment Info Section */}
                    <div className="space-y-4">
                        <div className="p-6 bg-gray-50 rounded-lg border">
                            <h2 className="font-bold text-xl mb-3 text-gray-800">Customer Information</h2>
                            <p className="text-gray-600"><span className="font-semibold">Name:</span> {orderDetails.customerName}</p>
                            <p className="text-gray-600"><span className="font-semibold">Telephone:</span> {orderDetails.telephone}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg border">
                            <h2 className="font-bold text-xl mb-3 text-gray-800">Payment Details</h2>
                            <p className="text-gray-600"><span className="font-semibold">Total Price:</span> £{orderDetails.totalPrice.toFixed(2)}</p>
                            <p className="flex items-center text-gray-600">
                                <span className="font-semibold">Payment Status:</span>
                                <span className={`ml-2 font-bold ${orderDetails.hasPayment ? 'text-green-600' : 'text-orange-500'}`}>
                                    {orderDetails.hasPayment ? 'Paid' : 'Payment Pending'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Order Items Section */}
                    <div className="space-y-4">
                        {/* Meals Card */}
                        <div className="p-6 bg-gray-50 rounded-lg border">
                            <h2 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-800"><ChefHat size={24}/> Your Plan</h2>
                            {orderDetails.orderItems.map(item => (
                                <div key={item.orderItemId} className="mb-4 p-3 border rounded-lg">
                                    <p className="font-semibold text-gray-700">Plan: {item.planName}</p>
                                    <p className="text-sm text-gray-500 mb-2">Delivery: {item.deliveryDay}</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        {item.meals.map((meal, index) => (
                                            <li key={index} className="text-sm">
                                                {meal.quantity} x {meal.mealName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        
                        {/* Extras Section */}
                        {hasAddonsOrDesserts && (
                            <div className="p-6 bg-gray-50 rounded-lg border">
                                <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                                    <Salad size={24}/> Desserts
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {orderDetails.orderItems.map(item => item.addons).flat().filter(Boolean).map((addon, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="font-semibold mr-1">{addon.quantity} x</span> {addon.mealName}
                                        </li>
                                    ))}
                                    {orderDetails.extras.map((extra, index) => (
                                        <li key={index} className="flex items-center">
                                            <span className="font-semibold mr-1">{extra.quantity} x</span> {extra.extraName}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
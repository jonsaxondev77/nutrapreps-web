'use client';

import { useOrder } from '@/context/OrderContext';
import { AVAILABLE_PLANS } from '@/data/mockData'; // Ensure this path is correct
import { DeliveryDay, Plan } from '@/types'; // Ensure this path is correct

interface Props {
  onNext: () => void;
}

export const PlanAndDelivery = ({ onNext }: Props) => {
  const { order, setOrder } = useOrder();
  const deliveryDays: DeliveryDay[] = ['Sunday', 'Wednesday', 'Both'];

  const handlePlanSelect = (plan: Plan) => {
    setOrder(prev => ({ ...prev, plan }));
  };

  const handleDeliverySelect = (day: DeliveryDay) => {
    setOrder(prev => ({ ...prev, deliveryDays: day }));
  };

  const isReady = order.plan && order.deliveryDays;

  return (
    <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-7xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">1. Choose Your Plan & Delivery</h2>

      {/* Plan Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Select a Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVAILABLE_PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => handlePlanSelect(plan)}
              className={`p-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
                order.plan?.id === plan.id
                  ? 'bg-blue-600 text-white border-blue-600 scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
            >
              {plan.name}
              <span className="block text-sm font-normal">({plan.mealsPerWeek} meals)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Delivery Day Selection */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Select Delivery Day(s)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryDays.map(day => (
            <button
              key={day}
              onClick={() => handleDeliverySelect(day)}
              className={`p-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
                order.deliveryDays === day
                  ? 'bg-blue-600 text-white border-blue-600 scale-105'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-right">
        <button
          onClick={onNext}
          disabled={!isReady}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
        >
          Next: Choose Meals →
        </button>
      </div>
    </div>
  );
};

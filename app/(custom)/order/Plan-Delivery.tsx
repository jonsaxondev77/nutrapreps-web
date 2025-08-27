'use client';

import { DeliveryDay, Package } from '@/types/ordering';
import { setPlan, setDeliveryDays } from '@/lib/store/orderSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useGetPackagesQuery } from '@/lib/store/services/packagesApi';
import { Calendar, Users, Zap, Leaf, PackageIcon } from 'lucide-react';

// --- Helper Data for Plan Cards ---
// In a real app, this might come from the API as well
const planDetails = {
  'Half Weekly': { description: 'Perfect for trying us out or supplementing your week.', icon: <Leaf size={24} /> },
  'Full Weekly': { description: 'Our most popular plan for individuals.', icon: <Zap size={24} /> },
  'Bulk Weekly': { description: 'Great for couples or serious meal preppers.', icon: <Users size={24} /> },
  'Double Weekly': { description: 'The ultimate choice for families or maximum convenience.', icon: <Calendar size={24} /> },
};


interface Props {
  onNext: () => void;
}

export const PlanAndDelivery = ({ onNext }: Props) => {
  const dispatch = useAppDispatch();
  const { plan, deliveryDays } = useAppSelector((state) => state.order);
  const { data: packages, error, isLoading } = useGetPackagesQuery();

  const deliveryDayOptions: DeliveryDay[] = ['Sunday', 'Wednesday', 'Both'];

  const handlePlanSelect = (selectedPlan: Package) => {
    dispatch(setPlan(selectedPlan));
  };

  const handleDeliverySelect = (day: DeliveryDay) => {
    dispatch(setDeliveryDays(day));
  };

  const isReady = plan && deliveryDays;

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* --- Progress Bar --- */}
      <div className="mb-8">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div className="h-2 bg-green-500 rounded-full" style={{ width: '20%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">Step 1 of 5: Plan & Delivery</p>
      </div>

      <div className="p-8 bg-white shadow-lg rounded-2xl animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">Let&apos;s Build Your Perfect Box</h1>
            <p className="text-gray-500 mt-2">Start by picking a plan that fits your lifestyle.</p>
        </div>

        {/* --- Plan Selection --- */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select a Plan</h2>
          {isLoading && <div className="text-center p-8">Loading plans...</div>}
          {error && <div className="text-center p-8 text-red-500">Could not load plans. Please try again later.</div>}
          {packages && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map(p => {
                const details = planDetails[p.name] || { description: `${p.mealsPerWeek} meals per week.`, icon: <PackageIcon size={24} /> };
                const isSelected = plan?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handlePlanSelect(p)}
                    className={`text-left p-4 border-2 rounded-lg transition-all duration-200 flex flex-col h-full ${
                      isSelected
                        ? 'bg-green-50 border-green-500 scale-105 shadow-md'
                        : 'bg-white border-gray-200 hover:border-green-400 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mb-3 ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>{details.icon}</div>
                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">({p.mealsPerWeek} meals)</p>
                    <p className="font-bold text-lg text-green-600 mb-2">£{p.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 flex-grow">{details.description}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* --- Delivery Day Selection --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Delivery Day(s)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deliveryDayOptions.map(day => (
              <button
                key={day}
                onClick={() => handleDeliverySelect(day)}
                className={`p-4 border-2 rounded-lg font-semibold transition-all duration-200 ${
                  deliveryDays === day
                    ? 'bg-green-500 text-white border-green-500 scale-105 shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
        
        {/* --- Footer with Summary and Next Button --- */}
        <div className="mt-12 pt-6 border-t flex items-center justify-between">
            <div>
                {plan && (
                    <div className="text-sm text-gray-600">
                        <p><span className="font-bold">Your Plan:</span> {plan.name}</p>
                        <p><span className="font-bold">Price:</span> £{plan.price.toFixed(2)}/week</p>
                    </div>
                )}
            </div>
          <button
            onClick={onNext}
            disabled={!isReady}
            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
          >
            Next: Choose Meals →
          </button>
        </div>
      </div>
    </div>
  );
};

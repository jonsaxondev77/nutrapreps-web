'use client';

import { DeliveryDay, Package } from '@/types/ordering';
import { setPlan, setDeliveryDays } from '@/lib/store/orderSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { useGetPackagesQuery } from '@/lib/store/services/packagesApi';
import { getStartOfWeekDate, formatOrderWeek } from '@/lib/store/services/orderingApi';
import { Calendar, Users, Zap, Leaf, PackageIcon } from 'lucide-react';
import { useGetUserProfileQuery } from '@/lib/store/services/authApi';
import { useGetDeliveryAvailabilityQuery } from '@/lib/store/services/settingsApi'; // Ensure this is imported

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
  const { data: userProfile, isLoading: isLoadingProfile } = useGetUserProfileQuery();
  const { data: deliveryAvailability, isLoading: isLoadingDeliveryAvailability } = useGetDeliveryAvailabilityQuery();

  const alternateRoutes = [8, 20];
  const isAlternateSchedule = userProfile?.routeId && alternateRoutes.includes(userProfile.routeId);

  const getDisplayDay = (day: DeliveryDay): string => {
    if (isAlternateSchedule) {
        switch (day) {
            case 'Sunday':
                return 'Monday';
            case 'Wednesday':
                return 'Thursday';
            case 'Both':
                return 'Monday & Thursday';
            default:
                return day;
        }
    }
    return day;
  }  
  
  // --- Delivery Availability Logic (Using API Flags) ---
  const IS_SUNDAY_DELIVERY_OFFERED = deliveryAvailability?.isSundayDeliveryEnabled ?? true; 
  const IS_WEDNESDAY_DELIVERY_OFFERED = deliveryAvailability?.isWednesdayDeliveryEnabled ?? true;
  
  const isDeliveryDayAvailable = (internalDay: DeliveryDay): boolean => {
    // 1. Check Operational Availability
    if (internalDay === 'Sunday' && !IS_SUNDAY_DELIVERY_OFFERED) return false;
    if (internalDay === 'Wednesday' && !IS_WEDNESDAY_DELIVERY_OFFERED) return false;
    
    // 'Both' is unavailable if either single day is not offered
    if (internalDay === 'Both' && (!IS_SUNDAY_DELIVERY_OFFERED || !IS_WEDNESDAY_DELIVERY_OFFERED)) return false;

    return true;
  }
  // ----------------------------------------------------
  
  const internalSunday = 'Sunday' as DeliveryDay;
  const internalWednesday = 'Wednesday' as DeliveryDay;
  const internalBoth = 'Both' as DeliveryDay;

  // Helper function to handle shared button logic
  const renderDeliveryButton = (internalDay: DeliveryDay) => {
      const isAvailable = isDeliveryDayAvailable(internalDay);
      const isSelected = deliveryDays === internalDay;
      const displayDay = getDisplayDay(internalDay);

      // Reset selection if the currently selected day is now unavailable
      if (isSelected && !isAvailable) {
        dispatch(setDeliveryDays(null)); 
      }
      
      let unavailableText = '';
      if (!isAvailable) {
          if (internalDay === 'Both' && (!IS_SUNDAY_DELIVERY_OFFERED || !IS_WEDNESDAY_DELIVERY_OFFERED)) {
              unavailableText = '(Single Delivery Only)';
          } else {
              unavailableText = `(${displayDay} Unavailable)`;
          }
      }

      const buttonClass = `p-4 border-2 rounded-lg font-semibold transition-all duration-200 
        ${
          !isAvailable
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-70' // Disabled styles
            : isSelected
            ? 'bg-green-500 text-white border-green-500 scale-105 shadow-md'
            : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
        }`;

      return (
          <button
              key={internalDay}
              onClick={() => handleDeliverySelect(internalDay)}
              disabled={!isAvailable}
              className={buttonClass}
          >
              {displayDay} 
              {unavailableText && <span className="text-xs font-normal block mt-1">{unavailableText}</span>}
          </button>
      );
  };
  // -----------------------------------------------------------------------------------

  const handlePlanSelect = (selectedPlan: Package) => {
    dispatch(setPlan(selectedPlan));
  };

  const handleDeliverySelect = (day: DeliveryDay) => {
    if (!isDeliveryDayAvailable(day)) {
        return; 
    }
    dispatch(setDeliveryDays(day));
  };

  const isReady = plan && deliveryDays && !isLoadingProfile && !isLoadingDeliveryAvailability;
  
  // Calculate the order week
  const orderWeek = formatOrderWeek(getStartOfWeekDate());

  // Show loading state if any critical data is loading
  if (isLoading || isLoadingProfile || isLoadingDeliveryAvailability) {
    return (
        <div className="w-full max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl text-center">
            Loading order configuration...
        </div>
    );
  }

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
            {
              /* --- Display Order Week Here --- 
              <p className="text-xl font-semibold text-green-600 mt-2 mb-2">
                {orderWeek}
              </p>
              */
            }
             {/* Display schedule warning if on alternate route */}
            {isAlternateSchedule && (
                 <p className="text-sm text-red-500 font-medium">Note: Your route schedule is **Monday & Thursday** delivery.</p>
            )}
            <p className="text-gray-500 mt-2">Start by picking a plan that fits your lifestyle.</p>
        </div>

        {/* --- Plan Selection --- (Omitted for brevity) */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select a Plan</h2>
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

        {/* --- Delivery Day Selection (FIXED LAYOUT) --- */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Select Delivery Day(s)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Button 1: Sunday or Monday */}
              {renderDeliveryButton(internalSunday)}

              {/* Button 2: Wednesday or Thursday */}
              {renderDeliveryButton(internalWednesday)}

              {/* Button 3: Both or Monday & Thursday */}
              {renderDeliveryButton(internalBoth)}
              
          </div>
        </div>
        
        {/* --- Footer with Summary and Next Button --- */}
        <div className="mt-12 pt-6 border-t flex items-center justify-between">
            <div>
                {plan && (
                    <div className="text-sm text-gray-600">
                        <p><span className="font-bold">Your Plan:</span> {plan.name}</p>
                        <p>
                            <span className="font-bold">Delivery Day(s):</span> 
                            {deliveryDays ? ` ${getDisplayDay(deliveryDays)}` : ' Not selected'}
                        </p>
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
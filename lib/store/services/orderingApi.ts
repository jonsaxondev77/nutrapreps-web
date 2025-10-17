// jonsaxondev77/nutrapreps-web/nutrapreps-web-fecb3eb92c03118736e03ff3755198c8c330dc4e/lib/store/services/orderingApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Extra, MealOption, Order, OrderHistoryItem, SimpleOrder } from '@/types/ordering';
import { CartItem } from '../cartSlice';
import { PagedResponse } from '@/types/shared';
import { baseQuery, baseQueryWithRedirect } from './baseQuery';


// Utility to get the start of the current order cycle (next Sunday) as a Date object.
export const getStartOfWeekDate = (): Date => {
  const date = new Date();
  const today = date.getDay(); // 0 is Sunday
  
  // Calculate days to add to reach the next Sunday.
  // Original logic was implicit, this uses explicit logic to find the next Sunday.
  const daysUntilSunday = today === 0 ? 7 : 7 - today;
  
  date.setDate(date.getDate() + daysUntilSunday);
  date.setHours(0, 0, 0, 0);
  return date;
};

// Utility to get the ISO string for the backend API (replaces old local function)
export const getStartOfWeekISO = (): string => {
    return getStartOfWeekDate().toISOString();
};

export const formatOrderWeek = (date: Date): string => {
    // Includes weekday, month, and day for maximum clarity
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    // New message format
    return `Your delivery week starts ${date.toLocaleDateString('en-US', options)}`;
};



export const orderingApi = createApi({
  reducerPath: 'mealApi',
  baseQuery: (args, api, extraOptions) => {
    const { endpoint } = api;
    const publicEndpoints = ['getMeals', 'getAddons', 'getExtras'];
    if (publicEndpoints.includes(endpoint)) {
      return baseQuery(args, api, extraOptions);
    }
    return baseQueryWithRedirect(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getMeals: builder.query<MealOption[], void>({
      query: () => 'order/meals',
    }),
    getAddons: builder.query<MealOption[], void>({
      query: () => 'order/addons'
    }),
    getExtras: builder.query<Extra[], void>({
      query: () => 'order/extras'
    }),
    getStripeCustomerId: builder.query<{ stripeCustomerId: string }, void>({
      query: () => 'accounts/stripe-customer',
    }),
    placeOrder: builder.mutation<{ orderId: number }, CartItem[]>({
      query: (cartItems) => {
        // --- Data Transformation Logic ---
        const orderData = {
          Weekstart: getStartOfWeekISO(),
          OrderItems: cartItems.map(item => {
            const sundayMeals = item.meals.sunday.filter(Boolean).map(meal => ({ mealOptionId: meal!.id, day: 'Sunday', quantity: 1 }));
            const wednesdayMeals = item.meals.wednesday.filter(Boolean).map(meal => ({ mealOptionId: meal!.id, day: 'Wednesday', quantity: 1 }));

            const sundayAddons = item.addons.sunday.map(addon => ({ mealOptionId: addon.item.id, day: 'Sunday', quantity: addon.quantity }));
            const wednesdayAddons = item.addons.wednesday.map(addon => ({ mealOptionId: addon.item.id, day: 'Wednesday', quantity: addon.quantity }));

            return {
              planId: item.plan!.id,
              deliveryDay: item.deliveryDays,
              meals: [...sundayMeals, ...wednesdayMeals, ...sundayAddons, ...wednesdayAddons],
            };
          }),
          Extras: cartItems.flatMap(item => item.desserts).reduce((acc, dessert) => {
            const existing = acc.find(d => d.extraId === dessert.item.id.toString());
            if (existing) {
              existing.quantity += dessert.quantity;
            } else {
              acc.push({ extraId: dessert.item.id.toString(), quantity: dessert.quantity });
            }
            return acc;
          }, [] as { extraId: string; quantity: number }[]),
        };

        return {
          url: 'order/place',
          method: 'POST',
          body: orderData,
        };
      },
    }),
    getOrderBySessionId: builder.query<SimpleOrder, string>({
      queryFn: async (sessionId, _queryApi, _extraOptions, _fetchWithBQ) => {
        try {
          const response = await fetch('/api/get-order-by-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId }),
          });
          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }
          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: (error as Error).message } };
        }
      },
    }),
    getOrderHistory: builder.query<PagedResponse<OrderHistoryItem>, { pageNumber: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => `order/history?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    }),
    getDetailedOrder: builder.query({
      query: (id) => `order/details/${id}`,
    })
  }),
});

// Export hooks for usage in components
export const {
  useGetMealsQuery,
  useGetAddonsQuery,
  useGetExtrasQuery,
  useGetStripeCustomerIdQuery,
  useGetOrderBySessionIdQuery,
  usePlaceOrderMutation,
  useGetOrderHistoryQuery,
  useGetDetailedOrderQuery
} = orderingApi;
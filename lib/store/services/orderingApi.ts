import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Extra, MealOption, Order, OrderHistoryItem, SimpleOrder } from '@/types/ordering';
import { CartItem } from '../cartSlice';
import { PagedResponse } from '@/types/shared';
import { baseQuery, baseQueryWithRedirect } from './baseQuery';


const getNextSunday = () => {
  const date = new Date();
  const today = date.getDay();
  const daysUntilSunday = 7 - today;
  date.setDate(date.getDate() + daysUntilSunday);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
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
          Weekstart: getNextSunday(),
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
  useGetOrderHistoryQuery
} = orderingApi;

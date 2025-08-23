import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Extra, MealOption } from '@/types/ordering';
import { getSession } from 'next-auth/react';

export const orderingApi= createApi({
  reducerPath: 'mealApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session?.user.jwtToken) {
        headers.set("Authorization", `Bearer ${session.user.jwtToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getMeals: builder.query<MealOption[], void>({
      query: () => 'order/meals',
    }),
    getAddons: builder.query<MealOption[], void>({
      query: () => 'order/addons'
    }),
    getExtras: builder.query<Extra[], void>({
      query: () => 'order/extras'
    })
  }),
});

// Export hooks for usage in components
export const { useGetMealsQuery, useGetAddonsQuery, useGetExtrasQuery } = orderingApi;

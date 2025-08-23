import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Package } from '@/types/ordering';
import { getSession } from 'next-auth/react';

export const packageApi = createApi({
  reducerPath: 'packageApi',
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
    getPackages: builder.query<Package[], void>({
      query: () => 'packages/all',
    }),
  }),
});

export const { useGetPackagesQuery } = packageApi;

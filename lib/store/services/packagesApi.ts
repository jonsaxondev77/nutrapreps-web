import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Package } from '@/types/ordering';
import { getSession } from 'next-auth/react';
import { baseQueryWithRedirect } from './baseQuery';

export const packageApi = createApi({
  reducerPath: 'packageApi',
  baseQuery: baseQueryWithRedirect,
  endpoints: (builder) => ({
    getPackages: builder.query<Package[], void>({
      query: () => 'packages/all',
    }),
  }),
});

export const { useGetPackagesQuery } = packageApi;

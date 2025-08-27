import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

// --- Types for Address Lookup ---

export interface AddressSuggestion {
  address: string;
  url: string;
  id: string;
}

export interface AddressDetails {
  postcode: string;
  line_1: string;
  line_2: string;
  line_3: string;
  town_or_city: string;
  country: string;
  latitude: number;
  longitude: number;
}

// --- Address API Slice ---

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/addresslookup/`,
    prepareHeaders: async (headers) => {
      const session = await getSession();
      if (session?.user.jwtToken) {
        headers.set("Authorization", `Bearer ${session.user.jwtToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    autocompleteAddress: builder.query<AddressSuggestion[], string>({
      query: (term) => `autocomplete/${term}`,
    }),
    getAddressDetails: builder.query<AddressDetails, string>({
      query: (id) => `get/${id}`,
    }),
  }),
});

// Export the lazy query hooks for use in components
export const { useLazyAutocompleteAddressQuery, useLazyGetAddressDetailsQuery } = addressApi;

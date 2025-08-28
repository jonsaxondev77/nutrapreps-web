import { AuthResponse, RegisterRequest } from '@/types/accounts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';


interface AdditionalInfoRequest {
  addressLine1: string;
  addressLine2: string;
  city: string;
  postCode: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  allergies: string;
  safePlaceDeliveryInstructions: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/accounts/`,
    prepareHeaders: async (headers, { getState }) => {
      // Get the session and add the token to the headers if it exists.
      // This will apply to all endpoints in this API slice.
      const session = await getSession();
      if (session?.user.jwtToken) {
        headers.set("Authorization", `Bearer ${session.user.jwtToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // This mutation is for unauthenticated users, so it won't have a token to send.
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => {
        const backendPayload = {
          FirstName: userData.firstname,
          LastName: userData.lastname,
          Email: userData.email,
          Password: userData.password,
        };
        return {
          url: 'register',
          method: 'POST',
          body: backendPayload,
        };
      },
    }),
    // This mutation is also for unauthenticated users.
    confirmEmail: builder.mutation<AuthResponse, string>({
      query: (token) => ({
        url: `confirm-email?token=${encodeURIComponent(token)}`,
        method: 'GET',
      }),
    }),
    // This mutation requires the user to be logged in and will now send the auth header.
    completeProfile: builder.mutation<{ message: string }, AdditionalInfoRequest>({
      query: (additionalInfo) => ({
        url: 'complete-profile',
        method: 'POST',
        body: additionalInfo,
      }),
    }),
    getShippingDetails: builder.query<ShippingDetails, void>({
        query: () => 'accounts/shipping-details',
    }),
  }),
});

// Export the auto-generated hook for the 'register' mutation
export const { useRegisterMutation, useConfirmEmailMutation, useCompleteProfileMutation, useGetShippingDetailsQuery } = authApi;
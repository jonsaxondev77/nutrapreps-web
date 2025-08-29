import { AuthResponse, RegisterRequest, UpdateUserProfileRequest, UserProfile } from '@/types/accounts';
import { ShippingDetails } from '@/types/ordering';
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
  tagTypes: ['UserProfile'],
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
    getUserProfile: builder.query<UserProfile, void>({
      query: () => 'profile',
      providesTags: ['UserProfile']
    }),
    updateUserProfile: builder.mutation<void, Partial<UpdateUserProfileRequest>>({
        query: (profileData) => ({
            url: 'profile',
            method: 'PUT',
            body: profileData,
        }),
        invalidatesTags: ['UserProfile'],
    }),
  }),
});

// Export the auto-generated hook for the 'register' mutation
export const { useRegisterMutation, useConfirmEmailMutation, useCompleteProfileMutation, useGetShippingDetailsQuery, useGetUserProfileQuery, useUpdateUserProfileMutation } = authApi;
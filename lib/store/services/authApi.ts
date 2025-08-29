import { AuthResponse, ChangePasswordRequest, ForgotPasswordRequest, RegisterRequest, ResetPasswordRequest, UpdateUserProfileRequest, UserProfile } from '@/types/accounts';
import { ShippingDetails } from '@/types/ordering';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery, baseQueryWithRedirect } from './baseQuery';


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
  baseQuery: (args, api, extraOptions) => {
    const { endpoint } = api;
    // Define public endpoints that should not use the redirect logic
    const publicEndpoints = ['register', 'confirmEmail', 'forgotPassword', 'resetPassword'];
    if (publicEndpoints.includes(endpoint)) {
      return baseQuery(args, api, extraOptions);
    }
    return baseQueryWithRedirect(args, api, extraOptions);
  },
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
          url: 'accounts/register',
          method: 'POST',
          body: backendPayload,
        };
      },
    }),
    // This mutation is also for unauthenticated users.
    confirmEmail: builder.mutation<AuthResponse, string>({
      query: (token) => ({
        url: `accounts/confirm-email?token=${encodeURIComponent(token)}`,
        method: 'GET',
      }),
    }),
    // This mutation requires the user to be logged in and will now send the auth header.
    completeProfile: builder.mutation<{ message: string }, AdditionalInfoRequest>({
      query: (additionalInfo) => ({
        url: 'accounts/complete-profile',
        method: 'POST',
        body: additionalInfo,
      }),
    }),
    getShippingDetails: builder.query<ShippingDetails, void>({
      query: () => 'accounts/shipping-details',
    }),
    getUserProfile: builder.query<UserProfile, void>({
      query: () => 'accounts/profile',
      providesTags: ['UserProfile']
    }),
    updateUserProfile: builder.mutation<void, Partial<UpdateUserProfileRequest>>({
      query: (profileData) => ({
        url: 'accounts/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (credentials) => ({
        url: 'accounts/forgot-password',
        method: 'POST',
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (credentials) => ({
        url: 'accounts/reset-password',
        method: 'POST',
        body: credentials,
      }),
    }),
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (credentials) => ({
        url: 'accounts/change-password',
        method: 'PUT',
        body: credentials,
      }),
    }),
  }),
});

// Export the auto-generated hook for the 'register' mutation
export const {
  useRegisterMutation,
  useConfirmEmailMutation,
  useCompleteProfileMutation,
  useGetShippingDetailsQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation
} = authApi;
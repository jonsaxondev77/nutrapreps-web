import { AuthResponse, RegisterRequest } from '@/types/accounts';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


// Define an API slice using RTK Query
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/accounts/` }),
  endpoints: (builder) => ({
    // Define the 'register' mutation
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
  }),
});

// Export the auto-generated hook for the 'register' mutation
export const { useRegisterMutation } = authApi;
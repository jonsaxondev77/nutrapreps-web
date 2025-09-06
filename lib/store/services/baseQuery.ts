import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession, signOut } from 'next-auth/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

export const baseQuery = fetchBaseQuery({
  baseUrl: '/api/proxy',
  prepareHeaders: async (headers) => {
    const session = await getSession();
    if (session?.user.jwtToken) {
      headers.set('Authorization', `Bearer ${session.user.jwtToken}`);
    }
    return headers;
  },
});

export const baseQueryWithRedirect: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    signOut({ callbackUrl: '/signin' });
  }
  return result;
};
import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormResponse {
  message: string;
}

export const contactApi = createApi({
  reducerPath: 'contactApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    sendContactForm: builder.mutation<ContactFormResponse, ContactFormRequest>({
      query: (formData) => ({
        url: 'api/contact/send', // This calls your C# backend
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useSendContactFormMutation } = contactApi;
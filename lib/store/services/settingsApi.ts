// src/lib/services/settingsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRedirect } from "./baseQuery";

interface OrderingStatus {
    isOrderingEnabled: boolean;
}

interface UpdateStatusRequest {
    isOrderingEnabled: boolean;
}

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithRedirect,
    tagTypes: ["Settings"],
    endpoints: (builder) => ({
        getOrderingStatus: builder.query<OrderingStatus, void>({
            query: () => "settings/ordering-status",
            providesTags: ["Settings"],
        })
    }),
});

export const { useGetOrderingStatusQuery } = settingsApi;
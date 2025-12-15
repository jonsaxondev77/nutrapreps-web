// src/lib/services/settingsApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRedirect } from "./baseQuery";

interface OrderingStatus {
    isOrderingEnabled: boolean;
}

interface UpdateStatusRequest {
    isOrderingEnabled: boolean;
}

interface DeliveryAvailability {
    isSundayDeliveryEnabled: boolean;
    isWednesdayDeliveryEnabled: boolean;
}

export const settingsApi = createApi({
    reducerPath: "settingsApi",
    baseQuery: baseQueryWithRedirect,
    tagTypes: ["Settings"],
    endpoints: (builder) => ({
        getOrderingStatus: builder.query<OrderingStatus, void>({
            query: () => "settings/ordering-status",
            providesTags: ["Settings"],
        }),
        getDeliveryAvailability: builder.query<DeliveryAvailability, void>({
            query: () => "settings/delivery-availability",
            providesTags: ["Settings"],
        }),
    }),
});

export const { useGetOrderingStatusQuery, useGetDeliveryAvailabilityQuery } = settingsApi;
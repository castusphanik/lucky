import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithInterceptor } from './apiInterceptor';

const geofencesService = createApi({
    reducerPath: 'geofences',
    baseQuery: baseQueryWithInterceptor,
    keepUnusedDataFor: 0, // Disable caching
    endpoints: builder => ({
        createGeoFence: builder.mutation({
            query: (body) => ({
                url: `/geoFence`,
                method: "POST",
                body,
            }),
        }),
        getGeofences: builder.query({
            query: ({ custId }) => `/geoFence/custId/${custId}`,
        }),
        getGeofenceById: builder.query({
            query: ({ geofenceId }) => `/geoFence/${geofenceId}`,
        }),
        updateGeofence: builder.mutation({
            query: ({ geofenceId, ...body }) => ({
                url: `/geoFence/${geofenceId}`,
                method: 'PATCH',
                body,
            }),
        }),
        updateGeofenceStatus: builder.mutation({
            query: ({ geofenceId }) => ({
                url: `/geoFence/toggle-status/${geofenceId}`,
                method: 'PATCH',
            }),
        }),
        getTagLookup: builder.query<any, void>({
            query: () => `/tagLookup`,
        }),
    }),
});

export const {
    useCreateGeoFenceMutation,
    useLazyGetGeofencesQuery,
    useLazyGetGeofenceByIdQuery,
    useUpdateGeofenceMutation,
    useUpdateGeofenceStatusMutation,
    useGetTagLookupQuery
} = geofencesService;
export default geofencesService;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { LocationDTO } from '../types/types';

export const locationApi = createApi({
    reducerPath: 'locationApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/locations' }),
    tagTypes: ['Location'],

    endpoints: (builder) => ({
        getAllLocations: builder.query<LocationDTO[], void>({
            query: () => `/`,
            providesTags: ['Location'],
        }),

        getLocationById: builder.query<LocationDTO, number>({
            query: (id) => `/${id}`,
        }),

        createLocation: builder.mutation<LocationDTO, LocationDTO>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Location'],
        }),

        updateLocation: builder.mutation<LocationDTO, LocationDTO>({
            query: (body) => ({
                url: `/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ['Location'],
        }),

        deleteLocation: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Location'],
        }),
    }),
});

export const {
    useGetAllLocationsQuery,
    useGetLocationByIdQuery,
    useCreateLocationMutation,
    useUpdateLocationMutation,
    useDeleteLocationMutation,
} = locationApi;

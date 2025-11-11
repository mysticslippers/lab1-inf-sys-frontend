import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Location } from '../types/types';

export const locationApi = createApi({
    reducerPath: 'locationApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/locations' }),
    tagTypes: ['Location'],

    endpoints: (builder) => ({
        getAllLocations: builder.query<Location[], void>({
            query: () => `/`,
            providesTags: ['Location'],
        }),

        getLocationById: builder.query<Location, number>({
            query: (id) => `/${id}`,
        }),

        createLocation: builder.mutation<Location, Omit<Location, 'id'>>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Location'],
        }),

        updateLocation: builder.mutation<Location, { id: number; data: Location }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
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

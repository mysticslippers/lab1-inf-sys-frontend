import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Coordinates } from '../types/types.ts';

export const coordinatesApi = createApi({
    reducerPath: 'coordinatesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/coordinates' }),
    tagTypes: ['Coordinates'],

    endpoints: (builder) => ({
        getAllCoordinates: builder.query<Coordinates[], void>({
            query: () => `/`,
            providesTags: ['Coordinates'],
        }),

        getCoordinatesById: builder.query<Coordinates, number>({
            query: (id) => `/${id}`,
        }),

        createCoordinates: builder.mutation<Coordinates, Omit<Coordinates, 'id'>>({
            query: (body) => ({
                url: `/`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Coordinates'],
        }),

        updateCoordinates: builder.mutation<Coordinates, { id: number; data: Coordinates }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Coordinates'],
        }),

        deleteCoordinates: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Coordinates'],
        }),
    }),
});

export const {
    useGetAllCoordinatesQuery,
    useGetCoordinatesByIdQuery,
    useCreateCoordinatesMutation,
    useUpdateCoordinatesMutation,
    useDeleteCoordinatesMutation,
} = coordinatesApi;

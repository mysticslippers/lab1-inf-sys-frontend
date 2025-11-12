import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CoordinatesDTO } from '../types/types.ts';

export const coordinatesApi = createApi({
    reducerPath: 'coordinatesApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/coordinates' }),
    tagTypes: ['Coordinates'],

    endpoints: (builder) => ({
        getAllCoordinates: builder.query<CoordinatesDTO[], void>({
            query: () => `/`,
            providesTags: ['Coordinates'],
        }),

        getCoordinatesById: builder.query<CoordinatesDTO, number>({
            query: (id) => `/${id}`,
        }),

        createCoordinates: builder.mutation<CoordinatesDTO, CoordinatesDTO>({
            query: (body) => ({
                url: `/`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Coordinates"],
        }),

        updateCoordinates: builder.mutation<CoordinatesDTO, CoordinatesDTO>({
            query: (body) => ({
                url: `/${body.id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Coordinates"],
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

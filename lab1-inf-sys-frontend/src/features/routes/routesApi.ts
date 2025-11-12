import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Route, PageResponse } from '../types/types.ts';

const BASE_URL = 'http://localhost:8080/api';

export const routesApi = createApi({
    reducerPath: 'routesApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    tagTypes: ['Routes'],

    endpoints: (builder) => ({
        fetchRoutes: builder.query<PageResponse<Route>, { page: number; size: number }>({
            query: ({ page, size }) => `/routes?page=${page}&size=${size}`,
            providesTags: ['Routes'],
        }),

        getRouteById: builder.query<Route, number>({
            query: (id) => `/routes/${id}`,
        }),

        createRoute: builder.mutation<Route, Omit<Route, 'id' | 'creationDate'>>({
            query: (body) => ({
                url: `/routes`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Routes'],
        }),

        updateRoute: builder.mutation<Route, Route>({
            query: (route) => ({
                url: `/routes/${route.id}`,
                method: 'PUT',
                body: route,
            }),
            invalidatesTags: ['Routes'],
        }),

        deleteRoute: builder.mutation<void, number>({
            query: (id) => ({
                url: `/routes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Routes'],
        }),

        getMinDistanceRoute: builder.query<Route, void>({
            query: () => `/routes/min-distance`,
        }),

        groupByRating: builder.query<Record<number, number>, void>({
            query: () => `/routes/group-by-rating`,
        }),

        getUniqueRatings: builder.query<number[], void>({
            query: () => `/routes/unique-ratings`,
        }),

        findRoutesBetween: builder.query<Route[], { fromId: number; toId: number; sortBy: string }>({
            query: ({ fromId, toId, sortBy }) =>
                `/routes/between?fromId=${fromId}&toId=${toId}&sortBy=${sortBy}`,
        }),

        addRouteBetween: builder.mutation<Route, { fromId: number; toId: number; body: any }>({
            query: ({ fromId, toId, body }) => ({
                url: `/routes/between?fromId=${fromId}&toId=${toId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Routes'],
        })
    }),
});

export const {
    useFetchRoutesQuery,
    useGetRouteByIdQuery,
    useCreateRouteMutation,
    useUpdateRouteMutation,
    useDeleteRouteMutation,

    useGetMinDistanceRouteQuery,
    useGroupByRatingQuery,
    useGetUniqueRatingsQuery,
    useFindRoutesBetweenQuery,
    useAddRouteBetweenMutation,
} = routesApi;

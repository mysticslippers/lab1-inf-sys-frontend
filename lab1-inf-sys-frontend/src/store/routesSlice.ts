import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import api from "../api/axios";
import type {RouteDTO} from "../types/types.ts";

type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
};

interface RoutesState {
    page: Page<RouteDTO> | null;
    loading: boolean;
    error?: string | null;
    selected?: RouteDTO | null;
}

const initialState: RoutesState = {
    page: null,
    loading: false,
    error: null,
    selected: null,
};

export const fetchRoutes = createAsyncThunk(
    "routes/fetch",
    async ({ page = 0, size = 10 }: { page?: number; size?: number }) => {
        const resp = await api.get<Page<RouteDTO>>(`/api/routes?page=${page}&size=${size}`);
        return resp.data;
    }
);

export const fetchRouteById = createAsyncThunk(
    "routes/fetchById",
    async (id: number) => {
        const resp = await api.get<RouteDTO>(`/api/routes/${id}`);
        return resp.data;
    }
);

export const createRoute = createAsyncThunk(
    "routes/create",
    async (dto: RouteDTO) => {
        const resp = await api.post<RouteDTO>(`/api/routes`, dto);
        return resp.data;
    }
);

export const updateRoute = createAsyncThunk(
    "routes/update",
    async ({ id, dto }: { id: number; dto: RouteDTO }) => {
        const resp = await api.put<RouteDTO>(`/api/routes/${id}`, dto);
        return resp.data;
    }
);

export const deleteRoute = createAsyncThunk(
    "routes/delete",
    async (id: number) => {
        await api.delete(`/api/routes/${id}`);
        return id;
    }
);

const slice = createSlice({
    name: "routes",
    initialState,
    reducers: {
        upsertRoute(state, action: PayloadAction<RouteDTO>) {
            const route = action.payload;
            if (!state.page) return;
            const idx = state.page.content.findIndex(r => r.id === route.id);
            if (idx >= 0) state.page.content[idx] = route;
            else state.page.content.unshift(route);
        },
        removeRoute(state, action: PayloadAction<number>) {
            const id = action.payload;
            if (!state.page) return;
            state.page.content = state.page.content.filter(r => r.id !== id);
        },
        setSelected(state, action: PayloadAction<RouteDTO | null>) {
            state.selected = action.payload;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchRoutes.pending, state => { state.loading = true; state.error = null; })
            .addCase(fetchRoutes.fulfilled, (state, action) => { state.loading = false; state.page = action.payload; })
            .addCase(fetchRoutes.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? "Error"; })
            .addCase(fetchRouteById.fulfilled, (state, action) => { state.selected = action.payload; })
            .addCase(createRoute.fulfilled, (state, action) => {
                if (state.page) state.page.content.unshift(action.payload);
            })
            .addCase(updateRoute.fulfilled, (state, action) => {
                if (!state.page) return;
                const idx = state.page.content.findIndex(r => r.id === action.payload.id);
                if (idx >= 0) state.page.content[idx] = action.payload;
            })
            .addCase(deleteRoute.fulfilled, (state, action) => {
                const id = action.payload;
                if (!state.page) return;
                state.page.content = state.page.content.filter(r => r.id !== id);
            });
    }
});

export const { upsertRoute, removeRoute, setSelected } = slice.actions;
export default slice.reducer;

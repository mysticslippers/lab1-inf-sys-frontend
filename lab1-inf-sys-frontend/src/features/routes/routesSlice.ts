import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface RoutesUIState {
    selectedRouteId: number | null;
    page: number;
    pageSize: number;
}

const initialState: RoutesUIState = {
    selectedRouteId: null,
    page: 1,
    pageSize: 10,
};

const routesSlice = createSlice({
    name: 'routesUI',
    initialState,
    reducers: {
        setSelectedRoute(state, action: PayloadAction<number | null>) {
            state.selectedRouteId = action.payload;
        },
        setPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pageSize = action.payload;
        },
    },
});

export const { setSelectedRoute, setPage, setPageSize } = routesSlice.actions;
export default routesSlice.reducer;

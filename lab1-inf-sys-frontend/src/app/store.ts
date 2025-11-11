import { configureStore } from '@reduxjs/toolkit';

import routesUIReducer from '../features/routes/routesSlice';
import wsReducer from '../features/websocket/wsSlice';

import { routesApi } from '../features/routes/routesApi';
import { coordinatesApi } from '../features/coordinates/coordinatesApi';
import { locationApi } from '../features/location/locationApi';

export const store = configureStore({
    reducer: {
        routesUI: routesUIReducer,
        websocket: wsReducer,
        [routesApi.reducerPath]: routesApi.reducer,
        [coordinatesApi.reducerPath]: coordinatesApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(routesApi.middleware)
            .concat(coordinatesApi.middleware)
            .concat(locationApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

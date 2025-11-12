import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Route } from "../types/types";
import type { CoordinatesDTO } from "../types/types";
import type { LocationDTO } from "../types/types";

interface WSEventPayload {
    entity: "routes" | "coordinates" | "locations";
    action: "create" | "update" | "delete";
    dto: Route | CoordinatesDTO | LocationDTO;
}

interface WSState {
    connected: boolean;
    lastEvent: WSEventPayload | null;
}

const initialState: WSState = {
    connected: false,
    lastEvent: null,
};

export const wsSlice = createSlice({
    name: "ws",
    initialState,
    reducers: {
        wsConnected(state) {
            state.connected = true;
        },
        wsDisconnected(state) {
            state.connected = false;
        },
        wsEventReceived(state, action: PayloadAction<WSEventPayload>) {
            state.lastEvent = action.payload;
        },
    },
});

export const { wsConnected, wsDisconnected, wsEventReceived } = wsSlice.actions;
export default wsSlice.reducer;

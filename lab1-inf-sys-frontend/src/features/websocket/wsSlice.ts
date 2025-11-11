import { createSlice } from '@reduxjs/toolkit';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { routesApi } from '../routes/routesApi';
import type { AppDispatch } from '../../app/store';

interface WebSocketState {
    connected: boolean;
}

const initialState: WebSocketState = {
    connected: false,
};

const wsSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        setConnected(state, action) {
            state.connected = action.payload;
        },
    },
});

export const { setConnected } = wsSlice.actions;
export default wsSlice.reducer;


export const initWebSocket = () => (dispatch: AppDispatch) => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 3000,
    });

    client.onConnect = () => {
        dispatch(setConnected(true));

        client.subscribe('/topic/routes', () => {
            dispatch(routesApi.util.invalidateTags(['Routes']));
        });
    };

    client.onStompError = () => {
        dispatch(setConnected(false));
    };

    client.activate();
};

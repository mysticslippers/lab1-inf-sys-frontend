import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { store } from "../store";
import { upsertRoute, removeRoute } from "../store/routesSlice";
import type {RouteDTO} from "../types/types.ts";

let client: Client | null = null;

export function connectWebSocket() {
    if (client) return;
    client = new Client({
        webSocketFactory: () => new SockJS((import.meta.env.VITE_API_BASE_URL ?? "") + "/ws"),
        reconnectDelay: 5000,
        debug: () => {}
    });

    client.onConnect = () => {
        client!.subscribe("/topic/routes", (msg: IMessage) => {
            try {
                const payload = JSON.parse(msg.body);
                if (payload && payload.type && payload.data) {
                    if (payload.type.toUpperCase() === "UPSERT") store.dispatch(upsertRoute(payload.data as RouteDTO));
                    else if (payload.type.toUpperCase() === "DELETE") store.dispatch(removeRoute(payload.data as number));
                } else if (payload && payload.id) {
                    store.dispatch(upsertRoute(payload as RouteDTO));
                }
            } catch (e) {
                console.warn("WS parse error", e);
            }
        });
    };

    client.onStompError = frame => {
        console.error("Stomp error", frame);
    };

    client.activate();
}

export function disconnectWebSocket() {
    if (client) {
        client.deactivate();
        client = null;
    }
}

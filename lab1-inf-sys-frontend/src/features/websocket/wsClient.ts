import { Client } from "@stomp/stompjs";
import { store } from "../../app/store";
import { wsConnected, wsDisconnected, wsEventReceived } from "./wsSlice";
import { routesApi } from "../routes/routesApi";
import { coordinatesApi } from "../coordinates/coordinatesApi";
import { locationApi } from "../location/locationApi";

export const initWebSocket = () => {
    const client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        reconnectDelay: 2000,
    });

    client.onConnect = () => {
        store.dispatch(wsConnected());

        client.subscribe("/topic/events", (message) => {
            const event = JSON.parse(message.body);

            store.dispatch(wsEventReceived(event));

            switch (event.entity) {
                case "routes":
                    store.dispatch(routesApi.util.invalidateTags(["Routes"]));
                    break;
                case "coordinates":
                    store.dispatch(coordinatesApi.util.invalidateTags(["Coordinates"]));
                    break;
                case "locations":
                    store.dispatch(locationApi.util.invalidateTags(["Location"]));
                    break;
            }
        });
    };

    client.onDisconnect = () => {
        store.dispatch(wsDisconnected());
    };

    client.activate();
};

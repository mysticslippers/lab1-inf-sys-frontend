import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useEffect } from "react";
import { initWebSocket } from "./features/websocket/wsClient";

export default function App() {
    useEffect(() => {
        initWebSocket();
    }, []);

    return <RouterProvider router={router} />;
}

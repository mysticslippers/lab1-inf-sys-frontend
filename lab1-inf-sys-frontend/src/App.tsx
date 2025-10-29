import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import RoutesTable from "./components/RoutesTable";
import SpecialPanel from "./components/SpecialPanel";
import { connectWebSocket, disconnectWebSocket } from "./services/ws";

const App: React.FC = () => {
    useEffect(() => {
        connectWebSocket();
        return () => disconnectWebSocket();
    }, []);

    return (
        <Provider store={store}>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <RoutesTable />
                    </div>
                    <div className="col-span-1">
                        <SpecialPanel />
                    </div>
                </div>
            </div>
        </Provider>
    );
};

export default App;

import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import HomePage from "../pages/Home/HomePage";
import CreateRoutePage from "../pages/CreateRoute/CreateRoutePage";
import RouteDetailsPage from "../pages/RouteDetails/RouteDetailsPage";
import UpdateRoutePage from "../pages/UpdateRoute/UpdateRoutePage";
import OperationsPage from "../pages/Operations/OperationsPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "create", element: <CreateRoutePage /> },
            { path: "route/:id", element: <RouteDetailsPage /> },
            { path: "update/:id", element: <UpdateRoutePage /> },
            { path: "operations", element: <OperationsPage /> },
        ],
    },
]);

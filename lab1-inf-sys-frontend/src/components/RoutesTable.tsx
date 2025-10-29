import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRoutes, fetchRouteById, deleteRoute, setSelected } from "../store/routesSlice";
import RouteForm from "./RouteForm";
import type {RouteDTO} from "../types/types.ts";

const RoutesTable: React.FC = () => {
    const dispatch = useAppDispatch();
    const { page, loading} = useAppSelector(s => s.routes);
    const [pageIndex, setPageIndex] = useState(0);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<RouteDTO | null>(null);

    useEffect(() => {
        dispatch(fetchRoutes({ page: pageIndex, size: 10 }));
    }, [dispatch, pageIndex]);

    function openEdit(route: RouteDTO) {
        setEditing(route);
        setFormOpen(true);
        dispatch(setSelected(route));
    }

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
        dispatch(setSelected(null));
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Маршруты</h2>
                <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={openCreate}>Добавить</button>
            </div>

            <div className="overflow-auto border rounded">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">From</th>
                        <th className="p-2">To</th>
                        <th className="p-2">Distance</th>
                        <th className="p-2">Rating</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading && <tr><td colSpan={8} className="p-4">Загрузка...</td></tr>}
                    {page?.content.map(r => (
                        <tr key={r.id} className="border-t">
                            <td className="p-2">{r.id}</td>
                            <td className="p-2">{r.name}</td>
                            <td className="p-2">{r.from?.id ?? "—"}</td>
                            <td className="p-2">{r.to?.id ?? "—"}</td>
                            <td className="p-2">{r.distance ?? "—"}</td>
                            <td className="p-2">{r.rating}</td>
                            <td className="p-2">{r.creationDate ? new Date(r.creationDate).toLocaleString() : ""}</td>
                            <td className="p-2">
                                <button className="mr-2 px-2 py-1 border rounded" onClick={() => dispatch(fetchRouteById(r.id!))}>Просмотр</button>
                                <button className="mr-2 px-2 py-1 border rounded" onClick={() => openEdit(r)}>Ред.</button>
                                <button className="px-2 py-1 border rounded" onClick={() => dispatch(deleteRoute(r.id!))}>Удал.</button>
                            </td>
                        </tr>
                    ))}
                    {!loading && (page?.content.length ?? 0) === 0 && <tr><td colSpan={8} className="p-4">Маршрутов нет</td></tr>}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-3">
                <div>Страница { (page?.number ?? 0) + 1 } из { page?.totalPages ?? 1 }</div>
                <div>
                    <button className="px-2 py-1 mr-2" onClick={() => setPageIndex(p => Math.max(0, p - 1))}>Prev</button>
                    <button className="px-2 py-1" onClick={() => setPageIndex(p => (page && p + 1 < page.totalPages ? p + 1 : p))}>Next</button>
                </div>
            </div>

            {isFormOpen && <RouteForm initial={editing ?? undefined} onClose={() => { setFormOpen(false); dispatch(fetchRoutes({ page: pageIndex, size: 10 })); }} />}
        </div>
    );
};

export default RoutesTable;

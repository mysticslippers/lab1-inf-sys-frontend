import React from 'react';
import type { RouteDTO } from '../../types/route';

interface Props {
    routes: RouteDTO[];
    onEdit: (route: RouteDTO) => void;
    onDelete: (route: RouteDTO) => void;
}

const RoutesTable: React.FC<Props> = ({ routes, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-950/60">
                <tr>
                    <th className="px-3 py-2 text-left font-medium">ID</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Rating</th>
                    <th className="px-3 py-2 text-left font-medium">Distance</th>
                    <th className="px-3 py-2 text-left font-medium">From</th>
                    <th className="px-3 py-2 text-left font-medium">To</th>
                    <th className="px-3 py-2 text-left font-medium">Created</th>
                    <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
                </thead>
                <tbody>
                {routes.map((route) => (
                    <tr
                        key={route.id}
                        className="border-t border-slate-800 hover:bg-slate-800/50"
                    >
                        <td className="px-3 py-2">{route.id}</td>
                        <td className="px-3 py-2">{route.name}</td>
                        <td className="px-3 py-2">{route.rating}</td>
                        <td className="px-3 py-2">
                            {route.distance != null ? route.distance : '—'}
                        </td>
                        <td className="px-3 py-2 text-xs">
                            x: {route.from.x}, y: {route.from.y}, z: {route.from.z}
                        </td>
                        <td className="px-3 py-2 text-xs">
                            x: {route.to.x}, y: {route.to.y}, z: {route.to.z}
                        </td>
                        <td className="px-3 py-2 text-xs">
                            {route.creationDate
                                ? new Date(route.creationDate).toLocaleString()
                                : '—'}
                        </td>
                        <td className="px-3 py-2 text-right space-x-2">
                            <button
                                className="rounded-lg border border-emerald-500/60 px-2 py-1 text-xs hover:bg-emerald-500/10"
                                onClick={() => onEdit(route)}
                            >
                                Изменить
                            </button>
                            <button
                                className="rounded-lg border border-rose-500/60 px-2 py-1 text-xs text-rose-300 hover:bg-rose-500/10"
                                onClick={() => onDelete(route)}
                            >
                                Удалить
                            </button>
                        </td>
                    </tr>
                ))}

                {routes.length === 0 && (
                    <tr>
                        <td
                            colSpan={8}
                            className="px-3 py-6 text-center text-slate-400"
                        >
                            Маршрутов пока нет
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default RoutesTable;

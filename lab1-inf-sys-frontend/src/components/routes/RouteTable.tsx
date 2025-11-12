import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import type { Route } from "../../features/types/types";

interface RouteTableProps {
    routes: Route[];
    isLoading: boolean;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const RouteTable: React.FC<RouteTableProps> = ({
                                                          routes,
                                                          isLoading,
                                                          onView,
                                                          onEdit,
                                                          onDelete,
                                                      }) => {
    if (isLoading)
        return <div className="text-center py-6">Загрузка маршрутов...</div>;
    if (!routes.length)
        return (
            <div className="text-center py-6 text-gray-500">Нет доступных маршрутов</div>
        );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
            <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
                <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-xs">
                <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Название</th>
                    <th className="px-4 py-3">Расстояние</th>
                    <th className="px-4 py-3">Рейтинг</th>
                    <th className="px-4 py-3 text-right">Действия</th>
                </tr>
                </thead>
                <tbody>
                {routes.map((route) => (
                    <tr
                        key={route.id}
                        className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        <td className="px-4 py-2">{route.id}</td>
                        <td className="px-4 py-2">{route.name}</td>
                        <td className="px-4 py-2">{route.distance ?? "—"}</td>
                        <td className="px-4 py-2">{route.rating}</td>

                        <td className="px-4 py-2 flex justify-end gap-2">
                            <button
                                className="p-1 hover:text-blue-500"
                                title="Детали"
                                onClick={() => onView(route.id)}
                            >
                                <EyeIcon className="h-5" />
                            </button>

                            <button
                                className="p-1 hover:text-yellow-500"
                                title="Редактировать"
                                onClick={() => onEdit(route.id)}
                            >
                                <PencilIcon className="h-5" />
                            </button>

                            <button
                                className="p-1 hover:text-red-500"
                                title="Удалить"
                                onClick={() => onDelete(route.id)}
                            >
                                <TrashIcon className="h-5" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

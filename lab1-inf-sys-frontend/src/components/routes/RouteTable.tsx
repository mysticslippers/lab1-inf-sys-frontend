import { useFetchRoutesQuery, useDeleteRouteMutation } from "../../features/routes/routesApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPage } from "../../features/routes/routesSlice";
import { PencilIcon, EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export const RouteTable = () => {
    const dispatch = useAppDispatch();
    const page = useAppSelector((state) => state.routesUI.page);
    const pageSize = useAppSelector((state) => state.routesUI.pageSize);

    // @ts-ignore
    const { data, isLoading, isError } = useFetchRoutesQuery({ page: page - 1, size: pageSize });
    const [deleteRoute] = useDeleteRouteMutation();
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

    if (isLoading) return <div className="text-center py-6">Загрузка...</div>;
    if (isError) return <div className="text-red-500 text-center py-6">Ошибка загрузки данных</div>;
    if (!data) return null;

    const handleDelete = async () => {
        if (deleteConfirmId !== null) {
            await deleteRoute(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="w-full">
            <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
                <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">From</th>
                        <th className="px-4 py-3">To</th>
                        <th className="px-4 py-3">Distance</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.content.map((route) => (
                        <tr
                            key={route.id}
                            className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            <td className="px-4 py-2">{route.id}</td>
                            <td className="px-4 py-2">{route.name}</td>
                            <td className="px-4 py-2">{`${route.from.x}, ${route.from.y}, ${route.from.z}`}</td>
                            <td className="px-4 py-2">{`${route.to.x}, ${route.to.y}, ${route.to.z}`}</td>
                            <td className="px-4 py-2">{route.distance ?? "-"}</td>
                            <td className="px-4 py-2">{route.rating}</td>

                            <td className="px-4 py-2 flex justify-end gap-2">
                                <button
                                    className="p-1 hover:text-blue-500"
                                    title="Details"
                                    onClick={() => console.log("open details", route.id)}
                                >
                                    <EyeIcon className="h-5" />
                                </button>

                                <button
                                    className="p-1 hover:text-yellow-500"
                                    title="Edit"
                                    onClick={() => console.log("open edit", route.id)}
                                >
                                    <PencilIcon className="h-5" />
                                </button>

                                <button
                                    className="p-1 hover:text-red-500"
                                    title="Delete"
                                    onClick={() => setDeleteConfirmId(route.id)}
                                >
                                    <TrashIcon className="h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-4 py-4">
                <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
                    disabled={page <= 1}
                    onClick={() => dispatch(setPage(page - 1))}>
                </button>

                <span className="text-sm opacity-80">Страница {page} из {data.totalPages}</span>

                <button
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md"
                    disabled={page >= data.totalPages}
                    onClick={() => dispatch(setPage(page + 1))}>
                </button>
            </div>

            {deleteConfirmId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                        <p className="mb-4">Удалить маршрут #{deleteConfirmId}?</p>

                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                onClick={handleDelete}>
                                Удалить
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                                onClick={() => setDeleteConfirmId(null)}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

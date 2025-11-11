import { useParams, useNavigate } from "react-router-dom";
import { useGetRouteByIdQuery } from "../../features/routes/routesApi";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import React from "react";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
        <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
        <span>{children}</span>
    </div>
);

export default function RouteDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetRouteByIdQuery(Number(id));

    if (isLoading) return <div className="text-center py-6">Загрузка...</div>;
    if (isError || !data) return <div className="text-center text-red-500 py-6">Ошибка загрузки</div>;

    const route = data;

    return (
        <div className="max-w-2xl mx-auto">
            <button
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
                onClick={() => navigate("/")}>
                <ArrowLeftIcon className="h-4" />
                Назад
            </button>

            <div className="mt-4 p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">
                    Маршрут №{route.id} — {route.name}
                </h2>

                <Field label="Дата создания">{route.creationDate}</Field>
                <Field label="Distance">{route.distance ?? "—"}</Field>
                <Field label="Rating">{route.rating}</Field>

                <h3 className="text-md font-semibold mt-4 mb-1">From</h3>
                <Field label="x">{route.from.x}</Field>
                <Field label="y">{route.from.y}</Field>
                <Field label="z">{route.from.z}</Field>

                <h3 className="text-md font-semibold mt-4 mb-1">To</h3>
                <Field label="x">{route.to.x}</Field>
                <Field label="y">{route.to.y}</Field>
                <Field label="z">{route.to.z}</Field>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => navigate(`/update/${route.id}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition">
                    <PencilIcon className="h-5" />
                    Редактировать
                </button>
            </div>
        </div>
    );
}

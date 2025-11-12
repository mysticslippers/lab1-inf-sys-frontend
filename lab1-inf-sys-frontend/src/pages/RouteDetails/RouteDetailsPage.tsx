import { useNavigate, useParams } from "react-router-dom";
import { useGetRouteByIdQuery } from "../../features/routes/routesApi";
import { Button } from "../../components/ui/Button";
import { ArrowLeftIcon, PencilIcon } from "@heroicons/react/24/outline";
import React from "react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="p-5 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        {children}
    </section>
);

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span>{value}</span>
    </div>
);

export default function RouteDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetRouteByIdQuery(Number(id));

    if (isLoading) return <div className="text-center py-6">Загрузка...</div>;
    if (isError || !data) return <div className="text-center text-red-500 py-6">Ошибка загрузки данных</div>;

    const route = data;

    return (
        <div className="max-w-3xl mx-auto space-y-6">

            <button
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500"
                onClick={() => navigate("/")}
            >
                <ArrowLeftIcon className="h-4" />
                Назад
            </button>

            <h2 className="text-2xl font-bold">
                Маршрут #{route.id}: {route.name}
            </h2>

            <Section title="Основная информация">
                <Field label="Дата создания" value={route.creationDate} />
                <Field label="Дистанция" value={route.distance ?? "—"} />
                <Field label="Оценка (rating)" value={route.rating} />
            </Section>

            <Section title="Coordinates (точка начала)">
                <Field label="x" value={route.coordinates.x} />
                <Field label="y" value={route.coordinates.y} />
            </Section>

            <Section title="Локация From">
                <Field label="x" value={route.from.x} />
                <Field label="y" value={route.from.y} />
                <Field label="z" value={route.from.z} />
            </Section>

            <Section title="Локация To">
                <Field label="x" value={route.to.x} />
                <Field label="y" value={route.to.y} />
                <Field label="z" value={route.to.z} />
            </Section>

            <div className="flex justify-end">
                <Button
                    onClick={() => navigate(`/update/${route.id}`)}
                    className="flex items-center gap-2"
                >
                    <PencilIcon className="h-5" />
                    Редактировать маршрут
                </Button>
            </div>
        </div>
    );
}

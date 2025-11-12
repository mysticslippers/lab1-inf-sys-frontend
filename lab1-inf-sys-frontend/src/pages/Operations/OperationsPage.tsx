import { useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

import {
    useGetMinDistanceRouteQuery,
    useGroupByRatingQuery,
    useGetUniqueRatingsQuery,
    useFindRoutesBetweenQuery,
} from "../../features/routes/routesApi";

import { useGetAllLocationsQuery } from "../../features/location/locationApi";

import { Table } from "../../components/ui/Table";

export default function OperationsPage() {
    const { data: minRoute } = useGetMinDistanceRouteQuery();

    const { data: grouped } = useGroupByRatingQuery();

    const { data: uniqueRatings } = useGetUniqueRatingsQuery();

    const { data: locations } = useGetAllLocationsQuery();

    const [fromId, setFromId] = useState<number | null>(null);
    const [toId, setToId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("id");

    const { data: betweenRoutes } = useFindRoutesBetweenQuery(
        fromId && toId
            ? { fromId, toId, sortBy }
            : skipToken
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10">

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-semibold mb-3">Маршрут с минимальной дистанцией</h2>

                {minRoute ? (
                    <div className="text-gray-800 dark:text-gray-300">
                        #{minRoute.id} — <strong>{minRoute.name}</strong>
                        <span className="ml-2 text-sm text-gray-500">
              distance: {minRoute.distance ?? "—"}
            </span>
                    </div>
                ) : (
                    <div className="text-gray-500">Нет данных</div>
                )}
            </section>

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-semibold mb-4">Количество маршрутов по rating</h2>

                {grouped ? (
                    <Table header={["Rating", "Count"]}>
                        {Object.entries(grouped).map(([rating, count]) => (
                            <tr key={rating}>
                                <td className="px-4 py-2">{rating}</td>
                                <td className="px-4 py-2">{count}</td>
                            </tr>
                        ))}
                    </Table>
                ) : (
                    <div className="text-gray-500">Нет данных</div>
                )}
            </section>

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <h2 className="text-lg font-semibold mb-3">Уникальные значения rating</h2>

                {uniqueRatings?.length ? uniqueRatings.join(", ") : "нет данных"}
            </section>

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-4">
                <h2 className="text-lg font-semibold">Маршруты между двумя локациями</h2>

                <div className="flex gap-4 items-center">
                    <select
                        className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                        value={fromId ?? ""}
                        onChange={(e) => setFromId(Number(e.target.value))}
                    >
                        <option value="">From...</option>
                        {locations?.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.id}: ({l.x}, {l.y}, {l.z})
                            </option>
                        ))}
                    </select>

                    <span>→</span>

                    <select
                        className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                        value={toId ?? ""}
                        onChange={(e) => setToId(Number(e.target.value))}
                    >
                        <option value="">To...</option>
                        {locations?.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.id}: ({l.x}, {l.y}, {l.z})
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="id">ID</option>
                        <option value="rating">Rating</option>
                        <option value="distance">Distance</option>
                    </select>
                </div>

                {betweenRoutes && (
                    <Table header={["ID", "Name", "Distance", "Rating"]}>
                        {betweenRoutes.map((r) => (
                            <tr key={r.id}>
                                <td className="px-4 py-2">{r.id}</td>
                                <td className="px-4 py-2">{r.name}</td>
                                <td className="px-4 py-2">{r.distance ?? "—"}</td>
                                <td className="px-4 py-2">{r.rating}</td>
                            </tr>
                        ))}
                    </Table>
                )}
            </section>
        </div>
    );
}

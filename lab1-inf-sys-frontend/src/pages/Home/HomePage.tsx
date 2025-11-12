import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useFetchRoutesQuery, useDeleteRouteMutation } from "../../features/routes/routesApi";
import { Button } from "../../components/ui/Button";
import { RouteTable } from "../../components/routes/RouteTable";

export default function HomePage() {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("id");
    const [search, setSearch] = useState("");

    const { data, refetch, isLoading } = useFetchRoutesQuery({
        page: page - 1,
        size: 10,
    });

    const [deleteRoute] = useDeleteRouteMutation();
    const lastEvent = useAppSelector((s) => s.websocket.lastEvent);

    useEffect(() => {
        if (lastEvent?.entity === "routes") refetch();
    }, [lastEvent, refetch]);

    const routes = data?.content ?? [];

    const filtered = routes.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === "id") return a.id - b.id;
        if (sortBy === "rating") return a.rating - b.rating;
        if (sortBy === "distance") return (a.distance ?? 0) - (b.distance ?? 0);
        return 0;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Маршруты</h2>
                <Button onClick={() => navigate("/create")}>+ Создать</Button>
            </div>

            <div className="flex gap-4">
                <input
                    className="px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 w-full"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="px-3 py-2 rounded-md dark:bg-gray-800"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="id">ID</option>
                    <option value="rating">Рейтинг</option>
                    <option value="distance">Дистанция</option>
                </select>
            </div>

            {/* 👇 Встроили таблицу */}
            <RouteTable
                routes={sorted}
                isLoading={isLoading}
                onView={(id) => navigate(`/route/${id}`)}
                onEdit={(id) => navigate(`/update/${id}`)}
                onDelete={(id) => deleteRoute(id)}
            />

            <div className="flex justify-center gap-4 py-4">
                <Button variant="secondary" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    ← Предыдущая
                </Button>
                <span>Страница {page}</span>
                <Button
                    variant="secondary"
                    onClick={() => {
                        if (data && page < data.totalPages) setPage((p) => p + 1);
                    }}
                >
                    Следующая →
                </Button>
            </div>
        </div>
    );
}

import { useState } from "react";
import {
    useGetAllCoordinatesQuery,
    useCreateCoordinatesMutation,
    useUpdateCoordinatesMutation,
    useDeleteCoordinatesMutation,
} from "../../features/coordinates/coordinatesApi";
import { Button } from "../../components/ui/Button";

export default function CoordinatesManager() {
    const { data: coords, refetch, isLoading } = useGetAllCoordinatesQuery();
    const [createCoordinates] = useCreateCoordinatesMutation();
    const [updateCoordinates] = useUpdateCoordinatesMutation();
    const [deleteCoordinates] = useDeleteCoordinatesMutation();

    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [editId, setEditId] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (editId) {
            await updateCoordinates({ id: editId, x, y });
            setEditId(null);
        } else {
            await createCoordinates({ id: 0, x, y });
        }
        setX(0);
        setY(0);
        refetch();
    };

    const handleEdit = (id: number, x: number, y: number) => {
        setEditId(id);
        setX(x);
        setY(y);
    };

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <div className="max-w-lg mx-auto space-y-4">
            <h2 className="text-xl font-semibold mb-4">Координаты</h2>

            <div className="flex gap-2">
                <input
                    type="number"
                    value={x}
                    onChange={(e) => setX(Number(e.target.value))}
                    placeholder="x"
                    className="px-2 py-1 border rounded"
                />
                <input
                    type="number"
                    value={y}
                    onChange={(e) => setY(Number(e.target.value))}
                    placeholder="y"
                    className="px-2 py-1 border rounded"
                />
                <Button onClick={handleSubmit}>
                    {editId ? "Сохранить" : "Добавить"}
                </Button>
            </div>

            <ul className="divide-y divide-gray-300 dark:divide-gray-700">
                {coords?.map((c) => (
                    <li key={c.id} className="flex justify-between py-2 items-center">
            <span>
              ID {c.id}: ({c.x}, {c.y})
            </span>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => handleEdit(c.id, c.x, c.y)}>
                                Редактировать
                            </Button>
                            <Button variant="danger" onClick={() => deleteCoordinates(c.id)}>
                                Удалить
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

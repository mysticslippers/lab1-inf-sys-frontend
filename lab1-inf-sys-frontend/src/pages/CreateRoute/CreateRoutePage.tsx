import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRouteMutation } from "../../features/routes/routesApi";
import { useGetAllCoordinatesQuery } from "../../features/coordinates/coordinatesApi";
import { useGetAllLocationsQuery } from "../../features/location/locationApi";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";

export default function CreateRoutePage() {
    const navigate = useNavigate();

    const { data: coordinates } = useGetAllCoordinatesQuery();
    const { data: locations } = useGetAllLocationsQuery();
    const [createRoute] = useCreateRouteMutation();

    const [name, setName] = useState("");
    const [distance, setDistance] = useState<number | null>(null);
    const [rating, setRating] = useState<number>(1);

    const [coordId, setCoordId] = useState<number | null>(null);
    const [fromId, setFromId] = useState<number | null>(null);
    const [toId, setToId] = useState<number | null>(null);

    const [showCoordForm, setShowCoordForm] = useState(false);
    const [coordX, setCoordX] = useState<number | null>(null);
    const [coordY, setCoordY] = useState<number | null>(null);

    const [showFromForm, setShowFromForm] = useState(false);
    const [showToForm, setShowToForm] = useState(false);

    const [from, setFrom] = useState({ x: 0, y: 0, z: 0 });
    const [to, setTo] = useState({ x: 0, y: 0, z: 0 });

    const handleSubmit = async () => {
        if (!name.trim()) return;

        const payload = {
            name,
            distance,
            rating,
            coordinates: showCoordForm
                ? { x: coordX, y: coordY }
                : undefined,
            coordinatesId: showCoordForm ? undefined : coordId,

            from: showFromForm ? from : undefined,
            fromId: showFromForm ? undefined : fromId,

            to: showToForm ? to : undefined,
            toId: showToForm ? undefined : toId,
        };

        await createRoute(payload as any);
        navigate("/");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold">Создать маршрут</h2>

            <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 space-y-4">
                <Input label="Название" value={name} onChange={(e) => setName(e.target.value)} />

                <Input
                    label="Дистанция (может быть пустой)"
                    type="number"
                    value={distance ?? ""}
                    onChange={(e) => setDistance(e.target.value ? Number(e.target.value) : null)}
                />

                <Input
                    label="Rating (> 0)"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                />
            </div>

            <section className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">Coordinates</h3>

                {!showCoordForm && (
                    <>
                        <select
                            className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                            value={coordId ?? ""}
                            onChange={(e) => setCoordId(Number(e.target.value))}
                        >
                            <option value="">Выбрать...</option>
                            {coordinates?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.id}: ({c.x}, {c.y})
                                </option>
                            ))}
                        </select>

                        <Button variant="ghost" onClick={() => setShowCoordForm(true)}>
                            + Создать новые coordinates
                        </Button>
                    </>
                )}

                {showCoordForm && (
                    <>
                        <Input label="X" type="number" onChange={(e) => setCoordX(Number(e.target.value))} />
                        <Input label="Y" type="number" onChange={(e) => setCoordY(Number(e.target.value))} />

                        <Button variant="secondary" onClick={() => setShowCoordForm(false)}>
                            Использовать существующие вместо этого
                        </Button>
                    </>
                )}
            </section>

            {/* FROM LOCATION */}
            <section className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">From (Location)</h3>

                {!showFromForm && (
                    <>
                        <select
                            className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                            value={fromId ?? ""}
                            onChange={(e) => setFromId(Number(e.target.value))}
                        >
                            <option value="">Выбрать...</option>
                            {locations?.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.id}: ({l.x}, {l.y}, {l.z})
                                </option>
                            ))}
                        </select>

                        <Button variant="ghost" onClick={() => setShowFromForm(true)}>
                            + Создать новую локацию
                        </Button>
                    </>
                )}

                {showFromForm && (
                    <>
                        <Input label="X" type="number" onChange={(e) => setFrom({ ...from, x: Number(e.target.value) })} />
                        <Input label="Y" type="number" onChange={(e) => setFrom({ ...from, y: Number(e.target.value) })} />
                        <Input label="Z" type="number" onChange={(e) => setFrom({ ...from, z: Number(e.target.value) })} />

                        <Button variant="secondary" onClick={() => setShowFromForm(false)}>
                            Использовать существующие
                        </Button>
                    </>
                )}
            </section>

            <section className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">To (Location)</h3>

                {!showToForm && (
                    <>
                        <select
                            className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                            value={toId ?? ""}
                            onChange={(e) => setToId(Number(e.target.value))}>
                            <option value="">Выбрать...</option>
                            {locations?.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.id}: ({l.x}, {l.y}, {l.z})
                                </option>
                            ))}
                        </select>

                        <Button variant="ghost" onClick={() => setShowToForm(true)}>
                            + Создать новую локацию
                        </Button>
                    </>
                )}

                {showToForm && (
                    <>
                        <Input label="X" type="number" onChange={(e) => setTo({ ...to, x: Number(e.target.value) })} />
                        <Input label="Y" type="number" onChange={(e) => setTo({ ...to, y: Number(e.target.value) })} />
                        <Input label="Z" type="number" onChange={(e) => setTo({ ...to, z: Number(e.target.value) })} />

                        <Button variant="secondary" onClick={() => setShowToForm(false)}>
                            Использовать существующие
                        </Button>
                    </>
                )}
            </section>

            <div className="text-right">
                <Button onClick={handleSubmit}>Создать маршрут</Button>
            </div>
        </div>
    );
}

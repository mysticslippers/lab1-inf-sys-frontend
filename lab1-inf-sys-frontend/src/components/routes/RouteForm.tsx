import { useState } from "react";
import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { useGetAllCoordinatesQuery } from "../../features/coordinates/coordinatesApi";
import { useGetAllLocationsQuery } from "../../features/location/locationApi";
import type { CoordinatesDTO } from "../../features/types/types";
import type { LocationDTO } from "../../features/types/types";

export interface RouteFormValues {
    name: string;
    distance: number | null;
    rating: number;

    coordinatesId?: number | null;
    coordinates?: { x: number | null; y: number | null };

    fromId?: number | null;
    from?: { x: number; y: number; z: number };

    toId?: number | null;
    to?: { x: number; y: number; z: number };
}

interface RouteFormProps {
    initialValues?: Partial<RouteFormValues>;
    onSubmit: (values: RouteFormValues) => void;
    submitText: string;
}

export function RouteForm({ initialValues, onSubmit, submitText }: RouteFormProps) {
    const { data: coordinates } = useGetAllCoordinatesQuery() as { data: CoordinatesDTO[] | undefined };
    const { data: locations } = useGetAllLocationsQuery() as { data: LocationDTO[] | undefined };

    const [name, setName] = useState(initialValues?.name ?? "");
    const [distance, setDistance] = useState<number | null>(initialValues?.distance ?? null);
    const [rating, setRating] = useState<number>(initialValues?.rating ?? 1);

    const [coordId, setCoordId] = useState<number | null>(initialValues?.coordinatesId ?? null);
    const [fromId, setFromId] = useState<number | null>(initialValues?.fromId ?? null);
    const [toId, setToId] = useState<number | null>(initialValues?.toId ?? null);

    const [showCoordForm, setShowCoordForm] = useState(Boolean(initialValues?.coordinates));
    const [showFromForm, setShowFromForm] = useState(Boolean(initialValues?.from));
    const [showToForm, setShowToForm] = useState(Boolean(initialValues?.to));

    const [coord, setCoord] = useState({
        x: initialValues?.coordinates?.x ?? null,
        y: initialValues?.coordinates?.y ?? null,
    });

    const [from, setFrom] = useState({
        x: initialValues?.from?.x ?? 0,
        y: initialValues?.from?.y ?? 0,
        z: initialValues?.from?.z ?? 0,
    });

    const [to, setTo] = useState({
        x: initialValues?.to?.x ?? 0,
        y: initialValues?.to?.y ?? 0,
        z: initialValues?.to?.z ?? 0,
    });

    const handleSubmit = () => {
        onSubmit({
            name,
            distance,
            rating,

            coordinatesId: !showCoordForm ? coordId : undefined,
            coordinates: showCoordForm ? coord : undefined,

            fromId: !showFromForm ? fromId : undefined,
            from: showFromForm ? from : undefined,

            toId: !showToForm ? toId : undefined,
            to: showToForm ? to : undefined,
        });
    };

    return (
        <div className="space-y-6">

            <div className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-4">
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

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">Coordinates</h3>

                {!showCoordForm ? (
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
                ) : (
                    <>
                        <Input label="X" type="number" onChange={(e) => setCoord({ ...coord, x: Number(e.target.value) })} />
                        <Input label="Y" type="number" onChange={(e) => setCoord({ ...coord, y: Number(e.target.value) })} />

                        <Button variant="secondary" onClick={() => setShowCoordForm(false)}>
                            Использовать существующие
                        </Button>
                    </>
                )}
            </section>

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">From (Location)</h3>

                {!showFromForm ? (
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
                ) : (
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

            <section className="p-6 border rounded-lg dark:border-gray-700 dark:bg-gray-800 space-y-4">
                <h3 className="font-semibold">To (Location)</h3>

                {!showToForm ? (
                    <>
                        <select
                            className="px-3 py-2 rounded-md bg-white dark:bg-gray-700"
                            value={toId ?? ""}
                            onChange={(e) => setToId(Number(e.target.value))}
                        >
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
                ) : (
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
                <Button onClick={handleSubmit}>{submitText}</Button>
            </div>
        </div>
    );
}

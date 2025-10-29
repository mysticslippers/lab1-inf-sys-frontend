import React, { useEffect, useState } from "react";
import api from "../api/axios";
import type {RouteDTO, LocationDTO, CoordinatesDTO} from "../types/types.ts";
import { useAppDispatch } from "../store/hooks";
import { createRoute, updateRoute } from "../store/routesSlice";

type Props = {
    initial?: RouteDTO;
    onClose: () => void;
};

const RouteForm: React.FC<Props> = ({ initial, onClose }) => {
    const dispatch = useAppDispatch();

    const [name, setName] = useState(initial?.name ?? "");
    const [coordinatesId, setCoordinatesId] = useState<number | null>(initial?.coordinates?.id ?? null);
    const [fromId, setFromId] = useState<number | null>(initial?.from?.id ?? null);
    const [toId, setToId] = useState<number | null>(initial?.to?.id ?? null);
    const [distance, setDistance] = useState<string>((initial?.distance ?? "") as any);
    const [rating, setRating] = useState<string>((initial?.rating ?? 1).toString());

    const [coordsList, setCoordsList] = useState<CoordinatesDTO[]>([]);
    const [locations, setLocations] = useState<LocationDTO[]>([]);
    const [errors, setErrors] = useState<Record<string,string>>({});

    useEffect(() => {
        api.get<CoordinatesDTO[]>("/api/coordinates").then(r => setCoordsList(r.data)).catch(() => setCoordsList([]));
        api.get<LocationDTO[]>("/api/locations").then(r => setLocations(r.data)).catch(() => setLocations([]));
    }, []);

    function validate() {
        const e: Record<string,string> = {};
        if (!name.trim()) e.name = "Название обязательно";
        if (!coordinatesId) e.coordinates = "Выберите coordinates";
        if (!fromId) e.from = "Выберите from";
        if (!toId) e.to = "Выберите to";
        if (Number.isNaN(Number(rating)) || Number(rating) <= 0) e.rating = "Оценка > 0";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;
        const dto: RouteDTO = {
            name,
            coordinates: coordsList.find(c => c.id === coordinatesId)!,
            from: locations.find(l => l.id === fromId)!,
            to: locations.find(l => l.id === toId)!,
            distance: distance ? Number(distance) : undefined,
            rating: Number(rating),
        };
        try {
            if (initial?.id) {
                await dispatch(updateRoute({ id: initial.id!, dto })).unwrap();
            } else {
                await dispatch(createRoute(dto)).unwrap();
            }
            onClose();
        } catch (err: any) {
            console.error("Save error", err);
            setErrors({ form: "Ошибка при сохранении" });
        }
    }

    // @ts-ignore
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
            <form className="bg-white rounded p-6 z-10 w-full max-w-lg" onSubmit={submit}>
                <h3 className="text-lg mb-4">{initial ? "Редактировать маршрут" : "Новый маршрут"}</h3>

                <label className="block mb-2">
                    <div className="text-sm">Name</div>
                    <input className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                </label>

                <label className="block mb-2">
                    <div className="text-sm">Coordinates</div>
                    <select className="w-full border p-2 rounded" value={coordinatesId ? String(coordinatesId) : ""}
                            onChange={e => setCoordinatesId(e.target.value ? Number(e.target.value) : null)}>
                        <option value="">-- choose --</option>
                        {coordsList.map(c => <option key={c.id} value={c.id}>{c.id} ({c.x},{c.y})</option>)}
                    </select>
                    {errors.coordinates && <div className="text-red-600 text-sm mt-1">{errors.coordinates}</div>}
                </label>

                <div className="grid grid-cols-2 gap-2">
                    <label className="block mb-2">
                        <div className="text-sm">From</div>
                        <select className="w-full border p-2 rounded" value={fromId ? String(fromId) : ""}
                                onChange={e => setFromId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">-- choose --</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.id} ({l.x},{l.y},{l.z})</option>)}
                        </select>
                        {errors.from && <div className="text-red-600 text-sm mt-1">{errors.from}</div>}
                    </label>

                    <label className="block mb-2">
                        <div className="text-sm">To</div>
                        <select className="w-full border p-2 rounded"
                                value={toId ? String(toId) : ""}
                                onChange={e => setToId(e.target.value ? Number(e.target.value) : null)}>
                            <option value="">-- choose --</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.id} ({l.x},{l.y},{l.z})</option>)}
                        </select>
                        {errors.to && <div className="text-red-600 text-sm mt-1">{errors.to}</div>}
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <label className="block mb-2">
                        <div className="text-sm">Distance</div>
                        <input className="w-full border p-2 rounded" value={distance} onChange={e => setDistance(e.target.value)} />
                    </label>
                    <label className="block mb-2">
                        <div className="text-sm">Rating</div>
                        <input className="w-full border p-2 rounded" value={rating} onChange={e => setRating(e.target.value)} />
                        {errors.rating && <div className="text-red-600 text-sm mt-1">{errors.rating}</div>}
                    </label>
                </div>

                {errors.form && <div className="text-red-700 mb-2">{errors.form}</div>}

                <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" className="px-3 py-1 border rounded" onClick={onClose}>Отмена</button>
                    <button type="submit" className="px-3 py-1 rounded bg-green-600 text-white">{initial ? "Сохранить" : "Создать"}</button>
                </div>
            </form>
        </div>
    );
};

export default RouteForm;

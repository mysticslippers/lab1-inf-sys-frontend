import React, { useState } from "react";
import api from "../api/axios";

const SpecialPanel: React.FC = () => {
    const [minDistanceResult, setMinDistanceResult] = useState<any>(null);
    const [groupByRating, setGroupByRating] = useState<any>(null);
    const [uniqueRatings, setUniqueRatings] = useState<number[] | null>(null);
    const [findBetweenResult, setFindBetweenResult] = useState<any>(null);
    const [a, setA] = useState("");
    const [b, setB] = useState("");

    async function getMinDistance() {
        const r = await api.get("/api/routes/min-distance");
        setMinDistanceResult(r.data);
    }

    async function getGroupByRating() {
        const r = await api.get("/api/routes/group-by-rating");
        setGroupByRating(r.data);
    }

    async function getUniqueRatings() {
        const r = await api.get<number[]>("/api/routes/unique-ratings");
        setUniqueRatings(r.data);
    }

    async function findBetween() {
        const r = await api.get(`/api/routes/find-between?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
        setFindBetweenResult(r.data);
    }

    async function addBetween() {
        await api.post(`/api/routes/add-between?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`);
        alert("Запрос на добавление отправлен");
    }

    return (
        <div className="p-4 border rounded space-y-4">
            <h3 className="text-lg font-medium mb-2">Специальные операции</h3>
            <div className="flex space-x-2">
                <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={getMinDistance}>Min distance</button>
                <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={getGroupByRating}>Group by rating</button>
                <button className="px-3 py-1 bg-sky-600 text-white rounded" onClick={getUniqueRatings}>Unique ratings</button>
            </div>

            <div className="grid grid-cols-3 gap-2 items-end">
                <input className="border p-2 rounded col-span-1" placeholder="a" value={a} onChange={e => setA(e.target.value)} />
                <input className="border p-2 rounded col-span-1" placeholder="b" value={b} onChange={e => setB(e.target.value)} />
                <div className="col-span-1 flex space-x-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={findBetween}>Find between</button>
                    <button className="px-3 py-1 bg-amber-600 text-white rounded" onClick={addBetween}>Add between</button>
                </div>
            </div>

            <div className="pt-2">
                {minDistanceResult && <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(minDistanceResult, null, 2)}</pre>}
                {groupByRating && <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(groupByRating, null, 2)}</pre>}
                {uniqueRatings && <div>Unique ratings: {uniqueRatings.join(", ")}</div>}
                {findBetweenResult && <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(findBetweenResult, null, 2)}</pre>}
            </div>
        </div>
    );
};

export default SpecialPanel;

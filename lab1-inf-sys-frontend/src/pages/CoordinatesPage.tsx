import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coordinatesApi } from '../api/coordinatesApi';
import type { RootState, AppDispatch } from '../store';
import {
    fetchCoordinates,
    deleteCoordinates,
} from '../store/coordinatesSlice';
import CoordinatesTable from '../components/coordinates/CoordinatesTable';
import CoordinatesFormModal from '../components/coordinates/CoordinatesFormModal';
import type { CoordinatesDTO } from '../types/coordinates';

const CoordinatesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, status, error } = useSelector(
        (state: RootState) => state.coordinates
    );

    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<CoordinatesDTO | null>(null);
    const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [searchError, setSearchError] = useState<string | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CoordinatesDTO | null>(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCoordinates());
        }
    }, [dispatch, status]);

    const handleCreate = () => {
        setEditingItem(null);
        setModalOpen(true);
    };

    const handleSearchById = async () => {
        setSearchError(null);
        setSearchResult(null);

        if (!searchId.trim()) {
            setSearchError('Введите ID координат');
            return;
        }

        const idNum = Number(searchId);
        if (!Number.isInteger(idNum) || idNum <= 0) {
            setSearchError('ID должен быть положительным целым числом');
            return;
        }

        setSearchStatus('loading');
        try {
            const coord = await coordinatesApi.getById(idNum);
            setSearchResult(coord);
            setSearchStatus('succeeded');
        } catch (err: any) {
            const msg =
                err?.response?.status === 404
                    ? `Координаты с id=${idNum} не найдены`
                    : err?.response?.data?.message ??
                    err?.message ??
                    'Ошибка при получении координат';
            setSearchError(msg);
            setSearchStatus('failed');
        }
    };


    const handleEdit = (item: CoordinatesDTO) => {
        setEditingItem(item);
        setModalOpen(true);
    };

    const handleDelete = (item: CoordinatesDTO) => {
        if (!item.id) return;

        const confirmed = window.confirm(
            `Удалить координаты #${item.id} (x=${item.x}, y=${item.y})?`
        );
        if (!confirmed) return;

        dispatch(deleteCoordinates(item.id))
            .unwrap()
            .catch((err: any) => {
                const msg =
                    err?.response?.data?.message ??
                    err?.message ??
                    'Не удалось удалить координаты. Возможно, они используются в маршрутах.';
                alert(msg);
            });
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Координаты</h2>
                <button
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
                    onClick={handleCreate}
                >
                    Добавить координаты
                </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
                <h3 className="mb-2 font-medium">Поиск координат по ID</h3>
                <div className="flex flex-wrap gap-2">
                    <input
                        className="min-w-[120px] flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-500"
                        placeholder="ID координат"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                    <button
                        className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-medium hover:bg-slate-700 disabled:opacity-60"
                        onClick={handleSearchById}
                        disabled={searchStatus === 'loading'}
                    >
                        {searchStatus === 'loading' ? 'Поиск...' : 'Найти'}
                    </button>
                    <button
                        className="rounded-xl border border-slate-600 px-3 py-2 text-xs hover:bg-slate-800"
                        onClick={() => {
                            setSearchId('');
                            setSearchResult(null);
                            setSearchError(null);
                            setSearchStatus('idle');
                        }}
                    >
                        Сбросить
                    </button>
                </div>

                {searchError && (
                    <p className="mt-2 text-xs text-rose-400">{searchError}</p>
                )}

                {searchResult && (
                    <div className="mt-3">
                        <p className="mb-1 text-xs text-slate-400">
                            Результат поиска (координаты с id={searchResult.id}):
                        </p>
                        <div className="rounded-lg border border-slate-800 bg-slate-950/70">
                            <CoordinatesTable
                                items={[searchResult]}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                )}
            </div>

            {status === 'loading' && (
                <div className="text-sm text-slate-400">Загрузка...</div>
            )}

            {status === 'failed' && (
                <div className="text-sm text-rose-400">
                    Ошибка загрузки: {error ?? 'неизвестная ошибка'}
                </div>
            )}

            <CoordinatesTable
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <CoordinatesFormModal
                open={modalOpen}
                initialItem={editingItem}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
};

export default CoordinatesPage;

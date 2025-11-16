import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routesApi } from '../api/routesApi';
import type { RootState, AppDispatch } from '../store';
import {
    fetchRoutesPage,
    setPageRequest,
    deleteRoute,
} from '../store/routesSlice';
import RoutesTable from '../components/routes/RoutesTable';
import RoutesPagination from '../components/routes/RoutesPagination';
import RouteFormModal from '../components/routes/RouteFormModal';
import type { RouteDTO } from '../types/route';

const RoutesPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { page, status, pageRequest, error } = useSelector(
        (state: RootState) => state.routes
    );

    const [searchId, setSearchId] = useState('');
    const [searchResult, setSearchResult] = useState<RouteDTO | null>(null);
    const [searchStatus, setSearchStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
    const [searchError, setSearchError] = useState<string | null>(null);


    const [modalOpen, setModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<RouteDTO | null>(null);

    useEffect(() => {
        dispatch(fetchRoutesPage());
    }, [dispatch, pageRequest.page, pageRequest.size, pageRequest.sort]);

    const handlePageChange = (newPage: number) => {
        dispatch(
            setPageRequest({
                ...pageRequest,
                page: newPage,
            })
        );
    };

    const handleSearchById = async () => {
        setSearchError(null);
        setSearchResult(null);

        if (!searchId.trim()) {
            setSearchError('Введите ID маршрута');
            return;
        }

        const idNum = Number(searchId);
        if (!Number.isInteger(idNum) || idNum <= 0) {
            setSearchError('ID должен быть положительным целым числом');
            return;
        }

        setSearchStatus('loading');
        try {
            const route = await routesApi.getById(idNum);
            setSearchResult(route);
            setSearchStatus('succeeded');
        } catch (err: any) {
            const msg =
                err?.response?.status === 404
                    ? `Маршрут с id=${idNum} не найден`
                    : err?.response?.data?.message ??
                    err?.message ??
                    'Ошибка при получении маршрута';
            setSearchError(msg);
            setSearchStatus('failed');
        }
    };

    const handleCreate = () => {
        setEditingRoute(null);
        setModalOpen(true);
    };

    const handleEdit = (route: RouteDTO) => {
        setEditingRoute(route);
        setModalOpen(true);
    };

    const handleDelete = (route: RouteDTO) => {
        if (!route.id) return;
        const confirmed = window.confirm(
            `Удалить маршрут #${route.id} (${route.name})?`
        );
        if (!confirmed) return;

        dispatch(deleteRoute(route.id))
            .unwrap()
            .catch((err) => {
                alert(
                    err?.message ??
                    'Не удалось удалить маршрут. Возможно, он связан с другими объектами.'
                );
            });
    };

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Маршруты</h2>
                <button
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
                    onClick={handleCreate}
                >
                    Добавить маршрут
                </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
                <h3 className="mb-2 font-medium">Поиск маршрута по ID</h3>
                <div className="flex flex-wrap gap-2">
                    <input
                        className="min-w-[120px] flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 outline-none focus:border-emerald-500"
                        placeholder="ID маршрута"
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
                            Результат поиска (маршрут с id={searchResult.id}):
                        </p>
                        <div className="rounded-lg border border-slate-800 bg-slate-950/70">
                            <RoutesTable
                                routes={[searchResult]}
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

            <RoutesTable
                routes={page?.content ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {page && (
                <RoutesPagination
                    page={page.number}
                    size={page.size}
                    totalPages={page.totalPages}
                    onChange={handlePageChange}
                />
            )}

            <RouteFormModal
                open={modalOpen}
                initialRoute={editingRoute}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
};

export default RoutesPage;

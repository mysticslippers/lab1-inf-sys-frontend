import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { wsService } from './api/wsClient';
import RoutesPage from './pages/RoutesPage';
import LocationsPage from './pages/LocationsPage';
import CoordinatesPage from './pages/CoordinatesPage';
import SpecialOperationsPage from './pages/SpecialOperationsPage';
import {
    fetchRoutesPage,
    applyWebSocketEvent as applyRoutesWs,
} from './store/routesSlice';
import {
    fetchLocations,
    applyWebSocketEvent as applyLocationsWs,
} from './store/locationsSlice';
import {
    fetchCoordinates,
    applyWebSocketEvent as applyCoordinatesWs,
} from './store/coordinatesSlice';

type Tab = 'routes' | 'locations' | 'coordinates' | 'special';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<Tab>('routes');

    useEffect(() => {
        wsService.connect();

        wsService.onRoutesEvent((event) => {
            dispatch(applyRoutesWs(event));
        });

        wsService.onLocationsEvent((event) => {
            dispatch(applyLocationsWs(event));
        });

        wsService.onCoordinatesEvent((event) => {
            dispatch(applyCoordinatesWs(event));
        });

        dispatch(fetchRoutesPage());
        dispatch(fetchLocations());
        dispatch(fetchCoordinates());
    }, [dispatch]);

    const tabButtonClass = (tab: Tab) =>
        [
            'px-3 py-2 text-sm rounded-lg transition-colors',
            activeTab === tab
                ? 'bg-emerald-600/80 text-white'
                : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60',
        ].join(' ');

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Route Manager
                    </h1>
                    <nav className="flex gap-2 text-sm">
                        <button
                            className={tabButtonClass('routes')}
                            onClick={() => setActiveTab('routes')}
                        >
                            Маршруты
                        </button>
                        <button
                            className={tabButtonClass('locations')}
                            onClick={() => setActiveTab('locations')}
                        >
                            Локации
                        </button>
                        <button
                            className={tabButtonClass('coordinates')}
                            onClick={() => setActiveTab('coordinates')}
                        >
                            Координаты
                        </button>
                        <button
                            className={tabButtonClass('special')}
                            onClick={() => setActiveTab('special')}
                        >
                            Спец. операции
                        </button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-6">
                {activeTab === 'routes' && <RoutesPage />}
                {activeTab === 'locations' && <LocationsPage />}
                {activeTab === 'coordinates' && <CoordinatesPage />}
                {activeTab === 'special' && <SpecialOperationsPage />}
            </main>
        </div>
    );
};

export default App;

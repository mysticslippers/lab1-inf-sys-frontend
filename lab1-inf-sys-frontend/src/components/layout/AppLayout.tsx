import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../../app/useTheme";
import React from "react";

export const AppLayout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col">
            <header className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Route Manager</h1>

                <button
                    onClick={toggleTheme}
                    className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    {theme === "light" ? "Тёмная" : "Светлая"}
                </button>
            </header>

            <nav className="border-b border-gray-300 dark:border-gray-700 px-6 py-3 flex gap-6 text-sm">
                <NavLink
                    to="/"
                    className={({ isActive }: { isActive: boolean }) =>
                        isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "hover:text-blue-500 dark:hover:text-blue-400"
                    }
                >
                    Главная
                </NavLink>

                <NavLink
                    to="/create"
                    className={({ isActive }: { isActive: boolean }) =>
                        isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "hover:text-blue-500 dark:hover:text-blue-400"
                    }
                >
                    Создать маршрут
                </NavLink>

                <NavLink
                    to="/operations"
                    className={({ isActive }: { isActive: boolean }) =>
                        isActive
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : "hover:text-blue-500 dark:hover:text-blue-400"
                    }
                >
                    Спец-операции
                </NavLink>
            </nav>

            <main className="flex-1 px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
};

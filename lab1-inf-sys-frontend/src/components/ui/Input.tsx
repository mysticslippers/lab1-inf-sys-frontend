import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                className = "",
                                                ...props
                                            }) => {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-sm text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            <input
                className={`px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition ${className}`}
                {...props}
            />

            {error && (
                <span className="text-xs text-red-500">{error}</span>
            )}
        </div>
    );
};

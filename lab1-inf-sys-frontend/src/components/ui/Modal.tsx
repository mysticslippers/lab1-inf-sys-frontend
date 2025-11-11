import React from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">

                {title && (
                    <h2 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        {title}
                    </h2>
                )}

                <div>{children}</div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-500"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

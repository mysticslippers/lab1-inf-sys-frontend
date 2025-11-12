import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose, actions }) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 w-full max-w-md"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold mb-4">{title}</h2>
                    <div className="mb-6">{children}</div>
                    {actions && <div className="flex justify-end gap-3">{actions}</div>}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

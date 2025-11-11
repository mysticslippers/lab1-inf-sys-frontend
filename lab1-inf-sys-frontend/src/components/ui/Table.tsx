import React from "react";

interface TableProps {
    header: string[];
    children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ header, children }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 shadow-sm">
            <table className="w-full text-left text-sm text-gray-800 dark:text-gray-200">
                <thead className="bg-gray-100 dark:bg-gray-800 uppercase text-xs">
                <tr>
                    {header.map((h) => (
                        <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
};

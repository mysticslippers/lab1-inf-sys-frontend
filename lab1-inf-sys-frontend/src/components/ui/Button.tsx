import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
}

export const Button: React.FC<ButtonProps> = ({
                                                  variant = "primary",
                                                  className = "",
                                                  children,
                                                  ...props
                                              }) => {
    const base =
        "px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none";

    const styles = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",
        secondary:
            "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200",
        danger:
            "bg-red-600 hover:bg-red-700 text-white",
        ghost:
            "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300",
    };

    return (
        <button
            className={`${base} ${styles[variant]} ${className}`}
            {...props}>
            {children}
        </button>
    );
};

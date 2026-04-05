import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    onClose: () => void;
    }

const Modal: React.FC<ModalProps> = ({
    isOpen,
    title,
    children,
    footer,
    size = "md",
    onClose,
    }) => {
    if (!isOpen) return null;

    const sizeClass = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 sm:p-6"
            onClick={onClose}
        >
        <div
            className={`w-full ${sizeClass[size]} rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.24)]`}
            onClick={(event) => event.stopPropagation()}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
            {title && <h2 className="text-xl text-black font-semibold">{title}</h2>}
            <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-3xl leading-none text-gray-500 transition hover:text-gray-700"
                aria-label="Close modal"
            >
                &times;
            </button>
            </div>

            {/* Body */}
            <div>{children}</div>

            {/* Footer */}
            {footer && <div className="mt-4">{footer}</div>}
        </div>
        </div>,
        document.body,
    );
};

export default Modal;

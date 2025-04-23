import { useCallback, useState } from "react";

interface ToastOptions {
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
}

interface Toast extends ToastOptions {
    id: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback(
        ({ title, description, variant = "default" }: ToastOptions) => {
            const id = Math.random().toString(36).substring(7);
            const newToast = { id, title, description, variant };

            setToasts((prev) => [...prev, newToast]);

            // Auto remove after 5 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        },
        [],
    );

    return { toast, toasts };
}

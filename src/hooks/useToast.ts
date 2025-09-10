import { useState } from "react";

// Type definitions
type ToastType = "info" | "success" | "warning" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
}

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (
    message: string,
    type: ToastType = "info",
    duration: number = 5000
  ): void => {
    const id: number = Date.now();
    const toast: Toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id: number): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};

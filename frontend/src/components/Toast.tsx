"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  const iconProps = { className: "h-5 w-5 flex-shrink-0" };

  switch (type) {
    case "success":
      return (
        <CheckCircle
          {...iconProps}
          className="h-5 w-5 text-green-500 flex-shrink-0"
        />
      );
    case "error":
      return (
        <AlertCircle
          {...iconProps}
          className="h-5 w-5 text-red-500 flex-shrink-0"
        />
      );
    case "warning":
      return (
        <AlertTriangle
          {...iconProps}
          className="h-5 w-5 text-yellow-500 flex-shrink-0"
        />
      );
    case "info":
      return (
        <Info {...iconProps} className="h-5 w-5 text-blue-500 flex-shrink-0" />
      );
    default:
      return <Info {...iconProps} />;
  }
};

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) => {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 shadow-green-100";
      case "error":
        return "border-red-200 bg-red-50 shadow-red-100";
      case "warning":
        return "border-yellow-200 bg-yellow-50 shadow-yellow-100";
      case "info":
        return "border-blue-200 bg-blue-50 shadow-blue-100";
      default:
        return "border-gray-200 bg-white shadow-gray-100";
    }
  };

  React.useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={`min-w-[320px] max-w-md w-full border rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${getToastStyles(
        toast.type
      )} animate-slide-in-right`}
    >
      <div className="flex items-start space-x-3">
        <ToastIcon type={toast.type} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 break-words">
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-600 break-words leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>
        <button
          className="flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1 transition-colors ml-2"
          onClick={() => onRemove(toast.id)}
          aria-label="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "success", title, message });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "error", title, message, duration: 7000 });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "warning", title, message });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showToast({ type: "info", title, message });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ showToast, showSuccess, showError, showWarning, showInfo }}
    >
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

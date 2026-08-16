import { createContext, useCallback, useContext, useState } from "react";
import { ToastContainer } from "../components/common/ToastContainer";

export type ToastType = 'success' | 'error' | 'info';
 
export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
 
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}
 
const ToastContext = createContext<ToastContextType | undefined>(undefined);
 
let toastIdCounter = 0;
const TOAST_DURATION_MS = 5000;
 
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
 
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
 
  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = ++toastIdCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => removeToast(id), TOAST_DURATION_MS);
    },
    [removeToast]
  );
 
  const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);
  const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
 
  return (
    <ToastContext.Provider value={{ showToast, showError, showSuccess }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};
 
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
 
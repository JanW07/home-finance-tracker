import { useTranslation } from 'react-i18next';
import type { ToastItem } from '../../context/ToastContext';
import './Toast.css';
 
export interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}
 
const ICONS: Record<ToastItem['type'], string> = {
  success: '✅',
  error: '⚠️',
  info: 'ℹ️',
};
 
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  const { t } = useTranslation();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon" aria-hidden="true">{ICONS[toast.type]}</span>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => onDismiss(toast.id)}
            aria-label={t('common.close', 'Zamknij')}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
 
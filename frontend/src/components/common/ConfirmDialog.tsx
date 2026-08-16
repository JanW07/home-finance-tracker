import { useTranslation } from 'react-i18next';
import './ConfirmDialog.css';
import { Modal } from './Modal';
import { Button } from './Button';
 
export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
 
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title || t('common.confirmTitle', 'Potwierdź')}
      size="sm"
      footer={
        <div className="confirm-dialog-actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel || t('common.cancel')}
          </Button>
          <Button type="button" variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel || t('common.confirm', 'Potwierdź')}
          </Button>
        </div>
      }
    >
      <p className="confirm-dialog-message">{message}</p>
    </Modal>
  );
};
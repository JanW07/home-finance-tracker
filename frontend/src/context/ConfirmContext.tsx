import { createContext, useCallback, useContext, useState } from "react";
import { ConfirmDialog } from "../components/common/ConfirmDialog";

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}
 
interface ConfirmState {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}
 
interface ConfirmContextType {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}
 
const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);
 
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConfirmState | null>(null);
 
  const confirm = useCallback((options: ConfirmOptions | string) => {
    const normalized: ConfirmOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      setState({ options: normalized, resolve });
    });
  }, []);
 
  const handleResult = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };
 
  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        isOpen={state !== null}
        title={state?.options.title}
        message={state?.options.message ?? ''}
        confirmLabel={state?.options.confirmLabel}
        cancelLabel={state?.options.cancelLabel}
        danger={state?.options.danger}
        onConfirm={() => handleResult(true)}
        onCancel={() => handleResult(false)}
      />
    </ConfirmContext.Provider>
  );
};
 
export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context.confirm;
};
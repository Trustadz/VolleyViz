
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

type ModalType = 'alert' | 'confirm' | 'prompt';

interface ModalState {
  type: ModalType;
  message: string;
  defaultValue?: string;
  resolve: (value: any) => void;
}

interface UIContextType {
  prompt: (message: string, defaultValue?: string) => Promise<string | null>;
  confirm: (message: string) => Promise<boolean>;
  alert: (message: string) => Promise<void>;
  modalState: ModalState | null;
  closeModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  const prompt = useCallback((message: string, defaultValue?: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setModalState({
        type: 'prompt',
        message,
        defaultValue,
        resolve: (val: string | null) => resolve(val)
      });
    });
  }, []);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        type: 'confirm',
        message,
        resolve: (val: boolean) => resolve(val)
      });
    });
  }, []);

  const alert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      setModalState({
        type: 'alert',
        message,
        resolve: () => resolve()
      });
    });
  }, []);

  return (
    <UIContext.Provider value={{ prompt, confirm, alert, modalState, closeModal }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
};

import { create } from 'zustand';

interface ToastOptions {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Toast extends ToastOptions {
  id: string;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (options: ToastOptions) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (options) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...options, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  useToastStore.getState().addToast({ message, type });
}

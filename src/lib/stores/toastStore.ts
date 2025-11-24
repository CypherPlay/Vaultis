import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'error';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const TOAST_TIMEOUT = 3000;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let nextId = 0;

  function addToast(message: string, type: ToastType) {
    const id = nextId++;
    update((toasts) => [...toasts, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, TOAST_TIMEOUT);
  }

  function removeToast(id: number) {
    update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  return {
    subscribe,
    info: (message: string) => addToast(message, 'info'),
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
  };
}

export const toastStore = createToastStore();
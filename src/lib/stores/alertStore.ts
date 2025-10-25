import { writable } from 'svelte/store';

export interface Alert {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number; // Milliseconds after which the alert should auto-dismiss
}

const createAlertStore = () => {
  const { subscribe, update } = writable<Alert[]>([]);
  let nextId = 0;

  const addAlert = (message: string, type: Alert['type'], timeout?: number) => {
    const id = nextId++;
    update((alerts) => [...alerts, { id, message, type, timeout }]);

    if (timeout) {
      setTimeout(() => removeAlert(id), timeout);
    }
  };

  const removeAlert = (id: number) => {
    update((alerts) => alerts.filter((alert) => alert.id !== id));
  };

  return { subscribe, addAlert, removeAlert };
};

export const alertStore = createAlertStore();

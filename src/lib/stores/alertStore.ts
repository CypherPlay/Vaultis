import { writable } from 'svelte/store';

export type AlertType = 'success' | 'error' | 'info';

export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  timeoutId?: ReturnType<typeof setTimeout>;
}

const ALERT_TIMEOUT = 5000; // 5 seconds

function createAlertStore() {
  const { subscribe, update } = writable<Alert[]>([]);
  let nextId = 0;

  function addAlert(type: AlertType, message: string, timeout: number = ALERT_TIMEOUT) {
    const id = nextId++;
    const newAlert: Alert = { id, type, message };

    if (timeout > 0) {
      const timeoutId = setTimeout(() => removeAlert(id), timeout);
      newAlert.timeoutId = timeoutId;
    }

    update(alerts => [...alerts, newAlert]);
  }

  function removeAlert(id: number) {
    update(alerts => {
      const alertToRemove = alerts.find(alert => alert.id === id);
      if (alertToRemove?.timeoutId) {
        clearTimeout(alertToRemove.timeoutId);
      }
      return alerts.filter(alert => alert.id !== id);
    });
  }

  return {
    subscribe,
    success: (message: string, timeout?: number) => addAlert('success', message, timeout),
    error: (message: string, timeout?: number) => addAlert('error', message, timeout),
    info: (message: string, timeout?: number) => addAlert('info', message, timeout),
    remove: removeAlert,
    clearAll: () => update(() => []), // Optional: to clear all alerts
  };
}

export const alertStore = createAlertStore();
type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  message: string;
  variant: NotificationVariant;
  key: string;
  persist?: boolean;
}

class NotificationService {
  private listeners: ((notification: Notification | null) => void)[] = [];

  subscribe(listener: (notification: Notification | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(notification: Notification | null) {
    this.listeners.forEach(listener => listener(notification));
  }

  success(message: string) {
    this.notify({
      message,
      variant: 'success',
      key: Date.now().toString(),
    });
  }

  error(message: string) {
    const displayMessage = message.includes('Su sesión es inválida') 
      ? 'No se pudo conectar con el servidor. Por favor, intente nuevamente más tarde.'
      : message;
    
    this.notify({
      message: displayMessage,
      variant: 'error',
      key: Date.now().toString(),
    });
  }

  warning(message: string) {
    this.notify({
      message,
      variant: 'warning',
      key: Date.now().toString(),
    });
  }

  info(message: string, persist = false) {
    this.notify({
      message,
      variant: 'info',
      key: Date.now().toString(),
      persist,
    });
  }

  loading(message: string): string {
    const key = Date.now().toString();
    this.notify({
      message,
      variant: 'info',
      key,
      persist: true,
    });
    return key;
  }

  close(key: string) {
    // El componente que escucha manejará el cierre
    this.notify(null);
  }
}

export const notificationService = new NotificationService();

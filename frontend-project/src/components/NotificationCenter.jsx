import { useApp } from '../hooks/useApp';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function NotificationCenter() {
  const { notifications, removeNotification } = useApp();

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
    error: 'bg-rose-500/20 border-rose-500/30 text-rose-200',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-200',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={`${notification.id}-${index}`}
          className={`backdrop-blur-lg rounded-xl border p-4 shadow-lg transform transition-all duration-300 animate-slideUp ${colors[notification.type]}`}
          role="alert"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                {icons[notification.type]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-current/60 hover:text-current transition-colors"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

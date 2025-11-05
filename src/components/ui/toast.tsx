import { X } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg p-4 shadow-lg backdrop-blur-sm',
        'border transition-all duration-300',
        {
          'bg-green-500/90 border-green-600 text-white': toast.type === 'success',
          'bg-red-500/90 border-red-600 text-white': toast.type === 'error',
          'bg-blue-500/90 border-blue-600 text-white': toast.type === 'info',
        }
      )}
    >
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
}


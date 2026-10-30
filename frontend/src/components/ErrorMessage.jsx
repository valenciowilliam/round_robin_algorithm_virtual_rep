import { AlertTriangle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  const lines = typeof message === 'string' ? message.split('\n').filter(Boolean) : [message];

  return (
    <div className="animate-fade-in flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 shadow-sm">
      <AlertTriangle size={18} className="flex-shrink-0 mt-0.5 text-rose-600" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm mb-1 text-rose-950">
          {lines.length > 1 ? 'Validation Errors' : 'Error'}
        </p>
        {lines.length > 1 ? (
          <ul className="text-xs space-y-1 list-disc list-inside text-rose-800">
            {lines.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-rose-800 font-medium">{lines[0]}</p>
        )}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-rose-100 transition-colors text-rose-600"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

import { Loader2, AlertTriangle, ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={`animate-spin text-primary-500 ${sizes[size]} ${className}`} />;
}

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-50 dark:bg-surface-950 bg-mesh-light dark:bg-mesh-dark">
      <div className="flex flex-col items-center gap-4 p-8 rounded-2xl glass-panel shadow-xl">
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-primary-500/30 text-white font-bold text-xl">
            T
          </div>
          <Loader2 className="absolute -inset-2 w-16 h-16 animate-spin text-primary-500/40" />
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-surface-800 dark:text-surface-100">TaskFlow</p>
          <p className="text-xs text-surface-400 mt-0.5">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} />;
}

export function TaskListSkeleton({ rows = 6 }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card flex items-center gap-4 py-3.5 px-4">
          <Skeleton className="w-5 h-5 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-24 hidden md:block" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 bg-white/50 dark:bg-surface-900/40">
      {Icon && (
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-100/60 p-4 dark:from-primary-950/40 dark:to-surface-800 border border-primary-100/60 dark:border-primary-900/30 shadow-sm">
          <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, variant = 'danger' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className={`rounded-xl p-3 shrink-0 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30 text-danger' : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h3>
            <p className="mt-1.5 text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className={variant === 'danger' ? 'btn-danger' : 'btn-primary'}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const config = {
    'Backlog': { dot: 'bg-surface-400', class: 'badge-neutral' },
    'To Do': { dot: 'bg-blue-500', class: 'badge-info' },
    'In Progress': { dot: 'bg-amber-500', class: 'badge-warning' },
    'In Review': { dot: 'bg-purple-500', class: 'badge-primary' },
    'Done': { dot: 'bg-emerald-500', class: 'badge-success' },
  };
  const item = config[status] || { dot: 'bg-surface-400', class: 'badge-neutral' };

  return (
    <span className={`badge ${item.class} shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = {
    Urgent: {
      class: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/25',
      icon: '🔥',
    },
    High: {
      class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/25',
      icon: '▲',
    },
    Medium: {
      class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25',
      icon: '■',
    },
    Low: {
      class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25',
      icon: '▼',
    },
  };
  const item = config[priority] || { class: 'badge-neutral', icon: '•' };

  return (
    <span className={`badge ${item.class}`}>
      <span className="text-[9px] opacity-80">{item.icon}</span>
      {priority}
    </span>
  );
}

export function SlaBadge({ slaStatus, slaText }) {
  if (!slaStatus || slaStatus === 'N/A') return null;

  const isBreached = slaStatus === 'Breached' || (slaText && slaText.includes('overdue'));
  const isAtRisk = slaStatus === 'At Risk';

  const config = {
    'On Track': { class: 'badge-success', icon: ShieldCheck, pulse: false },
    'At Risk': { class: 'badge-warning', icon: ShieldAlert, pulse: true },
    'Breached': { class: 'badge-danger', icon: ShieldX, pulse: true },
    'Met': { class: 'badge-success', icon: ShieldCheck, pulse: false },
  };

  const current = config[slaStatus] || { class: 'badge-neutral', icon: Clock, pulse: false };

  return (
    <span className={`badge ${current.class} ${isBreached ? 'ring-1 ring-red-400/40' : ''}`}>
      <span className="relative flex h-2 w-2 mr-0.5">
        {(isBreached || isAtRisk) && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isBreached ? 'bg-red-400' : 'bg-amber-400'}`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isBreached ? 'bg-red-500' : isAtRisk ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      </span>
      {slaText || slaStatus}
    </span>
  );
}

export function TagBadge({ tag, onRemove }) {
  return (
    <span className="badge badge-neutral gap-1.5 font-normal hover:border-surface-300 dark:hover:border-surface-600">
      <span className="text-primary-500 dark:text-primary-400 font-semibold">#</span>
      {tag}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-danger text-xs leading-none transition-colors"
          title="Remove tag"
        >
          &times;
        </button>
      )}
    </span>
  );
}

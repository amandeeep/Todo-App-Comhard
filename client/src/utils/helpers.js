import { format, formatDistanceToNow, differenceInMinutes, isPast, isToday, isTomorrow, isThisWeek, addMinutes } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatDateShort = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDuration = (minutes) => {
  if (minutes == null || minutes === 0) return '—';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const getSlaTimeRemaining = (task) => {
  if (!task.slaDurationMinutes || task.slaDurationMinutes <= 0) return null;
  const startTime = task.startAt || task.createdAt;
  const deadline = addMinutes(new Date(startTime), task.slaDurationMinutes);
  const now = new Date();

  if (task.status === 'Done') {
    const completedAt = new Date(task.completedAt);
    if (completedAt <= deadline) {
      return { text: 'Met', type: 'met' };
    }
    return { text: 'Missed', type: 'breached' };
  }

  const remaining = differenceInMinutes(deadline, now);
  if (remaining <= 0) {
    return { text: `${formatDuration(Math.abs(remaining))} overdue`, type: 'breached' };
  }
  const totalDuration = differenceInMinutes(deadline, new Date(startTime));
  const ratio = remaining / totalDuration;
  if (ratio <= 0.2) {
    return { text: `${formatDuration(remaining)} left`, type: 'at-risk' };
  }
  return { text: `${formatDuration(remaining)} left`, type: 'on-track' };
};

export const isOverdue = (task) => {
  if (!task.dueAt || task.status === 'Done') return false;
  return isPast(new Date(task.dueAt));
};

export const getDueDateColor = (task) => {
  if (!task.dueAt) return 'text-surface-400';
  if (task.status === 'Done') return 'text-success';
  const d = new Date(task.dueAt);
  if (isPast(d)) return 'text-danger';
  if (isToday(d)) return 'text-warning';
  if (isTomorrow(d)) return 'text-info';
  return 'text-surface-500 dark:text-surface-400';
};

export const PRIORITY_CONFIG = {
  Urgent: { color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-500', label: 'Urgent' },
  High: { color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-500', label: 'High' },
  Medium: { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500', label: 'Medium' },
  Low: { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500', label: 'Low' },
};

export const STATUS_CONFIG = {
  'Backlog': { color: 'text-surface-500', bg: 'bg-surface-100 dark:bg-surface-800', icon: '○' },
  'To Do': { color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '◎' },
  'In Progress': { color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: '◑' },
  'In Review': { color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: '◕' },
  'Done': { color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: '●' },
};

export const SLA_CONFIG = {
  'N/A': { color: 'text-surface-400', bg: 'badge-neutral' },
  'On Track': { color: 'text-emerald-600', bg: 'badge-success' },
  'At Risk': { color: 'text-amber-600', bg: 'badge-warning' },
  'Breached': { color: 'text-red-600', bg: 'badge-danger' },
  'Met': { color: 'text-emerald-600', bg: 'badge-success' },
};

export const STATUSES = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

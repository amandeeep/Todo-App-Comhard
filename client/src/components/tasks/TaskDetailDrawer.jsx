import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Edit2, Trash2, Clock, Calendar, Target, Tag, History } from 'lucide-react';
import { fetchTaskById, clearCurrentTask, updateTaskStatus } from '../../features/tasks/tasksSlice';
import { StatusBadge, PriorityBadge, SlaBadge } from '../common';
import { formatDateTime, formatDuration, formatTimeAgo, getSlaTimeRemaining, STATUSES } from '../../utils/helpers';

export default function TaskDetailDrawer({ taskId, isOpen, onClose, onEdit, onDelete }) {
  const dispatch = useDispatch();
  const { currentTask } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (taskId && isOpen) {
      dispatch(fetchTaskById(taskId));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [taskId, isOpen, dispatch]);

  if (!isOpen) return null;

  const task = currentTask;
  const slaInfo = task ? getSlaTimeRemaining(task) : null;

  const handleStatusChange = (newStatus) => {
    if (task && task._id) {
      dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-surface-950/50 backdrop-blur-sm transition-opacity" />

      {/* Drawer Content */}
      <div
        className="relative z-10 w-full max-w-xl bg-white dark:bg-surface-900 shadow-2xl border-l border-surface-200 dark:border-surface-800 overflow-y-auto flex flex-col h-full animate-[slideInRight_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {!task ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
              <p className="text-xs text-surface-400">Loading task details...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-200/80 dark:border-surface-800 px-6 py-4.5 bg-surface-50/50 dark:bg-surface-900/60 sticky top-0 z-20 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(task)}
                  className="btn-ghost btn-icon p-2 text-surface-500 hover:text-surface-900 dark:hover:text-surface-100"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="btn-ghost btn-icon p-2 text-surface-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="btn-ghost btn-icon p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
                  title="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              {/* Title & Description */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-surface-900 dark:text-surface-100 leading-snug">
                  {task.title}
                </h2>
                {task.description ? (
                  <p className="mt-3 text-sm text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">
                    {task.description}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-surface-400">No description provided.</p>
                )}
              </div>

              {/* Quick Status Stage Selector */}
              <div className="p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/70 dark:border-surface-700/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2">
                  Update Stage
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        task.status === s
                          ? 'bg-primary-600 text-white font-semibold shadow-2xs'
                          : 'bg-white dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-100 border border-surface-200 dark:border-surface-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* SLA Tracking Center */}
              {slaInfo && (
                <div
                  className={`rounded-2xl p-5 border transition-all ${
                    slaInfo.type === 'breached'
                      ? 'bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-800/60'
                      : slaInfo.type === 'at-risk'
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                      : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold flex items-center gap-2 text-surface-900 dark:text-surface-100">
                      <Target className="w-4 h-4 text-primary-500" /> SLA Target Countdown
                    </span>
                    <SlaBadge slaStatus={task.slaStatus} slaText={slaInfo.text} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-surface-500 mt-2">
                    <span>Configured SLA Duration:</span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">
                      {formatDuration(task.slaDurationMinutes)}
                    </span>
                  </div>
                </div>
              )}

              {/* Key Metadata Grid */}
              <div className="rounded-2xl border border-surface-200/80 dark:border-surface-800 p-4 space-y-3 bg-white dark:bg-surface-900/60">
                <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-1">
                  Task Specifications
                </p>
                {[
                  { icon: Calendar, label: 'Start Date', value: formatDateTime(task.startAt) },
                  { icon: Calendar, label: 'Due Date', value: formatDateTime(task.dueAt) },
                  { icon: Clock, label: 'Estimated Time', value: formatDuration(task.estimatedDurationMinutes) },
                  { icon: Clock, label: 'Actual Duration', value: formatDuration(task.actualDurationMinutes) },
                  { icon: Clock, label: 'Time Spent', value: formatDuration(task.timeSpentMinutes) },
                  { icon: Calendar, label: 'Completed At', value: formatDateTime(task.completedAt) },
                  { icon: Calendar, label: 'Created', value: formatTimeAgo(task.createdAt) },
                  { icon: Calendar, label: 'Last Modified', value: formatTimeAgo(task.updatedAt) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2 text-surface-500">
                      <Icon className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                      <span>{label}</span>
                    </div>
                    <span className="font-medium text-surface-900 dark:text-surface-100 text-right">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tags Section */}
              {task.tags?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-surface-400">
                    <Tag className="w-3.5 h-3.5" /> Associated Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-neutral text-xs font-normal px-2.5 py-1"
                      >
                        <span className="text-primary-500 font-semibold">#</span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              {task.activity?.length > 0 && (
                <div className="pt-2">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-surface-400 mb-3">
                    <History className="w-3.5 h-3.5" /> Activity Timeline
                  </h4>
                  <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-200 dark:before:bg-surface-800">
                    {task.activity.slice().reverse().slice(0, 10).map((entry, i) => (
                      <div key={i} className="relative flex items-start gap-3 text-xs">
                        <div className="absolute -left-4 mt-1 h-2 w-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-surface-900" />
                        <div>
                          <p className="text-surface-800 dark:text-surface-200 font-medium">
                            {entry.action === 'status_change' && `Status changed from "${entry.oldValue}" to "${entry.newValue}"`}
                            {entry.action === 'priority_change' && `Priority updated from "${entry.oldValue}" to "${entry.newValue}"`}
                            {entry.action === 'created' && 'Task created'}
                            {entry.action === 'completed' && 'Task marked as completed'}
                            {entry.action === 'reopened' && 'Task reopened'}
                            {entry.action === 'deleted' && 'Task deleted'}
                          </p>
                          <p className="text-[11px] text-surface-400 mt-0.5">{formatTimeAgo(entry.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

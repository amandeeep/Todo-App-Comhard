import { useDispatch, useSelector } from 'react-redux';
import { CheckSquare, Square, Clock, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { toggleTaskSelection, selectAllTasks, clearSelection, updateTaskStatus } from '../../features/tasks/tasksSlice';
import { StatusBadge, PriorityBadge, SlaBadge, TaskListSkeleton } from '../common';
import { formatDateShort, formatDuration, getSlaTimeRemaining, getDueDateColor, isOverdue } from '../../utils/helpers';
import Pagination from '../common/Pagination';

export default function ListView({ onTaskClick, onEditTask, onDeleteTask }) {
  const dispatch = useDispatch();
  const { items: tasks, selectedTasks, isLoading } = useSelector((state) => state.tasks);

  const allSelected = tasks.length > 0 && selectedTasks.length === tasks.length;

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllTasks());
    }
  };

  const handleCompleteToggle = (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
  };

  if (isLoading) {
    return <TaskListSkeleton rows={8} />;
  }

  return (
    <div className="space-y-4">
      {/* Table Card Container */}
      <div className="card !p-0 overflow-hidden shadow-xs border border-surface-200/90 dark:border-surface-800">
        {/* Table Header */}
        <div className="hidden md:flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider bg-surface-50/80 dark:bg-surface-800/40 border-b border-surface-200/70 dark:border-surface-800">
          <div className="w-6">
            <button
              onClick={handleSelectAll}
              className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors cursor-pointer"
              title={allSelected ? 'Deselect all' : 'Select all'}
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex-1 min-w-0">Task Overview</div>
          <div className="w-28 text-center">Status</div>
          <div className="w-24 text-center">Priority</div>
          <div className="w-28 text-center">Due Date</div>
          <div className="w-20 text-center">Est. Time</div>
          <div className="w-24 text-center">SLA</div>
          <div className="w-14 text-right">Actions</div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-surface-100 dark:divide-surface-800/80">
          {tasks.map((task) => {
            const isSelected = selectedTasks.includes(task._id);
            const slaInfo = getSlaTimeRemaining(task);
            const overdue = isOverdue(task);

            return (
              <div
                key={task._id}
                onClick={() => onTaskClick(task._id)}
                className={`flex flex-col md:flex-row md:items-center gap-3 px-5 py-3.5 transition-all cursor-pointer group hover:bg-surface-50/90 dark:hover:bg-surface-800/50 ${
                  isSelected
                    ? 'bg-primary-50/60 dark:bg-primary-950/30 border-l-3 border-primary-500'
                    : 'border-l-3 border-transparent'
                }`}
              >
                {/* Mobile & Desktop Header Line */}
                <div className="flex items-start md:items-center gap-3 flex-1 min-w-0">
                  {/* Checkbox */}
                  <div className="w-5 shrink-0 pt-0.5 md:pt-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => dispatch(toggleTaskSelection(task._id))}
                      className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Complete status circle toggle */}
                  <div className="shrink-0 pt-0.5 md:pt-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCompleteToggle(task)}
                      className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'Done'
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-2xs'
                          : 'border-surface-300 hover:border-emerald-500 dark:border-surface-600 dark:hover:border-emerald-400'
                      }`}
                      title={task.status === 'Done' ? 'Mark as incomplete' : 'Mark as done'}
                    >
                      {task.status === 'Done' && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3.5 8.5l3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold tracking-tight transition-colors ${
                          task.status === 'Done'
                            ? 'line-through text-surface-400 dark:text-surface-500'
                            : 'text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-0.5 text-xs text-surface-500 dark:text-surface-400 truncate max-w-xl">
                        {task.description}
                      </p>
                    )}

                    {/* Tags */}
                    {task.tags?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {task.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-medium text-surface-500 bg-surface-100 dark:bg-surface-800 dark:text-surface-400 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {task.tags.length > 3 && (
                          <span className="text-[10px] text-surface-400 px-1 py-0.5">
                            +{task.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges on Mobile */}
                <div className="flex flex-wrap items-center gap-2 md:hidden pl-8">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                  {task.dueAt && (
                    <span className={`text-xs font-medium ${getDueDateColor(task)} flex items-center gap-1`}>
                      <Calendar className="w-3 h-3" /> {formatDateShort(task.dueAt)}
                    </span>
                  )}
                  {slaInfo && <SlaBadge slaStatus={task.slaStatus} slaText={slaInfo.text} />}
                </div>

                {/* Status Column (Desktop) */}
                <div className="hidden md:flex w-28 justify-center shrink-0">
                  <StatusBadge status={task.status} />
                </div>

                {/* Priority Column (Desktop) */}
                <div className="hidden md:flex w-24 justify-center shrink-0">
                  <PriorityBadge priority={task.priority} />
                </div>

                {/* Due Date Column (Desktop) */}
                <div
                  className={`hidden md:flex w-28 items-center justify-center gap-1.5 text-xs font-medium shrink-0 ${getDueDateColor(
                    task
                  )}`}
                >
                  {overdue ? <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" /> : <Calendar className="w-3.5 h-3.5 text-surface-400 shrink-0" />}
                  <span>{formatDateShort(task.dueAt)}</span>
                </div>

                {/* Duration Column (Desktop) */}
                <div className="hidden md:flex w-20 items-center justify-center gap-1 text-xs text-surface-500 shrink-0">
                  <Clock className="w-3 h-3 text-surface-400" />
                  <span>{formatDuration(task.estimatedDurationMinutes)}</span>
                </div>

                {/* SLA Column (Desktop) */}
                <div className="hidden md:flex w-24 justify-center shrink-0">
                  {slaInfo ? (
                    <SlaBadge slaStatus={task.slaStatus} slaText={slaInfo.text} />
                  ) : (
                    <span className="text-xs text-surface-300 dark:text-surface-600">—</span>
                  )}
                </div>

                {/* Row Hover Actions (Desktop) */}
                <div
                  className="hidden md:flex w-14 items-center justify-end gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEditTask(task)}
                    className="p-1 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-200/60 dark:hover:bg-surface-700 transition-colors"
                    title="Edit task"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task._id)}
                    className="p-1 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Footer */}
      <Pagination />
    </div>
  );
}

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, Plus, Calendar, Edit2 } from 'lucide-react';
import { updateTaskStatus } from '../../features/tasks/tasksSlice';
import { PriorityBadge, SlaBadge } from '../common';
import { formatDateShort, getSlaTimeRemaining, getDueDateColor, STATUSES } from '../../utils/helpers';

const SECTION_CONFIG = {
  'Backlog': { dot: 'bg-surface-400', badge: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-300' },
  'To Do': { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  'In Progress': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  'In Review': { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
  'Done': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
};

export default function SectionView({ onTaskClick, onEditTask, onCreateTask }) {
  const dispatch = useDispatch();
  const { items: tasks, isLoading } = useSelector((state) => state.tasks);
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCompleteToggle = (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done';
    dispatch(updateTaskStatus({ id: task._id, status: newStatus }));
  };

  // Group tasks by status
  const groupedTasks = {};
  STATUSES.forEach((status) => {
    groupedTasks[status] = tasks.filter((t) => t.status === status);
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card space-y-3">
            <div className="skeleton h-6 w-36" />
            <div className="skeleton h-14 w-full rounded-xl" />
            <div className="skeleton h-14 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {STATUSES.map((status) => {
        const sectionTasks = groupedTasks[status] || [];
        const isCollapsed = collapsedSections[status];
        const config = SECTION_CONFIG[status] || SECTION_CONFIG['Backlog'];

        return (
          <div
            key={status}
            className="rounded-2xl border border-surface-200/90 dark:border-surface-800 bg-white dark:bg-surface-900/70 shadow-2xs overflow-hidden transition-all"
          >
            {/* Section Header */}
            <div
              onClick={() => toggleSection(status)}
              className="flex items-center justify-between px-5 py-3.5 bg-surface-50/70 dark:bg-surface-800/40 hover:bg-surface-100/70 dark:hover:bg-surface-800/70 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-surface-400">
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-xs`} />
                <span className="text-sm font-bold text-surface-900 dark:text-surface-100">{status}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border border-surface-200/60 dark:border-surface-700/60 ${config.badge}`}>
                  {sectionTasks.length}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateTask(status);
                }}
                className="btn-ghost btn-xs text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 gap-1"
                title={`Add task in ${status}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>

            {/* Section Tasks */}
            {!isCollapsed && (
              <div className="divide-y divide-surface-100 dark:divide-surface-800/80">
                {sectionTasks.length === 0 ? (
                  <div className="px-5 py-8 text-center text-xs text-surface-400">
                    No tasks in this section.{' '}
                    <button
                      onClick={() => onCreateTask(status)}
                      className="text-primary-600 dark:text-primary-400 hover:underline font-semibold ml-1 cursor-pointer"
                    >
                      + Add one now
                    </button>
                  </div>
                ) : (
                  sectionTasks.map((task) => {
                    const slaInfo = getSlaTimeRemaining(task);

                    return (
                      <div
                        key={task._id}
                        onClick={() => onTaskClick(task._id)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface-50/80 dark:hover:bg-surface-800/40 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                          {/* Checkbox circle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompleteToggle(task);
                            }}
                            className={`w-4.5 h-4.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all mt-0.5 sm:mt-0 ${
                              task.status === 'Done'
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-2xs'
                                : 'border-surface-300 hover:border-emerald-500 dark:border-surface-600'
                            }`}
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

                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-sm font-semibold tracking-tight ${
                                task.status === 'Done'
                                  ? 'line-through text-surface-400 dark:text-surface-500'
                                  : 'text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.description && (
                              <p className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-lg mt-0.5">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex items-center gap-2.5 shrink-0 pl-7 sm:pl-0">
                          <PriorityBadge priority={task.priority} />

                          {task.dueAt && (
                            <span className={`text-xs font-medium flex items-center gap-1 ${getDueDateColor(task)}`}>
                              <Calendar className="w-3 h-3" />
                              {formatDateShort(task.dueAt)}
                            </span>
                          )}

                          {slaInfo && <SlaBadge slaStatus={task.slaStatus} slaText={slaInfo.text} />}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask(task);
                            }}
                            className="p-1 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-200/60 dark:hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit task"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

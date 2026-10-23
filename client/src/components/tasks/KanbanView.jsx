import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, GripVertical, Calendar, Clock } from 'lucide-react';
import { fetchTasksByStatus, updateTaskStatus } from '../../features/tasks/tasksSlice';
import { PriorityBadge, SlaBadge } from '../common';
import { formatDateShort, formatDuration, getSlaTimeRemaining, getDueDateColor, STATUSES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLUMN_CONFIG = {
  'Backlog': {
    header: 'bg-surface-100/80 dark:bg-surface-800/80 border-surface-200/90 dark:border-surface-700',
    dot: 'bg-surface-400',
    accent: 'border-t-surface-400',
  },
  'To Do': {
    header: 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-800/40',
    dot: 'bg-blue-500',
    accent: 'border-t-blue-500',
  },
  'In Progress': {
    header: 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-800/40',
    dot: 'bg-amber-500',
    accent: 'border-t-amber-500',
  },
  'In Review': {
    header: 'bg-purple-50/80 dark:bg-purple-950/30 border-purple-200/60 dark:border-purple-800/40',
    dot: 'bg-purple-500',
    accent: 'border-t-purple-500',
  },
  'Done': {
    header: 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/40',
    dot: 'bg-emerald-500',
    accent: 'border-t-emerald-500',
  },
};

export default function KanbanView({ onTaskClick, onCreateTask }) {
  const dispatch = useDispatch();
  const { byStatus, isLoading, filters } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasksByStatus({
      search: filters.search || undefined,
      priority: filters.priority || undefined,
      tags: filters.tags || undefined,
      slaStatus: filters.slaStatus || undefined,
      columnLimit: 50,
    }));
  }, [dispatch, filters.search, filters.priority, filters.tags, filters.slaStatus]);

  const handleDragEnd = useCallback(async (result) => {
    if (!result.destination) return;
    const { draggableId, destination, source } = result;
    const newStatus = destination.droppableId;

    if (source.droppableId === newStatus && source.index === destination.index) {
      return;
    }

    try {
      await dispatch(updateTaskStatus({ id: draggableId, status: newStatus })).unwrap();
      dispatch(fetchTasksByStatus({
        search: filters.search || undefined,
        priority: filters.priority || undefined,
        tags: filters.tags || undefined,
        slaStatus: filters.slaStatus || undefined,
        columnLimit: 50,
      }));
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  }, [dispatch, filters]);

  if (isLoading && Object.keys(byStatus).length === 0) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map((s) => (
          <div key={s} className="flex-shrink-0 w-72 lg:w-80">
            <div className="skeleton h-12 w-full rounded-t-xl" />
            <div className="space-y-3 mt-3">
              <div className="skeleton h-32 w-full rounded-xl" />
              <div className="skeleton h-32 w-full rounded-xl" />
              <div className="skeleton h-32 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 h-[calc(100vh-235px)] scrollbar-thin">
        {STATUSES.map((status) => {
          const column = byStatus[status] || { tasks: [], totalCount: 0 };
          const config = COLUMN_CONFIG[status] || COLUMN_CONFIG['Backlog'];

          return (
            <div
              key={status}
              className="flex flex-col flex-shrink-0 w-76 lg:w-82 rounded-2xl border border-surface-200/90 dark:border-surface-800 bg-surface-50/40 dark:bg-surface-900/40 shadow-2xs overflow-hidden"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between px-4 py-3 border-b ${config.header}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${config.dot} shadow-xs`} />
                  <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100">{status}</h3>
                  <span className="text-xs font-semibold text-surface-500 bg-white/80 dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/60 rounded-full px-2 py-0.5 shadow-2xs">
                    {column.totalCount}
                  </span>
                </div>
                <button
                  onClick={() => onCreateTask(status)}
                  className="p-1.5 rounded-lg text-surface-500 hover:text-surface-900 hover:bg-white/80 dark:hover:bg-surface-700/80 transition-all cursor-pointer"
                  title={`Add task to ${status}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Column Droppable Container */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 overflow-y-auto p-2.5 space-y-2.5 transition-colors scrollbar-thin ${
                      snapshot.isDraggingOver
                        ? 'bg-primary-50/60 dark:bg-primary-950/20'
                        : 'bg-transparent'
                    }`}
                  >
                    {column.tasks.map((task, index) => {
                      const slaInfo = getSlaTimeRemaining(task);

                      return (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              onClick={() => onTaskClick(task._id)}
                              className={`group relative rounded-xl border bg-white dark:bg-surface-800/90 p-3.5 cursor-pointer transition-all duration-150 ${
                                snapshot.isDragging
                                  ? 'border-primary-500 shadow-2xl rotate-1 scale-102 z-50 ring-2 ring-primary-500/20'
                                  : 'border-surface-200/90 dark:border-surface-700/80 shadow-2xs hover:shadow-md hover:border-surface-300 dark:hover:border-surface-600'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mt-0.5 text-surface-300 group-hover:text-surface-500 transition-colors cursor-grab active:cursor-grabbing p-0.5"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  {/* Task Title */}
                                  <p
                                    className={`text-sm font-semibold tracking-tight leading-snug ${
                                      task.status === 'Done'
                                        ? 'line-through text-surface-400 dark:text-surface-500'
                                        : 'text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'
                                    }`}
                                  >
                                    {task.title}
                                  </p>

                                  {/* Description Snippet */}
                                  {task.description && (
                                    <p className="mt-1 text-xs text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
                                      {task.description}
                                    </p>
                                  )}

                                  {/* Metadata Badges */}
                                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-surface-100 dark:border-surface-700/50">
                                    <PriorityBadge priority={task.priority} />

                                    {task.dueAt && (
                                      <span
                                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${getDueDateColor(
                                          task
                                        )}`}
                                      >
                                        <Calendar className="w-3 h-3" />
                                        {formatDateShort(task.dueAt)}
                                      </span>
                                    )}

                                    {task.estimatedDurationMinutes > 0 && (
                                      <span className="inline-flex items-center gap-1 text-[11px] text-surface-400">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(task.estimatedDurationMinutes)}
                                      </span>
                                    )}
                                  </div>

                                  {/* SLA and Tags */}
                                  {(slaInfo || (task.tags && task.tags.length > 0)) && (
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                      {slaInfo && <SlaBadge slaStatus={task.slaStatus} slaText={slaInfo.text} />}
                                      {task.tags?.slice(0, 2).map((tag) => (
                                        <span
                                          key={tag}
                                          className="text-[10px] font-medium text-surface-400 dark:text-surface-500 bg-surface-100 dark:bg-surface-700/60 px-1.5 py-0.5 rounded"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {column.tasks.length === 0 && (
                      <div
                        onClick={() => onCreateTask(status)}
                        className="flex flex-col items-center justify-center py-10 px-4 rounded-xl border border-dashed border-surface-200 dark:border-surface-800 text-center hover:bg-white/60 dark:hover:bg-surface-800/40 transition-colors cursor-pointer group"
                      >
                        <Plus className="w-5 h-5 text-surface-400 group-hover:text-primary-500 transition-colors mb-1" />
                        <span className="text-xs font-medium text-surface-500 group-hover:text-surface-700 dark:group-hover:text-surface-300">
                          Add a task
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

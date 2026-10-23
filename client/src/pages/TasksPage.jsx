import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Plus, List, LayoutGrid, Columns3, Trash2, CheckCircle2 } from 'lucide-react';
import { fetchTasks, setFilters, setActiveView, clearSelection, bulkUpdateTasks, deleteTask } from '../features/tasks/tasksSlice';
import { fetchSections } from '../features/sections/sectionsSlice';
import FilterToolbar from '../components/filters/FilterToolbar';
import ListView from '../components/tasks/ListView';
import SectionView from '../components/tasks/SectionView';
import KanbanView from '../components/tasks/KanbanView';
import TaskFormModal from '../components/tasks/TaskFormModal';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import { ConfirmDialog, EmptyState } from '../components/common';
import { ListTodo } from 'lucide-react';
import toast from 'react-hot-toast';

const VIEW_ICONS = {
  list: List,
  section: Columns3,
  kanban: LayoutGrid,
};

export default function TasksPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: tasks, filters, pagination, activeView, selectedTasks, isLoading } = useSelector((state) => state.tasks);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [detailTaskId, setDetailTaskId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('');

  // Sync URL params with filters on mount
  useEffect(() => {
    const urlFilters = {};
    ['status', 'priority', 'search', 'dueToday', 'dueThisWeek', 'overdue', 'slaStatus', 'tags'].forEach((key) => {
      const val = searchParams.get(key);
      if (val) urlFilters[key] = val;
    });
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setFilters(urlFilters));
    }
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  // Fetch tasks when filters or page changes
  useEffect(() => {
    if (activeView !== 'kanban') {
      dispatch(fetchTasks({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      }));
    }
  }, [dispatch, filters, pagination.page, pagination.limit, activeView]);

  // Fetch sections for section view and form
  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);

  const handleTaskClick = useCallback((taskId) => {
    setDetailTaskId(taskId);
    setShowDetail(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  }, []);

  const handleCreateTask = useCallback((status = '') => {
    setDefaultStatus(status);
    setEditingTask(null);
    setShowCreateModal(true);
  }, []);

  const handleDeleteTask = useCallback((taskId) => {
    setDeleteConfirm(taskId);
  }, []);

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await dispatch(deleteTask(deleteConfirm)).unwrap();
        toast.success('Task deleted');
        setShowDetail(false);
      } catch {
        toast.error('Failed to delete task');
      }
      setDeleteConfirm(null);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTask(null);
    setDefaultStatus('');
    if (activeView !== 'kanban') {
      dispatch(fetchTasks({ page: pagination.page, limit: pagination.limit, ...filters }));
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedTasks) {
      await dispatch(deleteTask(id));
    }
    dispatch(clearSelection());
    toast.success(`Deleted ${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''}`);
  };

  const handleBulkStatusChange = async (status) => {
    await dispatch(bulkUpdateTasks({ taskIds: selectedTasks, status }));
    dispatch(fetchTasks({ page: pagination.page, limit: pagination.limit, ...filters }));
    toast.success(`Updated ${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''}`);
  };

  return (
    <div className="space-y-5 max-w-7xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
              Tasks
            </h1>
            <span className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-xs font-bold text-surface-600 dark:text-surface-300 border border-surface-200/80 dark:border-surface-700/80">
              {pagination.totalItems} {pagination.totalItems === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Organize, prioritize, and track your deliverables across synchronized views
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented View Switcher */}
          <div className="flex items-center rounded-xl border border-surface-200/90 dark:border-surface-700/90 bg-surface-100/70 dark:bg-surface-800/80 p-1 shadow-2xs">
            {['list', 'section', 'kanban'].map((view) => {
              const Icon = VIEW_ICONS[view];
              const isActive = activeView === view;
              return (
                <button
                  key={view}
                  onClick={() => dispatch(setActiveView(view))}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-surface-900 text-primary-600 dark:text-primary-400 shadow-xs'
                      : 'text-surface-500 hover:text-surface-900 dark:hover:text-surface-200'
                  }`}
                  title={`${view.charAt(0).toUpperCase() + view.slice(1)} View`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline capitalize">{view}</span>
                </button>
              );
            })}
          </div>

          <button onClick={() => handleCreateTask()} className="btn-primary shadow-sm shadow-primary-500/20">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar />

      {/* Floating Bulk Action Banner */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-primary-600 text-white px-5 py-3 shadow-xl animate-[scaleUp_0.2s_ease-out]">
          <span className="text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <select
              onChange={(e) => {
                if (e.target.value) handleBulkStatusChange(e.target.value);
                e.target.value = '';
              }}
              className="rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 font-medium outline-none border border-white/30 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled className="text-surface-900">
                Move status to...
              </option>
              <option value="Backlog" className="text-surface-900">Backlog</option>
              <option value="To Do" className="text-surface-900">To Do</option>
              <option value="In Progress" className="text-surface-900">In Progress</option>
              <option value="In Review" className="text-surface-900">In Review</option>
              <option value="Done" className="text-surface-900">Done</option>
            </select>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
            <button
              onClick={() => dispatch(clearSelection())}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* View Contents */}
      {activeView === 'list' && (
        tasks.length === 0 && !isLoading ? (
          <EmptyState
            icon={ListTodo}
            title="No tasks match your criteria"
            description="Create a new task to get started, or clear filters to see more tasks."
            action={
              <button onClick={() => handleCreateTask()} className="btn-primary">
                <Plus className="w-4 h-4" /> Create Task
              </button>
            }
          />
        ) : (
          <ListView
            onTaskClick={handleTaskClick}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )
      )}

      {activeView === 'section' && (
        <SectionView
          onTaskClick={handleTaskClick}
          onEditTask={handleEditTask}
          onCreateTask={handleCreateTask}
        />
      )}

      {activeView === 'kanban' && (
        <KanbanView
          onTaskClick={handleTaskClick}
          onCreateTask={handleCreateTask}
        />
      )}

      {/* Task Creation / Editing Modal */}
      <TaskFormModal
        isOpen={showCreateModal}
        onClose={handleCloseModal}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        taskId={detailTaskId}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}

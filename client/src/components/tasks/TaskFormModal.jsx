import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Calendar, Clock, Tag, AlertCircle, Sparkles, Check, Target } from 'lucide-react';
import { createTask, updateTask } from '../../features/tasks/tasksSlice';
import { STATUSES } from '../../utils/helpers';
import toast from 'react-hot-toast';

const defaultForm = {
  title: '',
  description: '',
  status: 'To Do',
  priority: 'Medium',
  startAt: '',
  dueAt: '',
  estimatedDurationMinutes: '',
  slaDurationMinutes: '',
  tags: '',
  sectionId: '',
};

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'text-blue-500', activeBg: 'bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300' },
  { value: 'Medium', label: 'Medium', color: 'text-amber-500', activeBg: 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' },
  { value: 'High', label: 'High', color: 'text-orange-500', activeBg: 'bg-orange-50 border-orange-400 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300' },
  { value: 'Urgent', label: 'Urgent', color: 'text-red-500', activeBg: 'bg-red-50 border-red-400 text-red-700 dark:bg-red-950/50 dark:text-red-300' },
];

export default function TaskFormModal({ isOpen, onClose, task = null, defaultStatus = '' }) {
  const dispatch = useDispatch();
  const { isCreating, isUpdating } = useSelector((state) => state.tasks);
  const { items: sections } = useSelector((state) => state.sections);
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        startAt: task.startAt ? new Date(task.startAt).toISOString().slice(0, 16) : '',
        dueAt: task.dueAt ? new Date(task.dueAt).toISOString().slice(0, 16) : '',
        estimatedDurationMinutes: task.estimatedDurationMinutes || '',
        slaDurationMinutes: task.slaDurationMinutes || '',
        tags: (task.tags || []).join(', '),
        sectionId: task.sectionId || '',
      });
    } else {
      setForm({ ...defaultForm, status: defaultStatus || 'To Do' });
    }
    setErrors({});
  }, [task, isOpen, defaultStatus]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 300) errs.title = 'Title is too long';
    if (form.dueAt && form.startAt && new Date(form.dueAt) < new Date(form.startAt)) {
      errs.dueAt = 'Due date must be after start date';
    }
    if (form.estimatedDurationMinutes && Number(form.estimatedDurationMinutes) < 0) {
      errs.estimatedDurationMinutes = 'Duration cannot be negative';
    }
    if (form.slaDurationMinutes && Number(form.slaDurationMinutes) < 0) {
      errs.slaDurationMinutes = 'SLA duration cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      estimatedDurationMinutes: form.estimatedDurationMinutes ? Number(form.estimatedDurationMinutes) : null,
      slaDurationMinutes: form.slaDurationMinutes ? Number(form.slaDurationMinutes) : null,
      startAt: form.startAt || null,
      dueAt: form.dueAt || null,
      sectionId: form.sectionId || null,
    };

    try {
      if (task) {
        await dispatch(updateTask({ id: task._id, data })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(data)).unwrap();
        toast.success('Task created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(err || 'Operation failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-2xl border border-surface-200 dark:border-surface-700/80 p-6 sm:p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md shadow-primary-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                {task ? 'Edit Task Details' : 'Create New Task'}
              </h2>
              <p className="text-xs text-surface-400">
                {task ? 'Modify attributes, schedule, and SLA tracking' : 'Add deliverables with SLA timing to your workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              Task Title <span className="text-danger">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Implement user authentication flow"
              className={`input text-sm font-medium ${errors.title ? 'input-error' : ''}`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-danger flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              Description & Context
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide background, checklist, or acceptance criteria..."
              className="input resize-none leading-relaxed text-sm"
            />
          </div>

          {/* Status Selection Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-2">
              Status Stage
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => {
                const isSelected = form.status === s;
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                        : 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-surface-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority Visual Radio Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-2">
              Priority Urgency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRIORITY_OPTIONS.map((opt) => {
                const isSelected = form.priority === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm((prev) => ({ ...prev, priority: opt.value }))}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.activeBg} ring-2 ring-primary-500/20 shadow-2xs`
                        : 'bg-white dark:bg-surface-800/80 border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:border-surface-300'
                    }`}
                  >
                    <span className={opt.color}>●</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Assignment */}
          {sections && sections.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                Section / Category
              </label>
              <select name="sectionId" value={form.sectionId} onChange={handleChange} className="select text-sm">
                <option value="">Default (No section)</option>
                {sections.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Dates Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                <Calendar className="inline w-3.5 h-3.5 mr-1 text-surface-400" /> Start Date
              </label>
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                <Calendar className="inline w-3.5 h-3.5 mr-1 text-surface-400" /> Due Date
              </label>
              <input
                type="datetime-local"
                name="dueAt"
                value={form.dueAt}
                onChange={handleChange}
                className={`input text-sm ${errors.dueAt ? 'input-error' : ''}`}
              />
              {errors.dueAt && (
                <p className="mt-1.5 text-xs text-danger font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.dueAt}
                </p>
              )}
            </div>
          </div>

          {/* Duration & SLA Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                <Clock className="inline w-3.5 h-3.5 mr-1 text-surface-400" /> Estimated Duration (min)
              </label>
              <input
                type="number"
                name="estimatedDurationMinutes"
                value={form.estimatedDurationMinutes}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 120 (2 hrs)"
                className="input text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
                <Target className="inline w-3.5 h-3.5 mr-1 text-primary-500" /> SLA Target (min)
              </label>
              <input
                type="number"
                name="slaDurationMinutes"
                value={form.slaDurationMinutes}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 480 (8 hrs)"
                className="input text-sm"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              <Tag className="inline w-3.5 h-3.5 mr-1 text-surface-400" /> Tags
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g. frontend, backend, bug, release (comma separated)"
              className="input text-sm"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary shadow-md shadow-primary-500/25"
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

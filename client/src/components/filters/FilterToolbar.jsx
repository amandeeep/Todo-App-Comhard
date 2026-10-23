import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X, ArrowUpDown, Tag, Check } from 'lucide-react';
import { setFilters, clearFilters } from '../../features/tasks/tasksSlice';
import { useClickOutside } from '../../hooks';
import { STATUSES, PRIORITIES } from '../../utils/helpers';

const SLA_OPTIONS = ['On Track', 'At Risk', 'Breached', 'Met'];

export default function FilterToolbar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.tasks);
  const [showFilters, setShowFilters] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setShowFilters(false));

  const activeFilterCount = [
    filters.status,
    filters.priority,
    filters.tags,
    filters.slaStatus,
    filters.dueToday,
    filters.dueThisWeek,
    filters.overdue,
  ].filter(Boolean).length;

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const activeChips = [];
  if (filters.status) {
    filters.status.split(',').forEach((s) =>
      activeChips.push({ key: 'status', value: s, label: `Status: ${s}` })
    );
  }
  if (filters.priority) {
    filters.priority.split(',').forEach((p) =>
      activeChips.push({ key: 'priority', value: p, label: `Priority: ${p}` })
    );
  }
  if (filters.slaStatus) {
    filters.slaStatus.split(',').forEach((s) =>
      activeChips.push({ key: 'slaStatus', value: s, label: `SLA: ${s}` })
    );
  }
  if (filters.overdue === 'true') activeChips.push({ key: 'overdue', value: '', label: 'Overdue' });
  if (filters.dueToday === 'true') activeChips.push({ key: 'dueToday', value: '', label: 'Due Today' });
  if (filters.dueThisWeek === 'true') activeChips.push({ key: 'dueThisWeek', value: '', label: 'Due This Week' });
  if (filters.tags) {
    filters.tags.split(',').forEach((t) =>
      activeChips.push({ key: 'tags', value: t.trim(), label: `#${t.trim()}` })
    );
  }

  const removeChip = (chip) => {
    if (chip.key === 'overdue' || chip.key === 'dueToday' || chip.key === 'dueThisWeek') {
      dispatch(setFilters({ [chip.key]: '' }));
      return;
    }
    const current = filters[chip.key] || '';
    const values = current.split(',').map((v) => v.trim()).filter((v) => v !== chip.value);
    dispatch(setFilters({ [chip.key]: values.join(',') }));
  };

  const toggleMultiFilter = (key, value) => {
    const current = filters[key] || '';
    const values = current ? current.split(',').map((v) => v.trim()).filter(Boolean) : [];
    const idx = values.indexOf(value);
    if (idx > -1) {
      values.splice(idx, 1);
    } else {
      values.push(value);
    }
    dispatch(setFilters({ [key]: values.join(',') }));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Filter Dropdown Trigger */}
          <div className="relative" ref={ref}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary btn-sm transition-all duration-150 ${
                activeFilterCount > 0
                  ? 'bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-700/60 ring-2 ring-primary-500/20'
                  : ''
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-primary-500" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white shadow-2xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Popover */}
            {showFilters && (
              <div className="dropdown-menu left-0 w-88 p-4.5 space-y-4 shadow-2xl border border-surface-200/90 dark:border-surface-700 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-surface-100 dark:border-surface-700/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-surface-800 dark:text-surface-200">
                    Filter Tasks
                  </span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={() => dispatch(clearFilters())}
                      className="text-[11px] font-medium text-danger hover:underline cursor-pointer"
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Status Options */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                      const isSelected = (filters.status || '').includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleMultiFilter('status', s)}
                          className={`badge cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-xs'
                              : 'badge-neutral hover:bg-surface-200 dark:hover:bg-surface-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 mr-0.5" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Priority Options */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2">
                    Priority
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRIORITIES.map((p) => {
                      const isSelected = (filters.priority || '').includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => toggleMultiFilter('priority', p)}
                          className={`badge cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-xs'
                              : 'badge-neutral hover:bg-surface-200 dark:hover:bg-surface-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 mr-0.5" />}
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SLA Status Options */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-2">
                    SLA Status
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SLA_OPTIONS.map((s) => {
                      const isSelected = (filters.slaStatus || '').includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleMultiFilter('slaStatus', s)}
                          className={`badge cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-xs'
                              : 'badge-neutral hover:bg-surface-200 dark:hover:bg-surface-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 mr-0.5" />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-1.5">
                    Filter by Tag
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={filters.tags || ''}
                      onChange={(e) => handleFilterChange('tags', e.target.value)}
                      placeholder="e.g. frontend, backend, bug..."
                      className="input !pl-9.5 text-xs py-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Date Toggle Pills */}
          <div className="hidden sm:flex items-center gap-1.5 border-l border-surface-200 dark:border-surface-700/80 pl-2">
            {[
              { key: 'dueToday', label: 'Today', dot: 'bg-amber-500' },
              { key: 'dueThisWeek', label: 'This Week', dot: 'bg-blue-500' },
              { key: 'overdue', label: 'Overdue', dot: 'bg-red-500' },
            ].map(({ key, label, dot }) => {
              const active = filters[key] === 'true';
              return (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key, active ? '' : 'true')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-semibold ring-1 ring-primary-300 dark:ring-primary-700/60'
                      : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort & Order Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-surface-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-surface-400" />
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="select btn-sm !w-auto !py-1 text-xs bg-white dark:bg-surface-800"
            >
              <option value="createdAt">Created Date</option>
              <option value="dueAt">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Task Title</option>
              <option value="status">Status</option>
              <option value="estimatedDurationMinutes">Estimated Time</option>
            </select>
          </div>

          <button
            onClick={() => handleFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            className="btn-secondary btn-sm"
            title={`Sort ${filters.order === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {filters.order === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => dispatch(clearFilters())}
              className="btn-ghost btn-sm text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
              title="Clear all active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mr-1">
            Active Filters:
          </span>
          {activeChips.map((chip, i) => (
            <span
              key={i}
              className="badge badge-primary gap-1.5 py-1 px-2.5 shadow-2xs animate-[fadeIn_0.15s_ease-out]"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => removeChip(chip)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-primary-200 dark:hover:bg-primary-800 text-primary-700 dark:text-primary-300 transition-colors"
                title={`Remove ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => dispatch(clearFilters())}
            className="text-xs text-surface-400 hover:text-danger ml-2 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

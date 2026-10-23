import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, CheckCircle2, AlertTriangle, CalendarDays, Clock, Target,
  TrendingUp, ListTodo, ArrowRight, Shield, ShieldAlert, ShieldCheck, ShieldX,
  Plus, Flame, Check, ChevronRight, Layers
} from 'lucide-react';
import { fetchDashboardStats, fetchSlaStats } from '../features/dashboard/dashboardSlice';
import { Skeleton } from '../components/common';

function StatCard({ icon: Icon, label, value, sublabel, trend, color, glowColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`card card-interactive relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">{label}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
              {value}
            </span>
            {trend && (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                {trend}
              </span>
            )}
          </div>
          {sublabel && (
            <p className="mt-2 text-xs font-medium text-surface-500 dark:text-surface-400">{sublabel}</p>
          )}
        </div>
        <div className={`rounded-xl p-3 shadow-xs ${color} transition-transform duration-200 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {/* Subtle bottom border accent on hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity ${glowColor}`} />
    </div>
  );
}

function SlaCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 rounded-xl border border-surface-200/80 dark:border-surface-800/80 p-3.5 bg-white/70 dark:bg-surface-800/60 backdrop-blur-xs transition-all hover:bg-white dark:hover:bg-surface-800 hover:shadow-xs ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className={`rounded-xl p-2.5 ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-xl font-bold tracking-tight text-surface-900 dark:text-surface-100">{value}</p>
        <p className="text-xs font-medium text-surface-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, slaStats, isLoading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchSlaStats());
  }, [dispatch]);

  if (isLoading && !stats) {
    return (
      <div className="space-y-6 max-w-7xl animate-pulse">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const s = stats || {};
  const sla = slaStats || {};
  const completionRate = s.completionRate || (s.totalTasks > 0 ? Math.round((s.completedTasks / s.totalTasks) * 100) : 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-7 sm:space-y-8 max-w-7xl">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900/80 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-primary-500/10 dark:bg-primary-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="mt-1.5 text-sm text-surface-500 dark:text-surface-400 max-w-xl">
              Track tasks, optimize workflows, and maintain SLA compliance across all stages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/tasks')}
              className="btn-secondary"
            >
              <Layers className="w-4 h-4" /> View All Tasks
            </button>
            <button
              onClick={() => navigate('/tasks?create=true')}
              className="btn-primary shadow-md shadow-primary-500/20"
            >
              <Plus className="w-4 h-4" /> New Task
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          icon={ListTodo}
          label="Total Tasks"
          value={s.totalTasks || 0}
          sublabel={`${completionRate}% overall completion`}
          color="bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
          glowColor="from-primary-500 to-indigo-600"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={s.completedTasks || 0}
          trend={s.completedTasks > 0 ? `${completionRate}% done` : null}
          sublabel="Resolved tasks"
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          glowColor="from-emerald-500 to-teal-600"
          onClick={() => navigate('/tasks?status=Done')}
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={s.overdueTasks || 0}
          sublabel={s.overdueTasks > 0 ? 'Requires immediate action' : 'No overdue tasks'}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          glowColor="from-red-500 to-rose-600"
          onClick={() => navigate('/tasks?overdue=true')}
        />
        <StatCard
          icon={CalendarDays}
          label="Due Today"
          value={s.todayTasks || 0}
          sublabel="Scheduled for today"
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          glowColor="from-amber-500 to-orange-600"
          onClick={() => navigate('/tasks?dueToday=true')}
        />
      </div>

      {/* Middle Section: Status Breakdown & SLA Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
        {/* Status Breakdown Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" /> Status Distribution
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">Click any stage to filter active tasks</p>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
            >
              Open Board <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Segmented Cumulative Bar */}
          {s.totalTasks > 0 && (
            <div className="mb-6">
              <div className="h-3 w-full rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden flex p-0.5 gap-0.5">
                {[
                  { status: 'Backlog', color: 'bg-surface-400' },
                  { status: 'To Do', color: 'bg-blue-500' },
                  { status: 'In Progress', color: 'bg-amber-500' },
                  { status: 'In Review', color: 'bg-purple-500' },
                  { status: 'Done', color: 'bg-emerald-500' },
                ].map(({ status, color }) => {
                  const count = s.statusBreakdown?.[status] || 0;
                  const pct = Math.round((count / s.totalTasks) * 100);
                  if (pct === 0) return null;
                  return (
                    <div
                      key={status}
                      className={`h-full rounded-sm ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                      title={`${status}: ${count} (${pct}%)`}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {[
              { status: 'Backlog', color: 'bg-surface-400', badge: 'text-surface-600 dark:text-surface-300' },
              { status: 'To Do', color: 'bg-blue-500', badge: 'text-blue-600 dark:text-blue-400' },
              { status: 'In Progress', color: 'bg-amber-500', badge: 'text-amber-600 dark:text-amber-400' },
              { status: 'In Review', color: 'bg-purple-500', badge: 'text-purple-600 dark:text-purple-400' },
              { status: 'Done', color: 'bg-emerald-500', badge: 'text-emerald-600 dark:text-emerald-400' },
            ].map(({ status, color }) => {
              const count = s.statusBreakdown?.[status] || 0;
              const pct = s.totalTasks > 0 ? Math.round((count / s.totalTasks) * 100) : 0;
              return (
                <div
                  key={status}
                  onClick={() => navigate(`/tasks?status=${status}`)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer group"
                >
                  <div className={`w-3 h-3 rounded-full shrink-0 ${color} ring-2 ring-white dark:ring-surface-900 group-hover:scale-125 transition-transform`} />
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300 w-24 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {status}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-bold text-surface-800 dark:text-surface-200">
                      {count}
                    </span>
                    <span className="text-xs text-surface-400 ml-1">({pct}%)</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Compliance Center */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-500" /> SLA Compliance Center
              </h3>
              <p className="text-xs text-surface-400 mt-0.5">Real-time deadline tracking & resolution metrics</p>
            </div>
            {sla.totalWithSla > 0 && (
              <span className={`badge ${
                (sla.compliancePercentage || 0) >= 80 ? 'badge-success' :
                (sla.compliancePercentage || 0) >= 50 ? 'badge-warning' : 'badge-danger'
              }`}>
                {(sla.compliancePercentage || 0) >= 80 ? 'High Compliance' : 'Attention Needed'}
              </span>
            )}
          </div>

          {sla.totalWithSla > 0 ? (
            <>
              {/* Compliance Ring Gauge */}
              <div className="flex items-center justify-center my-3">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      className="text-surface-100 dark:text-surface-800"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeWidth="3.2"
                      strokeDasharray={`${sla.compliancePercentage || 0}, 100`}
                      className={`transition-all duration-1000 ${
                        (sla.compliancePercentage || 0) >= 80 ? 'stroke-emerald-500' :
                        (sla.compliancePercentage || 0) >= 50 ? 'stroke-amber-500' : 'stroke-red-500'
                      }`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
                      {sla.compliancePercentage || 0}%
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400 mt-0.5">
                      On-Time SLA
                    </span>
                  </div>
                </div>
              </div>

              {/* SLA Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 mt-4">
                <SlaCard
                  icon={ShieldCheck}
                  label="On Track"
                  value={sla.onTrack || 0}
                  color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  onClick={() => navigate('/tasks?slaStatus=On Track')}
                />
                <SlaCard
                  icon={ShieldAlert}
                  label="At Risk"
                  value={sla.atRisk || 0}
                  color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                  onClick={() => navigate('/tasks?slaStatus=At Risk')}
                />
                <SlaCard
                  icon={ShieldX}
                  label="Breached"
                  value={sla.breached || 0}
                  color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  onClick={() => navigate('/tasks?slaStatus=Breached')}
                />
                <SlaCard
                  icon={Shield}
                  label="Met"
                  value={sla.met || 0}
                  color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  onClick={() => navigate('/tasks?slaStatus=Met')}
                />
              </div>

              {sla.avgCompletionTimeMinutes > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-surface-500 bg-surface-50 dark:bg-surface-800/60 py-2 rounded-xl">
                  <Clock className="w-3.5 h-3.5 text-primary-500" />
                  Average completion time: {Math.floor(sla.avgCompletionTimeMinutes / 60)}h {sla.avgCompletionTimeMinutes % 60}m
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 rounded-xl border border-dashed border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/30">
              <Target className="w-10 h-10 mx-auto text-surface-400 opacity-60 mb-2" />
              <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">No SLA targets configured</p>
              <p className="text-xs text-surface-400 mt-1 max-w-xs mx-auto">
                Set SLA durations when creating tasks to monitor real-time deadline compliance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Priority Distribution Grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-500" /> Priority Distribution
            </h3>
            <p className="text-xs text-surface-400 mt-0.5">Categorized breakdown by urgency</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {[
            {
              priority: 'Urgent',
              icon: Flame,
              color: 'text-red-500',
              bg: 'bg-red-50/70 dark:bg-red-950/20',
              border: 'border-red-200/80 dark:border-red-800/60',
              hover: 'hover:border-red-400',
            },
            {
              priority: 'High',
              icon: AlertTriangle,
              color: 'text-orange-500',
              bg: 'bg-orange-50/70 dark:bg-orange-950/20',
              border: 'border-orange-200/80 dark:border-orange-800/60',
              hover: 'hover:border-orange-400',
            },
            {
              priority: 'Medium',
              icon: TrendingUp,
              color: 'text-amber-500',
              bg: 'bg-amber-50/70 dark:bg-amber-950/20',
              border: 'border-amber-200/80 dark:border-amber-800/60',
              hover: 'hover:border-amber-400',
            },
            {
              priority: 'Low',
              icon: Check,
              color: 'text-blue-500',
              bg: 'bg-blue-50/70 dark:bg-blue-950/20',
              border: 'border-blue-200/80 dark:border-blue-800/60',
              hover: 'hover:border-blue-400',
            },
          ].map(({ priority, icon: Icon, color, bg, border, hover }) => (
            <div
              key={priority}
              onClick={() => navigate(`/tasks?priority=${priority}`)}
              className={`rounded-xl border ${border} ${bg} p-4 text-center cursor-pointer transition-all hover:scale-102 hover:shadow-xs ${hover}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-300">{priority}</span>
              </div>
              <p className={`text-2xl font-extrabold ${color}`}>{s.priorityBreakdown?.[priority] || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

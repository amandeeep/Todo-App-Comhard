import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

const primaryNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListTodo, label: 'All Tasks' },
];

const filterNav = [
  { to: '/tasks?dueToday=true', icon: CalendarDays, label: 'Today', key: 'today', dot: 'bg-amber-500' },
  { to: '/tasks?dueThisWeek=true', icon: CalendarClock, label: 'Upcoming', key: 'upcoming', dot: 'bg-blue-500' },
  { to: '/tasks?overdue=true', icon: AlertTriangle, label: 'Overdue', key: 'overdue', dot: 'bg-red-500' },
  { to: '/tasks?status=Done', icon: CheckCircle2, label: 'Completed', key: 'completed', dot: 'bg-emerald-500' },
];

export default function Sidebar({ isCollapsed, setIsCollapsed, onCloseMobile }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const handleNavClick = () => {
    onCloseMobile?.();
  };

  return (
    <aside
      style={{ width: isCollapsed ? '72px' : '260px' }}
      className="relative flex h-full shrink-0 flex-col border-r border-surface-200/80 bg-white dark:border-surface-800 dark:bg-surface-900 shadow-xs transition-[width] duration-300 select-none z-10"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-surface-200/70 px-4 dark:border-surface-800 shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-primary-400 text-white font-extrabold text-base shadow-md shadow-primary-500/25">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-surface-900 dark:text-surface-100 text-base">
                  TaskFlow
                </span>
                <span className="inline-flex items-center rounded-md bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 border border-primary-200/60 dark:border-primary-800/60">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-surface-400 dark:text-surface-500 font-medium">Workspace</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white font-bold text-base shadow-sm">
            T
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`btn-ghost btn-icon hidden lg:flex p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 ${
            isCollapsed ? 'hidden' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Mobile Close Button */}
        {/* <button
          onClick={onCloseMobile}
          className="btn-ghost btn-icon flex lg:hidden p-1.5 rounded-lg text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
          title="Close menu"
        >
          <X className="w-5 h-5" />
        </button> */}
      </div>

      {/* New Task Button */}
      <div className="p-3.5 shrink-0">
        <button
          onClick={() => {
            navigate('/tasks?create=true');
            handleNavClick();
          }}
          className={`btn-primary w-full shadow-md shadow-primary-500/20 group relative overflow-hidden ${
            isCollapsed ? 'btn-icon justify-center py-2.5 px-0' : 'justify-between py-2.5 px-3.5'
          }`}
          title="Create new task (Ctrl+N)"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            {!isCollapsed && <span className="font-semibold tracking-wide">New Task</span>}
          </div>
          {!isCollapsed && (
            <kbd className="hidden sm:inline-flex items-center rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
              ⌘N
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2 scrollbar-thin">
        {/* Main Section */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">
              Overview
            </p>
          )}
          <div className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/tasks'}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300 font-semibold'
                        : 'text-surface-600 hover:bg-surface-100/70 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800/60 dark:hover:text-surface-200'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-600 dark:bg-primary-400" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300'}`} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500">
              Views & Filters
            </p>
          )}
          <div className="space-y-1">
            {filterNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.key}
                  to={item.to}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary-500/10 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300 font-semibold'
                        : 'text-surface-600 hover:bg-surface-100/70 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800/60 dark:hover:text-surface-200'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary-600 dark:bg-primary-400" />
                      )}
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 group-hover:text-surface-600 dark:group-hover:text-surface-300'}`} />
                      {!isCollapsed && (
                        <span className="flex-1 flex items-center justify-between">
                          <span>{item.label}</span>
                          <span className={`w-2 h-2 rounded-full ${item.dot} opacity-75 group-hover:opacity-100`} />
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Collapse Toggle for Collapsed View */}
      {isCollapsed && (
        <div className="p-2 border-t border-surface-200/60 dark:border-surface-800 flex justify-center shrink-0">
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn-ghost btn-icon p-2 text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom User Profile Section */}
      <div className="border-t border-surface-200/70 p-3 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-900/60 shrink-0">
        <NavLink
          to="/settings"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors mb-1 ${
              isActive
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400'
                : 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Settings</span>}
        </NavLink>

        <div className={`flex items-center gap-2.5 rounded-xl p-2 ${isCollapsed ? 'justify-center' : 'bg-white dark:bg-surface-800/80 border border-surface-200/60 dark:border-surface-700/60 shadow-2xs'}`}>
          <div className="relative">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white text-xs font-bold shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-surface-900" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-surface-400 truncate">{user?.email}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-surface-400 hover:text-danger hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

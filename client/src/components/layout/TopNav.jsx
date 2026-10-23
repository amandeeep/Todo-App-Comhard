import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, User, LogOut, Menu, Plus, X, Sparkles, Check } from 'lucide-react';
import { useTheme, useClickOutside } from '../../hooks';
import { setFilters } from '../../features/tasks/tasksSlice';
import { logout } from '../../features/auth/authSlice';

export default function TopNav({ onMobileMenuToggle }) {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { filters } = useSelector((state) => state.tasks);
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  const searchInputRef = useRef(null);

  useClickOutside(userMenuRef, () => setShowUserMenu(false));
  useClickOutside(notifRef, () => setShowNotifications(false));

  // Sync internal search input with Redux search filter if cleared outside
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search, Ctrl+N for new task
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        navigate('/tasks?create=true');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      dispatch(setFilters({ search: val }));
    }, 350);
  };

  const clearSearch = () => {
    setSearchValue('');
    dispatch(setFilters({ search: '' }));
    searchInputRef.current?.focus();
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-surface-200/80 bg-white/80 dark:border-surface-800 dark:bg-surface-900/80 backdrop-blur-md px-4 lg:px-6 transition-colors">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onMobileMenuToggle}
          className="btn-ghost btn-icon lg:hidden text-surface-600 dark:text-surface-300"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search with Shortcut Badge */}
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors pointer-events-none z-10" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search tasks, descriptions, tags... (⌘K)"
            className="input !pl-10.5 !pr-16 py-2 text-sm bg-surface-50/70 hover:bg-white focus:bg-white dark:bg-surface-800/60 dark:hover:bg-surface-800 dark:focus:bg-surface-800 transition-all border-surface-200/80 dark:border-surface-700/80"
          />
          {searchValue ? (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex absolute right-3.5 top-1/2 -translate-y-1/2 items-center gap-0.5 rounded border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 text-[10px] font-mono text-surface-400 pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: New Task */}
        <button
          onClick={() => navigate('/tasks?create=true')}
          className="btn-primary btn-sm hidden sm:inline-flex shadow-sm shadow-primary-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-ghost btn-icon relative text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white dark:ring-surface-900" />
          </button>

          {showNotifications && (
            <div className="dropdown-menu right-0 w-80 p-3 shadow-xl border border-surface-200/80 dark:border-surface-700">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">Notifications</span>
                <span className="text-[10px] font-medium text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="space-y-2 py-1">
                <div className="flex items-start gap-2.5 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/60 text-xs">
                  <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 dark:text-surface-200">SLA Engine is active</p>
                    <p className="text-[11px] text-surface-400 mt-0.5">Automated task tracking is running smoothly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800/40 text-xs cursor-pointer transition-colors">
                  <div className="p-1 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-800 dark:text-surface-200">Welcome to TaskFlow 2.0</p>
                    <p className="text-[11px] text-surface-400 mt-0.5">Try the Kanban board & Section views.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn-ghost btn-icon text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 text-surface-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-surface-200 dark:bg-surface-700/80 mx-1" />

        {/* User Profile Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all border border-transparent hover:border-surface-200 dark:hover:border-surface-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white text-xs font-bold shadow-xs">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <span className="block text-xs font-semibold text-surface-800 dark:text-surface-200 leading-tight">
                {user?.name || 'User'}
              </span>
              <span className="block text-[10px] text-surface-400 leading-tight">Workspace</span>
            </div>
          </button>

          {showUserMenu && (
            <div className="dropdown-menu right-0 w-60 p-2 shadow-2xl border border-surface-200/90 dark:border-surface-700">
              <div className="px-3 py-2.5 mb-1.5 rounded-lg bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-700/50">
                <p className="text-xs font-semibold text-surface-900 dark:text-surface-100">{user?.name}</p>
                <p className="text-[11px] text-surface-500 truncate">{user?.email}</p>
                <span className="mt-1.5 inline-block text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                  Active Member
                </span>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowUserMenu(false);
                }}
                className="dropdown-item"
              >
                <User className="w-4 h-4 text-surface-400" /> Account Settings
              </button>
              <div className="my-1 border-t border-surface-100 dark:border-surface-700/60" />
              <button
                onClick={handleLogout}
                className="dropdown-item text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

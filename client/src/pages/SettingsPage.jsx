import { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Palette, Check, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useTheme } from '../hooks';
import { authService } from '../services/endpoints';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-100">
          Account & Preferences
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-surface-500">
          Customize your profile, display preferences, and security settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-surface-100 dark:border-surface-800">
          <User className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
            Profile Information
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white text-3xl font-extrabold shadow-lg shadow-primary-500/25">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-3 ring-white dark:ring-surface-900" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-surface-900 dark:text-surface-100">{user?.name}</p>
              <span className="badge badge-primary text-[10px]">Active</span>
            </div>
            <p className="text-sm text-surface-500">{user?.email}</p>
            <p className="text-xs text-surface-400">
              Workspace member since{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Appearance Theme Selector */}
      <div className="card">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-surface-100 dark:border-surface-800">
          <Palette className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
            Theme & Appearance
          </h3>
        </div>

        <p className="text-xs text-surface-500 mb-4">
          Select your preferred interface theme for optimal focus and comfort.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <div
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`rounded-2xl border p-4 cursor-pointer transition-all ${
              theme !== 'dark'
                ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-50/20 shadow-xs'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5">
                ☀️ Light Mode
              </span>
              {theme !== 'dark' && <Check className="w-4 h-4 text-primary-600" />}
            </div>
            <div className="rounded-xl border border-surface-200 bg-white p-3 space-y-1.5 shadow-2xs">
              <div className="h-2 w-1/3 rounded-full bg-primary-500" />
              <div className="h-2 w-full rounded-full bg-surface-100" />
              <div className="h-2 w-3/4 rounded-full bg-surface-100" />
            </div>
          </div>

          {/* Dark Theme Option */}
          <div
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`rounded-2xl border p-4 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'border-primary-500 ring-2 ring-primary-500/20 bg-primary-950/20 shadow-xs'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-1.5">
                🌙 Dark Mode
              </span>
              {theme === 'dark' && <Check className="w-4 h-4 text-primary-400" />}
            </div>
            <div className="rounded-xl border border-surface-700 bg-surface-900 p-3 space-y-1.5 shadow-2xs">
              <div className="h-2 w-1/3 rounded-full bg-primary-400" />
              <div className="h-2 w-full rounded-full bg-surface-800" />
              <div className="h-2 w-3/4 rounded-full bg-surface-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Security & Password Change */}
      <div className="card">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-surface-100 dark:border-surface-800">
          <KeyRound className="w-5 h-5 text-primary-500" />
          <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
            Security & Password
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="input pr-10 text-sm"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="input pr-10 text-sm"
                placeholder="At least 8 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="input text-sm"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="btn-primary shadow-sm shadow-primary-500/20"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

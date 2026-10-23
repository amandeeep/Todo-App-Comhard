// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
// import { login, register, clearError } from '../features/auth/authSlice';
// import toast from 'react-hot-toast';

// export function LoginPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading, error } = useSelector((state) => state.auth);
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await dispatch(login(form)).unwrap();
//       toast.success('Welcome back!');
//       navigate('/dashboard');
//     } catch (err) {
//       toast.error(err || 'Login failed');
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left Panel */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 items-center justify-center p-12">
//         <div className="max-w-md text-white">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white font-bold text-xl">T</div>
//             <span className="text-2xl font-bold">TaskFlow</span>
//           </div>
//           <h1 className="text-4xl font-bold leading-tight mb-4">Manage your tasks with precision</h1>
//           <p className="text-lg text-primary-200">Track SLAs, organize with Kanban boards, and never miss a deadline again.</p>
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           <div className="lg:hidden flex items-center gap-2 mb-8">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">T</div>
//             <span className="text-xl font-bold text-surface-900 dark:text-surface-100">TaskFlow</span>
//           </div>

//           <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Welcome back</h2>
//           <p className="mt-1 text-surface-500">Sign in to your account to continue</p>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input
//                   type="email"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   placeholder="john@example.com"
//                   className="input pl-10"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   placeholder="••••••••"
//                   className="input pl-10 pr-10"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
//                 <input type="checkbox" className="rounded border-surface-300" />
//                 Remember me
//               </label>
//               <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400">
//                 Forgot password?
//               </Link>
//             </div>

//             <button type="submit" className="btn-primary w-full" disabled={isLoading}>
//               {isLoading ? 'Signing in...' : 'Sign in'}
//               <ArrowRight className="w-4 h-4" />
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-surface-500">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400">
//               Sign up
//             </Link>
//           </p>

//           <div className="mt-6 rounded-lg bg-surface-50 dark:bg-surface-800 p-3 text-xs text-surface-500">
//             <p className="font-medium mb-1">Demo accounts:</p>
//             <p>amandeep@example.com / amandeep123</p>
//             <p>akagra@example.com / akagra123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function RegisterPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isLoading } = useSelector((state) => state.auth);
//   const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const errs = {};
//     if (!form.name.trim()) errs.name = 'Name is required';
//     if (!form.email.trim()) errs.email = 'Email is required';
//     if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
//     if (!/\d/.test(form.password)) errs.password = 'Password must contain a number';
//     if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
//     setErrors(errs);
//     return Object.keys(errs).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     try {
//       await dispatch(register({ name: form.name, email: form.email, password: form.password })).unwrap();
//       toast.success('Account created!');
//       navigate('/dashboard');
//     } catch (err) {
//       toast.error(err || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center p-8 bg-surface-50 dark:bg-surface-950">
//       <div className="w-full max-w-md">
//         <div className="flex items-center gap-2 mb-8 justify-center">
//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white font-bold">T</div>
//           <span className="text-xl font-bold text-surface-900 dark:text-surface-100">TaskFlow</span>
//         </div>

//         <div className="card">
//           <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 text-center">Create an account</h2>
//           <p className="mt-1 text-surface-500 text-center">Get started with TaskFlow today</p>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Full Name</label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   placeholder="John Doe" className={`input pl-10 ${errors.name ? 'input-error' : ''}`} />
//               </div>
//               {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   placeholder="john@example.com" className={`input pl-10 ${errors.email ? 'input-error' : ''}`} />
//               </div>
//               {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input type={showPassword ? 'text' : 'password'} value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   placeholder="••••••••" className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`} />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//               {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Confirm Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
//                 <input type="password" value={form.confirmPassword}
//                   onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
//                   placeholder="••••••••" className={`input pl-10 ${errors.confirmPassword ? 'input-error' : ''}`} />
//               </div>
//               {errors.confirmPassword && <p className="mt-1 text-xs text-danger">{errors.confirmPassword}</p>}
//             </div>

//             <button type="submit" className="btn-primary w-full" disabled={isLoading}>
//               {isLoading ? 'Creating account...' : 'Create account'}
//             </button>
//           </form>

//           <p className="mt-4 text-center text-sm text-surface-500">
//             Already have an account?{' '}
//             <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check, X,
  AlertCircle, Timer, Kanban, BellRing, Sparkles,
} from 'lucide-react';
import { login, register, clearError } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { icon: Timer, title: 'SLA tracking', text: 'Live countdowns and breach alerts on every task.' },
  { icon: Kanban, title: 'Kanban boards', text: 'Drag tasks across stages and see work at a glance.' },
  { icon: BellRing, title: 'Smart reminders', text: 'Get nudged before deadlines, not after.' },
];

function Logo({ inverted = false, size = 'md' }) {
  const box = size === 'lg' ? 'h-11 w-11 text-xl' : 'h-9 w-9 text-base';
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex ${box} items-center justify-center rounded-xl font-bold shadow-sm ${
          inverted ? 'bg-white/15 text-white ring-1 ring-white/25 backdrop-blur' : 'bg-primary-600 text-white'
        }`}
      >
        T
      </div>
      <span className={`text-xl font-bold tracking-tight ${inverted ? 'text-white' : 'text-surface-900 dark:text-surface-100'}`}>
        TaskFlow
      </span>
    </div>
  );
}

function BrandPanel({ heading, subheading }) {
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 lg:flex lg:w-1/2">
      {/* Decorative layers */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div aria-hidden className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />

      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
        <Logo inverted size="lg" />

        <div className="max-w-md">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-primary-100 ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5" /> Built for teams that ship on time
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">{heading}</h1>
          <p className="mt-4 text-lg text-primary-100/90">{subheading}</p>

          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-sm text-primary-100/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-primary-200/70">© {new Date().getFullYear()} TaskFlow</p>
      </div>
    </div>
  );
}

function AuthLayout({ heading, subheading, children }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-surface-950">
      <BrandPanel heading={heading} subheading={subheading} />
      <main className="flex w-full items-center justify-center px-6 py-12 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-sm animate-[fadeIn_0.4s_ease-out]">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

function Field({ id, label, icon: Icon, error, trailing, hint, ...inputProps }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-surface-700 dark:text-surface-300">
          {label}
        </label>
        {hint}
      </div>
      <div className="group relative">
        <Icon
          aria-hidden
          className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors z-10 ${
            error ? 'text-danger' : 'text-surface-400 group-focus-within:text-primary-600'
          }`}
        />
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`input !pl-10.5 ${trailing ? '!pr-11' : ''} ${error ? 'input-error' : ''}`}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1 text-xs text-danger">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function PasswordToggle({ shown, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? 'Hide password' : 'Show password'}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-surface-400 transition hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 cursor-pointer"
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

function SubmitButton({ loading, children, loadingText }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="btn-primary group w-full justify-center py-2.5 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> {loadingText}
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </>
      )}
    </button>
  );
}

function ServerError({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ------------------------------------------------------------------ */
/* Login                                                               */
/* ------------------------------------------------------------------ */

const DEMO_ACCOUNTS = [
  { name: 'Amandeep', email: 'amandeep@example.com', password: 'amandeep123' },
  { name: 'Akagra', email: 'akagra@example.com', password: 'akagra123' },
];

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const update = (key) => (e) => {
    if (error) dispatch(clearError());
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ email: form.email, password: form.password })).unwrap();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  const fillDemo = (acc) => {
    dispatch(clearError());
    setForm((f) => ({ ...f, email: acc.email, password: acc.password }));
  };

  return (
    <AuthLayout
      heading="Manage your tasks with precision"
      subheading="Track SLAs, organize with Kanban boards, and never miss a deadline again."
    >
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Welcome back</h2>
      <p className="mt-1.5 text-sm text-surface-500">Sign in to your account to continue.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <ServerError message={error} />

        <Field
          id="email" label="Email" icon={Mail} type="email" autoComplete="email" autoFocus required
          placeholder="name@company.com" value={form.email} onChange={update('email')}
        />

        <Field
          id="password" label="Password" icon={Lock} required
          type={showPassword ? 'text' : 'password'} autoComplete="current-password"
          placeholder="Enter your password" value={form.password} onChange={update('password')}
          hint={
            <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              Forgot password?
            </Link>
          }
          trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
        />

        <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
          <input
            type="checkbox" checked={form.remember} onChange={update('remember')}
            className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
          />
          Keep me signed in
        </label>

        <SubmitButton loading={isLoading} loadingText="Signing in…">Sign in</SubmitButton>
      </form>

      {/* Demo accounts */}
      <div className="mt-8">
        <div className="relative mb-4 flex items-center">
          <div className="flex-grow border-t border-surface-200 dark:border-surface-800" />
          <span className="mx-3 text-xs font-medium uppercase tracking-wider text-surface-400">Try a demo account</span>
          <div className="flex-grow border-t border-surface-200 dark:border-surface-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.map((acc) => {
            const active = form.email === acc.email;
            return (
              <button
                key={acc.email} type="button" onClick={() => fillDemo(acc)}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition ${
                  active
                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500 dark:bg-primary-950/40'
                    : 'border-surface-200 hover:border-surface-300 hover:bg-surface-50 dark:border-surface-800 dark:hover:bg-surface-900'
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  {acc.name[0]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-surface-800 dark:text-surface-200">{acc.name}</span>
                  <span className="block truncate text-xs text-surface-500">Click to fill</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-surface-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Register                                                            */
/* ------------------------------------------------------------------ */

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Upper & lowercase letters', test: (p) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: 'Contains a symbol', test: (p) => /[^A-Za-z0-9]/.test(p) },
];
const REQUIRED_RULES = 2; // first two rules are mandatory

const STRENGTH = [
  { label: 'Too weak', color: 'bg-danger' },
  { label: 'Weak', color: 'bg-danger' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-emerald-500' },
  { label: 'Strong', color: 'bg-emerald-600' },
];

function PasswordStrength({ password }) {
  const results = PASSWORD_RULES.map((r) => r.test(password));
  const score = results.filter(Boolean).length;
  if (!password) return null;
  const { label, color } = STRENGTH[score];

  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < score ? color : 'bg-surface-200 dark:bg-surface-800'
              }`}
            />
          ))}
        </div>
        <span className="w-14 text-right text-xs font-medium text-surface-500">{label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {PASSWORD_RULES.map((rule, i) => (
          <li
            key={rule.label}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              results[i] ? 'text-emerald-600 dark:text-emerald-400' : 'text-surface-400'
            }`}
          >
            {results[i] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const errors = useMemo(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address';
    const failed = PASSWORD_RULES.slice(0, REQUIRED_RULES).find((r) => !r.test(form.password));
    if (failed) errs.password = `Password needs: ${failed.label.toLowerCase()}`;
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }, [form]);

  // Only show an error once the user has left the field or tried to submit
  const showError = (key) => (submitted || touched[key] ? errors[key] : undefined);

  const update = (key) => (e) => {
    if (error) dispatch(clearError());
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };
  const blur = (key) => () => setTouched((t) => ({ ...t, [key]: true }));

  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length) return;
    try {
      await dispatch(register({ name: form.name.trim(), email: form.email.trim(), password: form.password })).unwrap();
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      heading="Start shipping on time, every time"
      subheading="Create your free workspace in seconds. No credit card required."
    >
      <h2 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">Create your account</h2>
      <p className="mt-1.5 text-sm text-surface-500">Get started with TaskFlow today.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <ServerError message={error} />

        <Field
          id="name" label="Full name" icon={User} type="text" autoComplete="name" autoFocus
          placeholder="e.g. Alex Morgan" value={form.name} onChange={update('name')} onBlur={blur('name')}
          error={showError('name')}
        />

        <Field
          id="email" label="Work email" icon={Mail} type="email" autoComplete="email"
          placeholder="you@company.com" value={form.email} onChange={update('email')} onBlur={blur('email')}
          error={showError('email')}
        />

        <div>
          <Field
            id="password" label="Password" icon={Lock} type={showPassword ? 'text' : 'password'}
            autoComplete="new-password" placeholder="Create a password"
            value={form.password} onChange={update('password')} onBlur={blur('password')}
            error={showError('password')}
            trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
          />
          <PasswordStrength password={form.password} />
        </div>

        <Field
          id="confirmPassword" label="Confirm password" icon={Lock} type={showPassword ? 'text' : 'password'}
          autoComplete="new-password" placeholder="Re-enter your password"
          value={form.confirmPassword} onChange={update('confirmPassword')} onBlur={blur('confirmPassword')}
          error={showError('confirmPassword')}
          trailing={
            passwordsMatch ? (
              <Check aria-label="Passwords match" className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500 pointer-events-none" />
            ) : null
          }
        />

        <div className="pt-2">
          <SubmitButton loading={isLoading} loadingText="Creating account…">Create account</SubmitButton>
        </div>

        <p className="text-center text-xs text-surface-400">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-surface-600">Terms</Link> and{' '}
          <Link to="/privacy" className="underline hover:text-surface-600">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/role-selection');
    } catch (err) {
      setError('Invalid email or password');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 sm:px-8 py-12 sm:py-16 bg-surface">
      {/* Logo */}
      <div className="mb-8 sm:mb-10 animate-fade-in-up">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '30px' }}>health_and_safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface text-center tracking-tight">CareConnect</h1>
        <p className="text-on-surface-variant text-center mt-1.5 sm:mt-2 text-sm sm:text-base">Real-time care coordination</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm sm:max-w-md animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="auth-card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">Welcome back</h2>
          <p className="text-on-surface-variant text-sm sm:text-base mb-6 sm:mb-7">Sign in to continue</p>

          {error && (
            <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl mb-5 sm:mb-6 text-sm sm:text-base font-medium animate-shake">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="auth-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="auth-input pr-12 sm:pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-outline p-1"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs sm:text-sm font-semibold text-primary">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6 sm:my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs sm:text-sm text-outline bg-white">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button className="auth-social-button">
              <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="auth-social-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
              Facebook
            </button>
          </div>
        </div>

        <p className="text-center text-sm sm:text-base text-on-surface-variant mt-6 sm:mt-7">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold">Get started</Link>
        </p>
      </div>
    </div>
  );
}

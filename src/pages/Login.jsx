import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 auth-gradient-bg">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[100px] animate-float-slow-reverse"></div>
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-on-tertiary-container/10 blur-[80px] animate-pulse-slow"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo Section */}
        <div className="mb-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3.5 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30 animate-logo-pulse">
              <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '34px' }}>health_and_safety</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-on-surface text-center tracking-tight">CareConnect</h1>
          <p className="text-on-surface-variant text-center mt-2 text-[15px]">Real-time care coordination</p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card auth-card p-8 rounded-[32px]">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-[28px] font-bold text-on-surface mb-1.5">Welcome back</h2>
              <p className="text-on-surface-variant text-[15px]">Sign in to continue</p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-error-container/80 text-on-error-container px-4 py-3.5 rounded-2xl mb-6 text-sm font-medium animate-shake">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>error</span>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className={`auth-input-group ${focusedField === 'email' ? 'focused' : ''} ${email ? 'has-value' : ''}`}>
                <label className="auth-label">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    className="auth-input pl-12 pr-5"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`auth-input-group ${focusedField === 'password' ? 'focused' : ''} ${password ? 'has-value' : ''}`}>
                <label className="auth-label">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    className="auth-input pl-12 pr-14"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors p-1"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-primary hover:text-primary-container transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-button w-full group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>arrow_forward</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/40"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-5 py-1 text-xs font-medium text-outline bg-transparent">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="auth-social-button">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                <span>Google</span>
              </button>
              <button className="auth-social-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:text-primary-container transition-colors">
                Get started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

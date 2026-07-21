import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = {
    length: password.length >= 6,
    match: confirmPassword && password === confirmPassword,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/role-selection');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError('Failed to create account');
      }
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
      </div>

      {/* Card */}
      <div className="w-full max-w-sm sm:max-w-md animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="auth-card p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-1">Create Account</h2>
          <p className="text-on-surface-variant text-sm sm:text-base mb-6 sm:mb-7">Join CareConnect today</p>

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
                  placeholder="At least 6 characters"
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
              {password && (
                <div className={`flex items-center gap-1.5 text-xs sm:text-sm mt-1.5 ${passwordChecks.length ? 'text-health' : 'text-outline'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {passwordChecks.length ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  At least 6 characters
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="auth-input"
                required
              />
              {confirmPassword && (
                <div className={`flex items-center gap-1.5 text-xs sm:text-sm mt-1.5 ${passwordChecks.match ? 'text-health' : 'text-error'}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {passwordChecks.match ? 'check_circle' : 'cancel'}
                  </span>
                  {passwordChecks.match ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="auth-button mt-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm sm:text-base text-on-surface-variant mt-6 sm:mt-7">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

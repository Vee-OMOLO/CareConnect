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
  const [focusedField, setFocusedField] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = {
    length: password.length >= 6,
    match: confirmPassword && password === confirmPassword,
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
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
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3.5 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30 animate-logo-pulse">
              <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '34px' }}>health_and_safety</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-on-surface text-center tracking-tight">CareConnect</h1>
          <p className="text-on-surface-variant text-center mt-2 text-[15px]">Real-time care coordination</p>
        </div>

        {/* Register Card */}
        <div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card auth-card p-8 rounded-[32px]">
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-[28px] font-bold text-on-surface mb-1.5">Create Account</h2>
              <p className="text-on-surface-variant text-[15px]">Join CareConnect today</p>
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
                {/* Password Strength */}
                {password && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className={`flex items-center gap-2 text-xs transition-colors ${passwordChecks.length ? 'text-on-tertiary-container' : 'text-outline'}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{passwordChecks.length ? 'check_circle' : 'radio_button_unchecked'}</span>
                      At least 6 characters
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`auth-input-group ${focusedField === 'confirm' ? 'focused' : ''} ${confirmPassword ? 'has-value' : ''}`}>
                <label className="auth-label">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>lock_reset</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField('confirm')}
                    onBlur={() => setFocusedField(null)}
                    placeholder=" "
                    className="auth-input pl-12 pr-5"
                    required
                  />
                </div>
                {confirmPassword && (
                  <div className={`flex items-center gap-2 text-xs mt-2 transition-colors ${passwordChecks.match ? 'text-on-tertiary-container' : 'text-error'}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{passwordChecks.match ? 'check_circle' : 'cancel'}</span>
                    {passwordChecks.match ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="auth-button w-full group mt-2"
              >
                <span className="relative z-10 flex items-center justify-center gap-2.5">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>arrow_forward</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-container transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

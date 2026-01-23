import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services';
import { Mail, Clock } from 'lucide-react';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.data.success === true) {
        setMessage(t('auth.messages.resetLinkSent'));
        setCooldown(120);
      } else {
        setError(response.data.message || t('auth.messages.resetLinkError'));
      }
      
    } catch (err) {
      if (err.response?.status === 429) {
        const retryAfter = err.response.data.retry_after || 60;
        setCooldown(retryAfter);
        setError(t('serverErrors.passwords.throttled'));
      } 
      else if (err.response?.status === 422) {
        const validationErrors = err.response.data.errors;
        if (validationErrors?.email) {
          setError(validationErrors.email[0]);
        } else {
          setError(t('auth.errors.emailInvalid'));
        }
      } 
      else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } 
      else {
        setError(t('auth.messages.resetLinkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('auth.forgotPasswordSubtitle')}
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          {cooldown > 0 && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-amber-300 text-sm font-medium">
                  {t('common.waitBeforeRetry')}: {formatTime(cooldown)}
                </span>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                {t('auth.email')} *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    error ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                  disabled={loading || cooldown > 0}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-rose-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L6.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-rose-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}
            
            {message && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">
                      {message}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t('auth.messages.checkEmailInstructions')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-4 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('common.processing')}
                </div>
              ) : cooldown > 0 ? (
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-5 h-5 text-white" />
                  {formatTime(cooldown)}
                </div>
              ) : (
                t('auth.sendResetLink')
              )}
            </button>
            
            <div className="text-center space-y-4">
              <div>
                <Link
                  to="/login"
                  className="font-medium text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {t('auth.backToLogin')}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-400">
                  {t('auth.noAccount')}{' '}
                  <Link
                    to="/register"
                    className="font-medium text-primary-400 hover:text-primary-300"
                  >
                    {t('auth.registerHere')}
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
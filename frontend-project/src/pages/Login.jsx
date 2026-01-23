import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { authService } from '../api/services';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, addNotification, toggleTheme, theme } = useContext(AppContext);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [needsVerification, setNeedsVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  useEffect(() => {
    if (location.state?.message === 'checkEmail') {
      addNotification(
        t('auth.messages.checkEmailLogin', 'Revisa tu correo para verificar tu cuenta'),
        'info'
      );
      if (location.state.email) {
        setPendingEmail(location.state.email);
        setFormData(prev => ({ ...prev, login: location.state.email }));
      }
    }
  }, [location.state, addNotification, t]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login.trim()) {
      newErrors.login = t('auth.errors.loginRequired');
    }
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired');
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (needsVerification) {
      setNeedsVerification(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addNotification(t('auth.messages.completeForm'), 'error');
      return;
    }

    setIsLoading(true);
    setNeedsVerification(false);
    
    try {
      const response = await authService.login(formData.login, formData.password);
      const { user, token } = response.data;
      
      login(user, token);
      addNotification(t('auth.messages.welcome'), 'success');
      navigate('/categories');
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('auth.messages.loginError');
      
      if (error.response?.status === 403 && 
          error.response?.data?.message?.includes('not verified')) {
        setNeedsVerification(true);
        setPendingEmail(formData.login.includes('@') ? formData.login : '');
      }
      
      addNotification(errorMessage, 'error');
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!pendingEmail) {
      addNotification(t('auth.messages.emailRequiredForResend', 'Email requerido para reenviar verificación'), 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      addNotification(
        t('auth.messages.registerNewOrContact', 'Regístrate nuevamente o contacta con soporte'),
        'info'
      );
      navigate('/register');
    } catch (error) {
      addNotification(t('auth.messages.resendError', 'Error al reenviar verificación'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{t('app.title')}</h1>
          <p className="text-gray-400 text-lg">{t('auth.subtitle')}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('nav.emailUser')}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.login
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.emailPlaceholder')}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {errors.login && (
                <p className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.login}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  {t('auth.password')}
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {needsVerification && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <p className="text-amber-400 text-sm mb-2 font-medium">
                  {t('auth.messages.emailNotVerified', 'Tu email no está verificado')}
                </p>
                <p className="text-gray-300 text-xs mb-3">
                  {t('auth.messages.checkEmailSpam', 'Revisa tu correo y carpeta de spam.')}
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="text-amber-300 hover:text-amber-200 text-sm font-medium"
                  disabled={isLoading}
                >
                  {t('auth.resendVerification', 'Reenviar email de verificación')}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('auth.loggingIn')}
                </div>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              {t('auth.registerHere')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
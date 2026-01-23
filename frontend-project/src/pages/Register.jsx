import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { authService } from '../api/services';
import { Eye, EyeOff, User, Mail, Lock, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    language: 'ca',
    acceptTerms: false,
  });

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (!password) return 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('auth.errors.nameRequired', 'Nombre es requerido');
    } else if (formData.name.length < 3) {
      newErrors.name = t('auth.errors.nameMinLength', 'Nombre debe tener al menos 3 caracteres');
    } else if (formData.name.length > 50) {
      newErrors.name = t('auth.errors.nameMaxLength', 'Nombre no puede exceder 50 caracteres');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired', 'Email es requerido');
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = t('auth.errors.emailInvalid', 'Email no válido');
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired', 'Contraseña es requerida');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordMinLength', 'Contraseña debe tener al menos 6 caracteres');
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = t('auth.errors.confirmPasswordRequired', 'Confirma la contraseña');
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = t('auth.errors.passwordsDontMatch', 'Las contraseñas no coinciden');
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = t('auth.errors.acceptTerms', 'Debes aceptar los términos de servicio');
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addNotification(t('auth.messages.completeForm', 'Por favor, completa el formulario correctamente'), 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        language: formData.language,
      });

      addNotification(
        t('auth.messages.registerSuccessVerify', '¡Cuenta creada! Revisa tu correo para verificarla.'), 
        'success'
      );
      
      navigate('/login', { 
        state: { 
          message: 'checkEmail',
          email: formData.email 
        } 
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || t('auth.messages.registerError', 'Error en el registro');
      addNotification(errorMessage, 'error');

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    const texts = [
      t('auth.passwordStrength.veryWeak', 'Muy débil'),
      t('auth.passwordStrength.weak', 'Débil'),
      t('auth.passwordStrength.normal', 'Normal'),
      t('auth.passwordStrength.strong', 'Fuerte'),
      t('auth.passwordStrength.veryStrong', 'Muy fuerte')
    ];
    const colors = ['text-rose-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-emerald-400'];
    return { text: texts[passwordStrength - 1] || '', color: colors[passwordStrength - 1] || '' };
  };

  const strengthColors = ['bg-rose-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t('auth.register', 'Crear Cuenta')}
          </h1>
          <p className="text-gray-400 text-lg">
            {t('auth.registerSubtitle', 'Únete a la comunidad')}
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('auth.fullName', 'Nombre Completo')} *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.name
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.namePlaceholder', 'Tu nombre')}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <span className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.name}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('auth.email', 'Email')} *
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.emailPlaceholder', 'tu@email.com')}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.email}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  {t('auth.password', 'Contraseña')} *
                </label>
                {formData.password && (
                  <span className={`text-sm font-medium ${getPasswordStrengthText().color}`}>
                    {getPasswordStrengthText().text}
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.passwordPlaceholder', '••••••')}
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
              
              {formData.password && (
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColors[passwordStrength - 1] || 'bg-gray-400'}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              )}
              
              {errors.password && (
                <span className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.password}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  {t('auth.confirmPassword', 'Confirmar Contraseña')} *
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="passwordConfirm"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white/5 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.passwordConfirm
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-white/10 focus:border-primary-500'
                  }`}
                  placeholder={t('auth.passwordPlaceholder', '••••••')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.passwordConfirm && (
                <span className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.passwordConfirm}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                    formData.acceptTerms
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white/5 border-white/10 group-hover:border-white/20'
                  }`}>
                    {formData.acceptTerms && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-300">
                  {t('auth.acceptTerms', 'Acepto los términos de servicio')} *
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <span>⚠</span> {errors.acceptTerms}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('auth.registeringProgress', 'Creando cuenta...')}
                </div>
              ) : (
                t('auth.register', 'Registrarse')
              )}
            </button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            {t('auth.haveAccount', '¿Ya tienes cuenta?')}{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              {t('auth.loginHere', 'Inicia sesión')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
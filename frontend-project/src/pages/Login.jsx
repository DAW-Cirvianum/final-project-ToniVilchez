import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { authService } from '../api/services';
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, addNotification, toggleTheme, theme } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login.trim()) {
      newErrors.login = 'Email o usuario es requerido';
    }
    if (!formData.password) {
      newErrors.password = 'Contraseña es requerida';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addNotification('Por favor completa el formulario', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.login(formData.login, formData.password);
      const { user, token } = response.data;
      
      login(user, token);
      addNotification('¡Bienvenido!', 'success');
      navigate('/categories');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error en el inicio de sesión';
      addNotification(errorMessage, 'error');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Impostor Game</h1>
          <p className="text-gray-400 text-lg">Aprende palabras jugando</p>
        </div>
        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Usuario */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Email o Usuario
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
                  placeholder="admin@admin.com"
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

            {/* Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  Contraseña
                </label>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
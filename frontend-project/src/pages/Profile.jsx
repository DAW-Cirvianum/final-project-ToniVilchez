import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { userService } from '../api/services';
import { 
  User, Mail, Globe, Camera, Save, X, Upload, 
  Shield, Calendar, CheckCircle, AlertCircle,
  Loader2
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user, addNotification, updateUser } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: 'ca',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        language: user.language || 'ca',
      });
      setLoading(false);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email no válido';
    }
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addNotification('Por favor selecciona una imagen válida', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addNotification('La imagen no puede superar los 5MB', 'error');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = async () => {
    if (!selectedImage) {
      addNotification('Por favor selecciona una imagen primero', 'error');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      
      const response = await userService.uploadAvatar(formData);
      
      addNotification('Imagen de perfil actualizada correctamente', 'success');
      setImagePreview(null);
      setSelectedImage(null);
      
      // Actualizar usuario en contexto
      if (response.data.user) {
        updateUser(response.data.user);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      addNotification(error.response?.data?.message || 'Error al subir la imagen', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addNotification('Por favor corrige los errores', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await userService.updateProfile(formData);
      
      addNotification('Perfil actualizado correctamente', 'success');
      updateUser({ ...user, ...formData });
      setErrors({});
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMsg = error.response?.data?.message || 'Error al actualizar el perfil';
      addNotification(errorMsg, 'error');
      
      // Mostrar errores del servidor
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">
            Gestiona tu información personal y preferencias
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-800">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">
                          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Botón para subir imagen */}
                  <label className="absolute bottom-2 right-2 cursor-pointer">
                    <div className="p-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg transition-all">
                      <Camera className="w-5 h-5" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Info básica */}
                <h2 className="text-xl font-bold text-white mb-2">
                  {user?.name || 'Usuario'}
                </h2>
                <p className="text-gray-400 mb-4">{user?.email}</p>
                
                {/* Rol */}
                <div className={`px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                  user?.role === 'admin' 
                    ? 'bg-yellow-500/20 text-yellow-500' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </div>

                {/* Botón upload si hay imagen seleccionada */}
                {selectedImage && !uploading && (
                  <button
                    onClick={handleUploadImage}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Guardar imagen
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Juegos jugados</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Categorías creadas</span>
                  <span className="text-white font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Miembro desde</span>
                  <span className="text-white font-medium">
                    {new Date(user?.created_at || Date.now()).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Información personal</h2>
              
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Nombre completo
                      </div>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="Tu nombre"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Correo electrónico
                      </div>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                      placeholder="tu@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Idioma */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Idioma preferido
                      </div>
                    </label>
                    <div className="relative group">
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="appearance-none w-full pl-4 pr-10 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                      >
                        <option value="ca">Català</option>
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex gap-3 pt-6 border-t border-gray-800">
                    <button
                      type="button"
                      onClick={() => navigate('/categories')}
                      className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Guardar cambios
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sección de seguridad */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-xl font-bold text-white mb-6">Seguridad</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white mb-1">Cambiar contraseña</h4>
                      <p className="text-sm text-gray-400">
                        Actualiza tu contraseña regularmente para mantener la seguridad
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all">
                      Cambiar
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white mb-1">Sesiones activas</h4>
                      <p className="text-sm text-gray-400">
                        Gestiona tus sesiones activas en otros dispositivos
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-all">
                      Ver sesiones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

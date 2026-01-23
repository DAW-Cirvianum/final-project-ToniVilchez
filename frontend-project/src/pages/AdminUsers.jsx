import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { adminService } from '../api/services';
import { ArrowLeft, Search, User, Mail, Shield, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminUsers() {
  const { t } = useTranslation();
  const { user, addNotification } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/categories');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers();
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        addNotification(response.data.message || t('adminUsers.errors.loadUsers', 'Error al cargar usuarios'), 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      addNotification(t('adminUsers.errors.serverError', 'Error de conexión con el servidor'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating({ ...updating, [userId]: true });
    try {
      const response = await adminService.updateUserRole(userId, { role: newRole });
      
      if (response.data.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ));
        addNotification(response.data.message || t('adminUsers.roleUpdated', 'Rol actualizado'), 'success');
      } else {
        addNotification(response.data.message || t('adminUsers.errors.updateError', 'Error al actualizar'), 'error');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        addNotification(error.response.data.message, 'error');
      } else {
        addNotification(t('adminUsers.errors.updateRoleError', 'Error al actualizar rol'), 'error');
      }
      fetchUsers();
    } finally {
      setUpdating({ ...updating, [userId]: false });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('adminUsers.confirmDelete', '¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.'))) {
      return;
    }
    
    try {
      const response = await adminService.deleteUser(userId);
      
      if (response.data.success) {
        setUsers(users.filter(u => u.id !== userId));
        addNotification(response.data.message || t('adminUsers.userDeleted', 'Usuario eliminado'), 'success');
      } else {
        addNotification(response.data.message || t('adminUsers.errors.deleteError', 'Error al eliminar'), 'error');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        addNotification(error.response.data.message, 'error');
      } else {
        addNotification(t('adminUsers.errors.deleteUserError', 'Error al eliminar usuario'), 'error');
      }
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/categories')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('adminUsers.title', 'Gestión de Usuarios')}
              </h1>
              <p className="text-gray-400">
                {t('adminUsers.subtitle', 'Panel de administración')}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {t('adminUsers.totalUsers', 'Total')}: <span className="text-white font-bold">{filteredUsers.length}</span> {t('adminUsers.users', 'usuarios')}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder={t('adminUsers.searchPlaceholder', 'Buscar por nombre o email...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
              <p className="text-gray-400">
                {t('adminUsers.loadingUsers', 'Cargando usuarios...')}
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center">
              <User className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">
                {search 
                  ? t('adminUsers.noSearchResults', 'No se encontraron usuarios con esa búsqueda') 
                  : t('adminUsers.noUsers', 'No hay usuarios registrados')}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredUsers.map((userItem) => (
                <div key={userItem.id} className="p-4 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {userItem.name?.charAt(0) || userItem.email?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">
                            {userItem.name || t('adminUsers.noName', 'Sin nombre')}
                          </h3>
                          {userItem.role === 'admin' && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full font-bold">
                              {t('adminUsers.admin', 'ADMIN')}
                            </span>
                          )}
                          {userItem.is_active === false && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full font-bold">
                              {t('adminUsers.inactive', 'INACTIVO')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Mail className="w-3 h-3" />
                          {userItem.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {t('adminUsers.id', 'ID')}: {userItem.id} • {t('adminUsers.registered', 'Registrado')}: {new Date(userItem.created_at).toLocaleDateString('es-ES')}
                          {userItem.language && ` • ${t('adminUsers.language', 'Idioma')}: ${userItem.language.toUpperCase()}`}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={userItem.role}
                          onChange={(e) => handleUpdateRole(userItem.id, e.target.value)}
                          disabled={updating[userItem.id]}
                          className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">{t('adminUsers.userRole', 'Usuario')}</option>
                          <option value="admin">{t('adminUsers.adminRole', 'Administrador')}</option>
                        </select>
                        {updating[userItem.id] && (
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-3 h-3 animate-spin text-primary-500" />
                          </div>
                        )}
                      </div>

                      {userItem.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id)}
                          disabled={updating[userItem.id]}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t('adminUsers.deleteUser', 'Eliminar usuario')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
            <div className="text-gray-400">
              <p className="font-medium text-white mb-1">
                {t('adminUsers.importantInfo', 'Información importante')}:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t('adminUsers.info.adminOnly', 'Solo visible para usuarios con rol de administrador')}</li>
                <li>{t('adminUsers.info.cannotChangeOwnRole', 'No puedes cambiar tu propio rol')}</li>
                <li>{t('adminUsers.info.cannotDeleteSelf', 'No puedes eliminarte a ti mismo')}</li>
                <li>{t('adminUsers.info.immediateChanges', 'Los cambios se aplican inmediatamente')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
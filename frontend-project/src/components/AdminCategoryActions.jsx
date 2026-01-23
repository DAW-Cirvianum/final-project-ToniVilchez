import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { useTranslation } from 'react-i18next';
import { categoryService, adminService } from '../api/services';
import { 
  Edit2, 
  Trash2, 
  Star, 
  StarOff, 
  Plus,
  X,
  Check,
  Loader2 
} from 'lucide-react';

export function AdminCategoryActions({ 
  category, 
  onUpdate, 
  onDelete,
  onToggleDefault,
  onAddWord 
}) {
  const { user, addNotification } = useApp();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [loading, setLoading] = useState({
    edit: false,
    delete: false,
    toggle: false
  });

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) return null;

  const handleEdit = async () => {
    if (!editName.trim() || editName === category.name) {
      setIsEditing(false);
      return;
    }

    setLoading(prev => ({ ...prev, edit: true }));
    try {
      await categoryService.update(category.id, { name: editName });
      addNotification(t('categories.messages.updatedSuccess'), 'success');
      onUpdate?.();
      setIsEditing(false);
    } catch (error) {
      addNotification(t('categories.messages.updatedError'), 'error');
    } finally {
      setLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('categories.deleteModal.message'))) {
      return;
    }

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      await categoryService.delete(category.id);
      addNotification(t('categories.messages.deletedSuccess'), 'success');
      onDelete?.();
    } catch (error) {
      addNotification(t('categories.messages.updatedError'), 'error');
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  const handleToggleDefault = async () => {
    setLoading(prev => ({ ...prev, toggle: true }));
    try {
      const response = await adminService.toggleDefaultCategory(category.id);
      addNotification(response.data.message, 'success');
      onToggleDefault?.();
    } catch (error) {
      addNotification(t('categories.messages.setDefaultError'), 'error');
    } finally {
      setLoading(prev => ({ ...prev, toggle: false }));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleDefault}
        disabled={loading.toggle}
        className={`p-2 rounded-lg transition-all ${
          category.is_default 
            ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
            : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
        }`}
        title={category.is_default 
          ? t('categories.setDefaultTitle') 
          : t('categories.setDefaultTitle')
        }
      >
        {loading.toggle ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : category.is_default ? (
          <Star className="w-4 h-4 fill-current" />
        ) : (
          <StarOff className="w-4 h-4" />
        )}
      </button>

      <button
        onClick={() => onAddWord?.(category)}
        className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 hover:text-primary-300 transition-all"
        title={t('categories.addWordTitle')}
      >
        <Plus className="w-4 h-4" />
      </button>

      {isEditing ? (
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg px-2">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-sm text-white px-1 py-1"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEdit();
              if (e.key === 'Escape') setIsEditing(false);
            }}
          />
          <button
            onClick={handleEdit}
            disabled={loading.edit}
            className="p-1 text-green-500 hover:text-green-400"
          >
            {loading.edit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 text-red-500 hover:text-red-400"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all"
          title={t('common.edit')}
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={loading.delete}
        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all disabled:opacity-50"
        title={t('categories.deleteTitle')}
      >
        {loading.delete ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Trash2 className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
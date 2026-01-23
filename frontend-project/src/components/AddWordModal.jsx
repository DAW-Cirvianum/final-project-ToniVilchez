import { useState } from 'react';
import { useApp } from '../hooks/useApp';
import { wordService } from '../api/services';
import { X, Plus, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AddWordModal({ isOpen, onClose, categoryId, onWordAdded }) {
  const { t } = useTranslation();
  const { addNotification } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ text: '' });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.text.trim()) {
      newErrors.text = t('addWordModal.errors.textRequired', 'La palabra es requerida');
    } else if (formData.text.length < 2) {
      newErrors.text = t('addWordModal.errors.textMinLength', 'La palabra debe tener al menos 2 caracteres');
    } else if (formData.text.length > 50) {
      newErrors.text = t('addWordModal.errors.textMaxLength', 'La palabra no puede exceder 50 caracteres');
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await wordService.create(categoryId, { text: formData.text });
      addNotification(t('addWordModal.wordAddedSuccess', 'Palabra agregada correctamente'), 'success');
      setFormData({ text: '' });
      setErrors({});
      onWordAdded?.();
    } catch (error) {
      const errorMessage = error.response?.data?.message || t('addWordModal.errors.addError', 'Error al agregar palabra');
      addNotification(errorMessage, 'error');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ text: '' });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">
              {t('addWordModal.title', 'Agregar Palabra')}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('addWordModal.subtitle', 'Añade una nueva palabra a esta categoría')}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {t('common.word', 'Palabra')} *
              </label>
              <input
                type="text"
                value={formData.text}
                onChange={(e) => {
                  setFormData({ text: e.target.value });
                  if (errors.text) setErrors({ ...errors, text: '' });
                }}
                className={`w-full px-4 py-3 bg-slate-800/50 border-2 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  errors.text
                    ? 'border-rose-500 focus:border-rose-400'
                    : 'border-slate-700 focus:border-primary-500'
                }`}
                placeholder={t('addWordModal.placeholders.wordExample', 'Ej: Computadora, Sol, Montaña...')}
                disabled={isLoading}
                autoFocus
              />
              {errors.text && (
                <p className="text-rose-400 text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.text}
                </p>
              )}
              <p className="text-gray-400 text-xs">
                {t('addWordModal.hint', 'La palabra debe ser única dentro de esta categoría.')}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              {t('common.cancel', 'Cancelar')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('addWordModal.adding', 'Agregando...')}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t('addWordModal.addButton', 'Agregar Palabra')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
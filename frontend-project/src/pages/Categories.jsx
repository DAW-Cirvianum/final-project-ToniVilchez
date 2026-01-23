import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { categoryService } from '../api/services';
import { Modal } from '../components/Modal';
import { Loading } from '../components/Loading';
import AddWordModal from '../components/AddWordModal';
import { ConfirmModal } from "../components/ConfirmModal";
import { Search, Filter, Plus, Play, Trash2, BookOpen, Edit2, List, X, Star, Crown, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Categories() {
  const navigate = useNavigate();
  const { addNotification, user } = useApp();
  const { t } = useTranslation();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [categoryWords, setCategoryWords] = useState([]);
  const [showWordsModal, setShowWordsModal] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      addNotification(t('messages.errorLoadingCategories'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryWords = async (categoryId) => {
    try {
      const response = await categoryService.getById(categoryId);
      setCategoryWords(response.data.data.words || []);
      setSelectedCategory(response.data.data);
      setShowWordsModal(true);
    } catch (error) {
      addNotification(t('messages.errorLoadingWords'), 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('categories.errors.nameRequired');
    } else if (formData.name.length < 3) {
      newErrors.name = t('categories.errors.nameMinLength');
    }
    return newErrors;
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await categoryService.create({
        name: formData.name,
        description: formData.description || null,
      });
      
      addNotification(t('categories.messages.createdSuccess'), 'success');
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setErrors({});
      await loadCategories();
    } catch (error) {
      addNotification(t('categories.messages.createdError'), 'error');
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    const newErrors = {};
    if (!editFormData.name.trim()) {
      newErrors.name = t('categories.errors.nameRequired');
    } else if (editFormData.name.length < 3) {
      newErrors.name = t('categories.errors.nameMinLength');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await categoryService.update(selectedCategory.id, {
        name: editFormData.name,
        description: editFormData.description || null,
      });
      
      addNotification(t('categories.messages.updatedSuccess'), 'success');
      setIsEditModalOpen(false);
      setEditFormData({ name: '', description: '' });
      setErrors({});
      await loadCategories();
    } catch (error) {
      addNotification(t('categories.messages.updatedError'), 'error');
    }
  };

  const setAsDefault = async (categoryId) => {
    if (!isAdmin) return;
    
    setSettingDefault(true);
    try {
      await categoryService.setAsDefault(categoryId);
      addNotification(t('categories.messages.setDefaultSuccess'), 'success');
      await loadCategories();
    } catch (error) {
      addNotification(t('categories.messages.setDefaultError'), 'error');
    } finally {
      setSettingDefault(false);
    }
  };

  const openDeleteConfirm = (itemId, type) => {
    setItemToDelete(itemId);
    setDeleteType(type);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete || !deleteType) return;

    setDeleteLoading(true);
    try {
      if (deleteType === 'category') {
        await categoryService.delete(itemToDelete);
        addNotification(t('categories.messages.deletedSuccess'), 'success');
        await loadCategories();
      }
    } catch (error) {
      addNotification(t('messages.error'), 'error');
    } finally {
      setDeleteLoading(false);
      setConfirmModalOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const openEditModal = (category) => {
    if (!isAdmin && category.user_id !== user?.id) return;
    
    setSelectedCategory(category);
    setEditFormData({
      name: category.name,
      description: category.description || ''
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const openWordModal = (category) => {
    setSelectedCategory(category);
    setIsWordModalOpen(true);
  };

  const filteredCategories = categories
    .filter(cat => cat.name.toLowerCase().includes(filterText.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'recent') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'owner') {
        if (a.user_id === user?.id && b.user_id !== user?.id) return -1;
        if (a.user_id !== user?.id && b.user_id === user?.id) return 1;
        return 0;
      }
      return 0;
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('categories.title')}</h1>
            <p className="text-gray-400">{t('categories.subtitle')}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('categories.new')}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder={t('categories.search')}
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-primary-500"
            >
              <option value="name">{t('categories.order')}</option>
              <option value="recent">{t('categories.sort.recent')}</option>
              <option value="owner">{t('categories.sort.owner')}</option>
            </select>
          </div>
        </div>

        {isAdmin && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-blue-300">
                <strong>{t('categories.adminMode')}:</strong> {t('categories.adminPermissions')}
              </span>
            </div>
          </div>
        )}

        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
            <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">{t('categories.notFound')}</h3>
            <p className="text-gray-500 mb-6">
              {filterText ? t('categories.searchTryDifferent') : t('categories.noCategoriesAvailable')}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('categories.createFirst')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const isOwner = category.user_id === user?.id;
              const canEdit = isAdmin || isOwner;
              const isDefault = category.is_default;

              return (
                <div
                  key={category.id}
                  className="group bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden"
                  style={{
                    borderColor: isDefault 
                      ? 'rgba(234, 179, 8, 0.3)' 
                      : 'rgba(75, 85, 99, 0.5)',
                  }}
                >
                  <div className="p-6">
                    {isDefault && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-yellow-950 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {t('categories.default')}
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            {category.words_count || 0} {t('categories.words')}
                          </span>
                          {category.user && (
                            <span className="text-gray-500">
                              {t('categories.by')} {category.user.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {canEdit && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditModal(category)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            title={t('categories.editTitle')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => openWordModal(category)}
                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title={t('categories.addWordTitle')}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          {isAdmin && !isDefault && (
                            <button
                              onClick={() => setAsDefault(category.id)}
                              disabled={settingDefault}
                              className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title={t('categories.setDefaultTitle')}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          )}
                          
                          {isAdmin && isDefault && (
                            <div className="p-1.5 text-yellow-500 bg-yellow-500/10 rounded-lg" title={t('categories.isDefault')}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                          
                          {!isDefault && (
                            <button
                              onClick={() => openDeleteConfirm(category.id, 'category')}
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title={t('categories.deleteTitle')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => loadCategoryWords(category.id)}
                          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <List className="w-4 h-4" />
                          {t('categories.viewWords')}
                        </button>
                        
                        <button
                          onClick={() => navigate(`/game/setup?category=${category.id}`)}
                          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-primary-500/25"
                        >
                          <Play className="w-4 h-4" />
                          {t('categories.play')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            setErrors({});
          }}
          title={t('categories.modal.createTitle')}
        >
          <form onSubmit={handleCreateCategory}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('categories.modal.nameLabel')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder={t('categories.modal.namePlaceholder')}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('categories.modal.descriptionLabel')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder={t('categories.modal.descriptionPlaceholder')}
                  rows="3"
                />
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={formData.is_default || false}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_default" className="text-sm text-gray-300">
                    {t('categories.modal.setDefault')}
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  {t('categories.modal.createButton')}
                </button>
              </div>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={t('categories.modal.editTitle')}
        >
          <form onSubmit={(e) => { e.preventDefault(); handleEditCategory(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('categories.modal.nameLabel')} *
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('categories.modal.descriptionLabel')}
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  rows="3"
                />
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit_is_default"
                    checked={editFormData.is_default || false}
                    onChange={(e) => setEditFormData({ ...editFormData, is_default: e.target.checked })}
                    className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="edit_is_default" className="text-sm text-gray-300">
                    {t('categories.modal.setDefault')}
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  {t('categories.modal.saveButton')}
                </button>
              </div>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={showWordsModal}
          onClose={() => setShowWordsModal(false)}
          title={`${t('categories.wordsModal.title')} - ${selectedCategory?.name || ''}`}
          size="lg"
        >
          <div className="max-h-96 overflow-y-auto">
            {categoryWords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('categories.wordsModal.noWords')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categoryWords.map((word) => (
                  <div
                    key={word.id}
                    className="p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="text-gray-300">{word.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {t('categories.wordsModal.total')}: {categoryWords.length} {t('categories.words')}
              </span>
              <button
                onClick={() => setShowWordsModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        </Modal>

        {selectedCategory && (
          <AddWordModal
            isOpen={isWordModalOpen}
            onClose={() => {
              setIsWordModalOpen(false);
              setSelectedCategory(null);
            }}
            category={selectedCategory}
            onWordAdded={() => {
              loadCategories();
              if (selectedCategory) {
                loadCategoryWords(selectedCategory.id);
              }
            }}
          />
        )}

        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t('categories.deleteModal.title')}
          message={t('categories.deleteModal.message')}
          confirmText={t('common.delete')}
          cancelText={t('common.cancel')}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}
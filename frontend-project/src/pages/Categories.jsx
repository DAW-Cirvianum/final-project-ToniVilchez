import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { categoryService } from '../api/services';
import { Modal } from '../components/Modal';
import { Loading } from '../components/Loading';
import AddWordModal from '../components/AddWordModal';
import { ConfirmModal } from "../components/ConfirmModal";
import { Search, Filter, Plus, Play, Trash2, BookOpen, Edit2, List, X, Star, Crown } from 'lucide-react';

export default function Categories() {
  const navigate = useNavigate();
  const { addNotification, user } = useApp();
  
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
      addNotification('Error al cargar categorías', 'error');
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
      addNotification('Error al cargar palabras', 'error');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
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
      
      addNotification('Categoría creada exitosamente', 'success');
      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      setErrors({});
      await loadCategories();
    } catch (error) {
      addNotification('Error al crear categoría', 'error');
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;

    const newErrors = {};
    if (!editFormData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (editFormData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
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
      
      addNotification('Categoría actualizada exitosamente', 'success');
      setIsEditModalOpen(false);
      setEditFormData({ name: '', description: '' });
      setErrors({});
      await loadCategories();
    } catch (error) {
      addNotification('Error al actualizar categoría', 'error');
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
        addNotification('Categoría eliminada', 'success');
        await loadCategories();
      }
    } catch (error) {
      addNotification('Error al eliminar', 'error');
    } finally {
      setDeleteLoading(false);
      setConfirmModalOpen(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const openEditModal = (category) => {
    // Solo permitir editar si es admin o es el dueño
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">📚 Categorías</h1>
            <p className="text-gray-400">Gestiona tus categorías de palabras</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nueva Categoría
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar categorías..."
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
              <option value="name">Ordenar por nombre</option>
              <option value="recent">Más recientes</option>
              <option value="owner">Mis categorías primero</option>
            </select>
          </div>
        </div>

        {/* Indicador admin */}
        {isAdmin && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-blue-300">
                <strong>Modo Administrador:</strong> Puedes editar y eliminar todas las categorías.
              </span>
            </div>
          </div>
        )}

        {/* Grid de categorías */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-gray-900/30 rounded-2xl border border-gray-800">
            <BookOpen className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No se encontraron categorías</h3>
            <p className="text-gray-500 mb-6">
              {filterText ? 'Intenta con otro término de búsqueda' : 'No hay categorías disponibles'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear primera categoría
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
                    {/* Badge predeterminada */}
                    {isDefault && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-yellow-950 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Predeterminada
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400">
                            {category.words_count || 0} palabras
                          </span>
                          {category.user && (
                            <span className="text-gray-500">
                              por {category.user.name}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Botones de acción (solo si puede editar) */}
                      {canEdit && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            title="Editar categoría"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isDefault && (
                            <button
                              onClick={() => openDeleteConfirm(category.id, 'category')}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      <button
                        onClick={() => loadCategoryWords(category.id)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <List className="w-4 h-4" />
                        Ver palabras
                      </button>
                      
                      <button
                        onClick={() => navigate(`/game/setup?category=${category.id}`)}
                        className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-primary-500/25"
                      >
                        <Play className="w-4 h-4" />
                        Jugar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal para crear categoría */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setFormData({ name: '', description: '' });
            setErrors({});
          }}
          title="Crear Nueva Categoría"
        >
          <form onSubmit={handleCreateCategory}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Ej: Animales, Películas, Comida..."
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  placeholder="Breve descripción de la categoría..."
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  Crear Categoría
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal para editar categoría */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Editar Categoría"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleEditCategory(); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la categoría *
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
                  Descripción (opcional)
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal para ver palabras */}
        <Modal
          isOpen={showWordsModal}
          onClose={() => setShowWordsModal(false)}
          title={`Palabras - ${selectedCategory?.name || ''}`}
          size="lg"
        >
          <div className="max-h-96 overflow-y-auto">
            {categoryWords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay palabras en esta categoría</p>
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
                Total: {categoryWords.length} palabras
              </span>
              <button
                onClick={() => setShowWordsModal(false)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>

        {/* Modal para añadir palabra */}
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

        {/* Modal de confirmación */}
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que quieres eliminar esta categoría? Se eliminarán todas sus palabras."
          confirmText="Eliminar"
          cancelText="Cancelar"
          loading={deleteLoading}
        />
      </div>
    </div>
  );
}

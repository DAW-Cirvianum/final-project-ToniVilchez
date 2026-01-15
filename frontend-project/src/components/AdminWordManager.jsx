import { useState, useEffect } from 'react';
import { useApp } from '../hooks/useApp';
import { wordService, adminService } from '../api/services';
import { 
  Edit2, 
  Trash2, 
  Plus,
  X,
  Check,
  Loader2,
  Save,
  List 
} from 'lucide-react';

export function AdminWordManager({ category, onClose }) {
  const { addNotification } = useApp();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWord, setEditingWord] = useState(null);
  const [editText, setEditText] = useState('');
  const [newWord, setNewWord] = useState('');
  const [addingWord, setAddingWord] = useState(false);

  useEffect(() => {
    loadWords();
  }, [category.id]);

  const loadWords = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllWordsByCategory(category.id);
      setWords(response.data.data || []);
    } catch (error) {
      addNotification('Error al cargar palabras', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async () => {
    if (!newWord.trim()) return;

    setAddingWord(true);
    try {
      await wordService.create(category.id, { text: newWord });
      addNotification('Palabra añadida correctamente', 'success');
      setNewWord('');
      await loadWords();
    } catch (error) {
      addNotification('Error al añadir palabra', 'error');
    } finally {
      setAddingWord(false);
    }
  };

  const handleUpdateWord = async (word) => {
    if (!editText.trim() || editText === word.text) {
      setEditingWord(null);
      return;
    }

    try {
      await adminService.updateWord(word.id, { text: editText });
      addNotification('Palabra actualizada correctamente', 'success');
      setEditingWord(null);
      await loadWords();
    } catch (error) {
      addNotification('Error al actualizar palabra', 'error');
    }
  };

  const handleDeleteWord = async (wordId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta palabra?')) {
      return;
    }

    try {
      await wordService.delete(wordId);
      addNotification('Palabra eliminada correctamente', 'success');
      await loadWords();
    } catch (error) {
      addNotification('Error al eliminar palabra', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Gestión de Palabras
          </h3>
          <p className="text-sm text-gray-400">
            Categoría: <span className="text-primary-400">{category.name}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Añadir nueva palabra */}
      <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-gray-300">Añadir nueva palabra</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Escribe una nueva palabra..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
          />
          <button
            onClick={handleAddWord}
            disabled={addingWord || !newWord.trim()}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {addingWord ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Añadir
          </button>
        </div>
      </div>

      {/* Lista de palabras */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {words.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay palabras en esta categoría</p>
          </div>
        ) : (
          words.map((word) => (
            <div
              key={word.id}
              className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              {editingWord?.id === word.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-gray-900 border border-primary-500 rounded px-3 py-1 text-white focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateWord(word);
                      if (e.key === 'Escape') setEditingWord(null);
                    }}
                  />
                  <button
                    onClick={() => handleUpdateWord(word)}
                    className="p-1 text-green-500 hover:text-green-400"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingWord(null)}
                    className="p-1 text-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-300">{word.text}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingWord(word);
                        setEditText(word.text);
                      }}
                      className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400 hover:text-blue-300"
                      title="Editar palabra"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWord(word.id)}
                      className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                      title="Eliminar palabra"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contador */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Total: <span className="text-white font-medium">{words.length}</span> palabras
        </p>
      </div>
    </div>
  );
}

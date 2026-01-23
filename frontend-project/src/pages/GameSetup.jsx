import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { gameService, categoryService } from '../api/services';
import { Loading } from '../components/Loading';
import { Users, Settings, Plus, X, GripVertical, ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GameSetup() {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [players, setPlayers] = useState(['', '']);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const categoryId = searchParams.get('category');
    if (categoryId) {
      setSelectedCategory(parseInt(categoryId));
    }
  }, [searchParams]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data.data || []);
    } catch (error) {
      addNotification(t('messages.errorLoadingCategories'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedCategory) {
      newErrors.category = t('gameSetup.errors.categoryRequired');
    }

    const validPlayers = players.filter(p => p.trim());
    if (validPlayers.length < 2) {
      newErrors.players = t('gameSetup.errors.minPlayers');
    }

    const uniquePlayers = new Set(validPlayers.map(p => p.trim().toLowerCase()));
    if (uniquePlayers.size !== validPlayers.length) {
      newErrors.uniquePlayers = t('gameSetup.errors.uniquePlayers');
    }

    players.forEach((player, idx) => {
      if (player.trim() && player.length < 2) {
        newErrors[`player_${idx}`] = t('gameSetup.errors.playerMinLength');
      }
      if (player.length > 30) {
        newErrors[`player_${idx}`] = t('gameSetup.errors.playerMaxLength');
      }
    });

    return newErrors;
  };

  const addPlayer = () => {
    setPlayers([...players, '']);
  };

  const removePlayer = (index) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);

    if (errors[`player_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`player_${index}`];
      setErrors(newErrors);
    }
  };

  const handleDragStart = (index) => {
    setDraggedPlayer(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedPlayer !== null && draggedPlayer !== index) {
      const newPlayers = [...players];
      [newPlayers[draggedPlayer], newPlayers[index]] = [
        newPlayers[index],
        newPlayers[draggedPlayer],
      ];
      setPlayers(newPlayers);
    }
    setDraggedPlayer(null);
  };

  const handleStartGame = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      addNotification(t('gameSetup.messages.completeForm'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const validPlayers = players.filter(p => p.trim());
      const response = await gameService.create({
        category_id: selectedCategory,
        players: validPlayers,
      });

      addNotification(t('gameSetup.messages.gameStarted'), 'success');
      navigate(`/game/${response.data.data.id}`);
    } catch (error) {
      addNotification(t('gameSetup.messages.errorStartingGame'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">
              🎮 {t('gameSetup.title')}
            </h1>
            <p className="text-gray-400">{t('gameSetup.subtitle')}</p>
          </div>

          <form onSubmit={handleStartGame} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                {t('gameSetup.selectCategory')} *
              </label>
              <div className="relative">
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => {
                    setSelectedCategory(parseInt(e.target.value) || null);
                    if (errors.category) {
                      setErrors({ ...errors, category: '' });
                    }
                  }}
                  className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white focus:outline-none transition-colors appearance-none ${
                    errors.category ? 'border-rose-500 focus:border-rose-400' : 'border-white/10 focus:border-primary-500'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">{t('gameSetup.chooseCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.words_count || 0} {t('categories.words')})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
              </div>
              {errors.category && (
                <span className="text-rose-400 text-sm font-medium">{errors.category}</span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-300">
                  {t('game.players')} *
                </label>
                <span className="text-sm text-primary-400 font-medium">
                  {players.filter(p => p.trim()).length} {t('gameSetup.players')}
                </span>
              </div>

              {(errors.players || errors.uniquePlayers) && (
                <span className="text-rose-400 text-sm font-medium">
                  {errors.players || errors.uniquePlayers}
                </span>
              )}

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 bg-white/5 border-2 rounded-xl transition-all ${
                      errors[`player_${index}`]
                        ? 'border-rose-500/50'
                        : 'border-white/10 hover:border-primary-500/30'
                    } ${draggedPlayer === index ? 'opacity-50' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                  >
                    <button
                      type="button"
                      className="text-gray-400 hover:text-white cursor-grab active:cursor-grabbing"
                      title={t('gameSetup.dragToReorder')}
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => updatePlayer(index, e.target.value)}
                        placeholder={t('gameSetup.playerPlaceholder', { number: index + 1 })}
                        className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
                        disabled={isSubmitting}
                      />
                      {errors[`player_${index}`] && (
                        <span className="text-rose-400 text-xs">{errors[`player_${index}`]}</span>
                      )}
                    </div>

                    {players.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePlayer(index)}
                        className="p-1 text-gray-400 hover:text-rose-400 transition-colors"
                        aria-label={t('gameSetup.removePlayer')}
                        disabled={isSubmitting}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addPlayer}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border-2 border-dashed border-white/10 hover:border-primary-500/30 rounded-xl text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <Plus className="w-5 h-5" />
                {t('game.addPlayer')}
              </button>

              <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                <p className="text-sm text-primary-300 text-center">
                  {t('gameSetup.dragInstructions')}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('gameSetup.startingGame')}
                </>
              ) : (
                <>
                  <span>{t('game.start')}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
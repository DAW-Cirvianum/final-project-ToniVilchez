import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { gameService, categoryService } from '../api/services';
import { Loading } from '../components/Loading';
import CreateRoundModal from '../components/CreateRoundModal';
import { Users, Target, ArrowLeft, Plus, Crown, UserCheck, Trophy } from 'lucide-react';

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();

  const [game, setGame] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingRound, setIsCreatingRound] = useState(false);
  const [availableWords, setAvailableWords] = useState([]);
  const [creatingLoading, setCreatingLoading] = useState(false);

  useEffect(() => { loadGame(); }, [id]);

  const loadGame = async () => {
    try {
      const [gameRes, roundsRes] = await Promise.all([
        gameService.getById(id),
        gameService.getRounds(id),
      ]);
      setGame(gameRes.data.data);
      setRounds(roundsRes.data.data || []);
    } catch (error) {
      addNotification('Error al cargar el juego', 'error');
      setTimeout(() => navigate('/categories'), 2000);
    } finally { setLoading(false); }
  };

  const loadAvailableWords = async () => {
    if (!game?.category_id) {
      addNotification('No se puede cargar palabras: categoría no encontrada', 'error');
      return [];
    }
    try {
      const response = await categoryService.getById(game.category_id);
      let words = [];
      if (response.data?.data?.words) words = response.data.data.words;
      else if (response.data?.words) words = response.data.words;
      else if (response.data?.data?.data?.words) words = response.data.data.data.words;
      
      setAvailableWords(words);
      return words;
    } catch (error) {
      addNotification('Error al cargar palabras', 'error');
      return [];
    }
  };

  const handleOpenCreateRound = async () => {
    try {
      setCreatingLoading(true);
      const words = await loadAvailableWords();
      if (words.length === 0) {
        addNotification('Esta categoría no tiene palabras. Añade algunas primero.', 'warning');
        return;
      }
      if (!game.players || game.players.length === 0) {
        addNotification('No hay jugadores en este juego.', 'warning');
        return;
      }
      setIsCreatingRound(true);
    } catch (error) {
      addNotification('Error al preparar la ronda', 'error');
    } finally { setCreatingLoading(false); }
  };

  const handleCreateRound = async (roundData) => {
    setCreatingLoading(true);
    try {
      const selectedWord = availableWords.find(w => w.id === roundData.word_id);
      const selectedImpostor = game.players?.find(p => p.id === roundData.impostor_player_id);
      
      await gameService.createRound(game.id, roundData);
      
      navigate(`/game/${game.id}/play-round`, {
        state: {
          roundData: {
            ...roundData,
            word_text: selectedWord?.text || 'Palabra Aleatoria',
            impostor_name: selectedImpostor?.name || 'Impostor'
          },
          gameId: game.id,
          players: game.players || [],
          categoryName: game.category?.name || 'Categoría',
          game: game,
          startingPlayer: game.players ? game.players[Math.floor(Math.random() * game.players.length)] : null
        }
      });
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error al crear ronda';
      addNotification(`❌ ${errorMsg}`, 'error');
      setIsCreatingRound(false);
    } finally { setCreatingLoading(false); }
  };

  if (loading) return <Loading />;
  if (!game) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 mx-auto bg-white/5 rounded-2xl flex items-center justify-center">
          <Target className="w-12 h-12 text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">Juego no encontrado</h2>
        <button onClick={() => navigate('/categories')} className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all">
          Volver a categorías
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => navigate('/categories')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <h1 className="text-3xl font-bold text-white">{game.category?.name || 'Juego'}</h1>
            </div>
            <p className="text-gray-400 ml-12">Partida #{game.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleOpenCreateRound} disabled={creatingLoading} className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50">
              {creatingLoading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Cargando...</>) : (<><Plus className="w-5 h-5" /> Nueva Ronda</>)}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-500/20 rounded-xl"><Users className="w-6 h-6 text-primary-300" /></div>
              <div><p className="text-gray-400 text-sm">Jugadores</p><p className="text-2xl font-bold text-white">{game.players?.length || 0}</p></div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl"><Target className="w-6 h-6 text-purple-300" /></div>
              <div><p className="text-gray-400 text-sm">Rondas</p><p className="text-2xl font-bold text-white">{rounds.length}</p></div>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Trophy className="w-6 h-6 text-emerald-300" /></div>
              <div><p className="text-gray-400 text-sm">Palabras únicas</p><p className="text-2xl font-bold text-white">{new Set(rounds.map(r => r.word?.text || r.word?.word)).size}</p></div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Players panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl"><Users className="w-6 h-6 text-primary-300" /></div>
              <div><h2 className="text-xl font-bold text-white">Jugadores</h2><p className="text-gray-400 text-sm">{game.players?.length || 0} participantes</p></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {game.players?.map((player, index) => {
                const isImpostor = rounds.some(r => r.impostor_player_id === player.id);
                return (
                  <div key={player.id} className={`relative group p-4 rounded-xl transition-all ${isImpostor ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-white/5 border border-white/10 hover:border-primary-500/30'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg text-white text-sm font-bold">{index + 1}</div>
                      {isImpostor && (<div className="p-1 bg-rose-500/20 rounded"><Crown className="w-4 h-4 text-rose-300" /></div>)}
                    </div>
                    <p className="text-white font-medium truncate">{player.name}</p>
                    {isImpostor && (<p className="text-rose-300 text-xs mt-1">Impostor</p>)}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-primary-600/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rounds panel */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl"><Target className="w-6 h-6 text-purple-300" /></div>
              <div><h2 className="text-xl font-bold text-white">Rondas</h2><p className="text-gray-400 text-sm">{rounds.length} completadas</p></div>
            </div>
            {rounds.length > 0 ? (
              <div className="space-y-4">
                {rounds.map((round, index) => {
                  const impostor = game.players?.find(p => p.id === round.impostor_player_id);
                  return (
                    <div key={round.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-lg"><span className="text-white font-bold">{index + 1}</span></div>
                          <div><h3 className="text-white font-semibold">Ronda {index + 1}</h3><p className="text-gray-400 text-sm">Palabra: {round.word?.text || round.word?.word || 'N/A'}</p></div>
                        </div>
                        {impostor && (<div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 rounded-full"><UserCheck className="w-4 h-4 text-rose-300" /><span className="text-rose-300 text-sm font-medium">{impostor.name}</span></div>)}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-white/5 rounded-lg"><p className="text-gray-400 text-xs mb-1">Palabra</p><p className="text-white font-medium">{round.word?.text || round.word?.word || 'N/A'}</p></div>
                        <div className="p-3 bg-white/5 rounded-lg"><p className="text-gray-400 text-xs mb-1">Impostor</p><p className="text-white font-medium">{impostor?.name || 'N/A'}</p></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center"><Target className="w-10 h-10 text-gray-400" /></div>
                <h3 className="text-lg font-semibold text-white mb-2">No hay rondas aún</h3>
                <p className="text-gray-400 mb-6">Comienza la primera ronda para empezar a jugar</p>
                <button onClick={handleOpenCreateRound} disabled={creatingLoading} className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all disabled:opacity-50">
                  {creatingLoading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Cargando...</>) : (<><Plus className="w-5 h-5" /> Crear Primera Ronda</>)}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal para crear ronda */}
        <CreateRoundModal isOpen={isCreatingRound} onClose={() => setIsCreatingRound(false)} onConfirm={handleCreateRound} players={game.players || []} words={availableWords} loading={creatingLoading} />
      </div>
    </div>
  );
}

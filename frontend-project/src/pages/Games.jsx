import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { gameService } from '../api/services';
import { Loading } from '../components/Loading';
import { Calendar, Users, Target, Trophy, Gamepad2, ChevronRight, Filter } from 'lucide-react';

export default function Games() {
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { loadGames(); }, []);

  const loadGames = async () => {
    try {
      const response = await gameService.getAll();
      const gamesData = response.data?.data || response.data || [];
      setGames(Array.isArray(gamesData) ? gamesData : []);
    } catch (error) {
      console.error('Error cargando juegos:', error);
      addNotification('Error al cargar historial de juegos', 'error');
      setGames([]);
    } finally { setLoading(false); }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha desconocida';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return dateString; }
  };

  const getGameStats = (game) => ({
    totalRounds: game.rounds?.length || 0,
    uniqueWords: new Set(game.rounds?.map(r => r.word?.text || r.word?.word || '').filter(Boolean)).size,
  });

  const demoGames = [
    { id: 1, category: { name: 'Películas' }, players: [{ id: 1, name: 'Jugador 1' }, { id: 2, name: 'Jugador 2' }], rounds: [
      { id: 1, word: { text: 'TITANIC' }, impostor_player_id: 1, created_at: new Date().toISOString() },
      { id: 2, word: { text: 'MATRIX' }, impostor_player_id: 2, created_at: new Date().toISOString() }
    ], created_at: new Date().toISOString() },
    { id: 2, category: { name: 'Animales' }, players: [{ id: 1, name: 'Jugador 1' }, { id: 2, name: 'Jugador 2' }, { id: 3, name: 'Jugador 3' }], rounds: [
      { id: 3, word: { text: 'ELEFANTE' }, impostor_player_id: 3, created_at: new Date().toISOString() }
    ], created_at: new Date().toISOString() }
  ];

  const displayGames = games.length > 0 ? games : demoGames;
  const isUsingDemoData = games.length === 0;

  if (loading) return (<div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center"><Loading /></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div><h1 className="text-3xl font-bold text-white mb-2">🎮 Historial de Partidas</h1><p className="text-gray-400">Revisa todas tus partidas y sus rondas</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/game/setup')} className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-primary-500/25"><Gamepad2 className="w-5 h-5" /> Nueva Partida</button>
          </div>
        </div>

        {isUsingDemoData && (<div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3"><Gamepad2 className="w-5 h-5 text-yellow-300" /><p className="text-yellow-300 text-sm"><span className="font-bold">Mostrando datos de demostración.</span> Crea una partida real para ver tu historial.</p></div>
        </div>)}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-primary-500/20 rounded-xl"><Gamepad2 className="w-6 h-6 text-primary-300" /></div><div><p className="text-gray-400 text-sm">Partidas</p><p className="text-2xl font-bold text-white">{displayGames.length}</p></div></div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-purple-500/20 rounded-xl"><Target className="w-6 h-6 text-purple-300" /></div><div><p className="text-gray-400 text-sm">Rondas totales</p><p className="text-2xl font-bold text-white">{displayGames.reduce((total, game) => total + (game.rounds?.length || 0), 0)}</p></div></div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-emerald-500/20 rounded-xl"><Trophy className="w-6 h-6 text-emerald-300" /></div><div><p className="text-gray-400 text-sm">Palabras únicas</p><p className="text-2xl font-bold text-white">{new Set(displayGames.flatMap(g => g.rounds?.map(r => r.word?.text || r.word?.word || '').filter(Boolean))).size}</p></div></div>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3"><div className="p-3 bg-rose-500/20 rounded-xl"><Users className="w-6 h-6 text-rose-300" /></div><div><p className="text-gray-400 text-sm">Jugadores totales</p><p className="text-2xl font-bold text-white">{new Set(displayGames.flatMap(g => g.players?.map(p => p.name).filter(Boolean))).size}</p></div></div>
          </div>
        </div>

        <div className="space-y-4">
          {displayGames.map((game) => {
            const stats = getGameStats(game);
            return (
              <div key={game.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-primary-500/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary-500/20 rounded-lg"><Gamepad2 className="w-5 h-5 text-primary-300" /></div>
                      <h3 className="text-xl font-bold text-white">{game.category?.name || 'Juego sin categoría'}</h3>
                      <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">ID: {game.id}</span>
                    </div>
                    <div className="flex items-center gap-4 ml-10">
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-400 text-sm">{formatDate(game.created_at)}</span></div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><span className="text-gray-400 text-sm">{game.players?.length || 0} jugadores</span></div>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/game/${game.id}`)} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">Ver partida<ChevronRight className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-gray-400 text-sm mb-1">Rondas</p><p className="text-2xl font-bold text-white">{stats.totalRounds}</p></div>
                  <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-gray-400 text-sm mb-1">Palabras</p><p className="text-2xl font-bold text-white">{stats.uniqueWords}</p></div>
                  <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-gray-400 text-sm mb-1">Jugadores</p><p className="text-2xl font-bold text-white">{game.players?.length || 0}</p></div>
                  <div className="bg-white/5 rounded-xl p-4 text-center"><p className="text-gray-400 text-sm mb-1">Estado</p><p className="text-2xl font-bold text-white">{stats.totalRounds > 0 ? 'Completada' : 'En curso'}</p></div>
                </div>
                {game.rounds && game.rounds.length > 0 ? (<div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Target className="w-5 h-5" />Rondas jugadas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {game.rounds.map((round, index) => {
                      const impostor = game.players?.find(p => p.id === round.impostor_player_id);
                      return (<div key={round.id || index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-400">Ronda {index + 1}</span></div>
                        <div className="space-y-2">
                          <div><p className="text-xs text-gray-400">Palabra</p><p className="text-white font-medium">{round.word?.text || round.word?.word || 'Palabra secreta'}</p></div>
                          <div><p className="text-xs text-gray-400">Impostor</p><div className="flex items-center gap-2">
                            <div className="w-6 h-6 flex items-center justify-center bg-rose-500/20 rounded-full text-rose-300 text-xs">{impostor?.name?.charAt(0) || '?'}</div>
                            <p className="text-white font-medium">{impostor?.name || 'Impostor secreto'}</p>
                          </div></div>
                        </div>
                      </div>);
                    })}
                  </div>
                </div>) : (<div className="text-center py-4">
                  <p className="text-gray-400">No hay rondas en esta partida aún</p>
                  <button onClick={() => navigate(`/game/${game.id}`)} className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 rounded-xl font-medium transition-colors">Jugar primera ronda</button>
                </div>)}
              </div>
            );
          })}
        </div>

        {displayGames.length === 0 && !isUsingDemoData && (<div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center"><Gamepad2 className="w-10 h-10 text-gray-400" /></div>
          <h3 className="text-xl font-semibold text-white mb-2">No hay partidas en tu historial</h3>
          <p className="text-gray-400 mb-6">Comienza creando tu primera partida</p>
          <button onClick={() => navigate('/game/setup')} className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all"><Gamepad2 className="w-5 h-5" /> Crear Primera Partida</button>
        </div>)}
      </div>
    </div>
  );
}

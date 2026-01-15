import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { gameService } from '../api/services';
import { Loading } from '../components/Loading';
import { ArrowLeft, Eye, EyeOff, Play, CheckCircle, User, Crown, Shield, Check } from 'lucide-react';

export default function PlayRound() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useApp();
  const { roundData, players, categoryName, playerRevealed, game, startingPlayer: initialStartingPlayer } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState(players || []);
  const [revealedPlayers, setRevealedPlayers] = useState(playerRevealed ? [playerRevealed] : []);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showImpostor, setShowImpostor] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState(initialStartingPlayer || null);

  useEffect(() => {
    if (!roundData || !players || players.length === 0) {
      addNotification('Datos incompletos de la ronda', 'error');
      setTimeout(() => navigate(`/game/${gameId}`), 2000);
      return;
    }

    setSelectedPlayers(players);
    
    if (!startingPlayer && players.length > 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      setStartingPlayer(players[randomIndex]);
    }
    
    if (playerRevealed && !revealedPlayers.includes(playerRevealed)) {
      setRevealedPlayers([...revealedPlayers, playerRevealed]);
    }
    
    setLoading(false);
  }, [playerRevealed]);

  useEffect(() => {
    if (revealedPlayers.length >= selectedPlayers.length && selectedPlayers.length > 0) {
      setAllRevealed(true);
    }
  }, [revealedPlayers, selectedPlayers]);

  const handlePlayerClick = (playerId) => {
    navigate(`/game/${gameId}/player/${playerId}/reveal`, {
      state: {
        roundData,
        players: selectedPlayers,
        playerId,
        gameId,
        categoryName,
        game
      }
    });
  };

  const handleStartGame = () => {
    addNotification(`¡Que comience el juego! ${startingPlayer?.name} empieza.`, 'success');
  };

  const handleRevealImpostor = () => {
    setShowImpostor(true);
    addNotification('¡Impostor revelado!', 'info');
  };

  const handleFinishRound = async () => {
    try {
      await gameService.createRound(gameId, {
        word_id: roundData.word_id,
        impostor_player_id: roundData.impostor_player_id
      });
      
      addNotification('Ronda guardada en el historial', 'success');
      navigate(`/game/${gameId}`);
    } catch (error) {
      addNotification('Ronda completada', 'info');
      navigate(`/game/${gameId}`);
    }
  };

  if (loading) return <Loading />;

  const impostor = selectedPlayers.find(p => p.id === roundData?.impostor_player_id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/game/${gameId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al juego
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Nueva Ronda</h1>
            <p className="text-gray-400">{categoryName || 'Juego'}</p>
          </div>
          
          <div className="w-24"></div>
        </div>

        {/* Instruccions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Eye className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Instrucciones</h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Cada jugador hace clic en su nombre para ver su rol en privado</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span>El <span className="font-bold text-rose-300">IMPOSTOR</span> verá "IMPOSTOR"</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Los demás verán la palabra a adivinar</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Cuando todos hayan visto, comenzará el juego</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Jugadors */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {selectedPlayers.map((player) => {
            const isImpostor = player.id === roundData?.impostor_player_id;
            const isRevealed = revealedPlayers.includes(player.id);
            const isStarting = startingPlayer?.id === player.id;
            
            return (
              <button
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                disabled={isRevealed}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isRevealed
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/5 border-white/10 hover:border-primary-500/40 hover:bg-white/10'
                } ${isStarting && allRevealed ? 'ring-2 ring-yellow-500' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    isRevealed
                      ? isImpostor
                        ? 'bg-gradient-to-br from-rose-500 to-rose-600'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                      : 'bg-gradient-to-br from-slate-700 to-slate-800'
                  }`}>
                    {isRevealed ? (
                      isImpostor ? (
                        <Shield className="w-8 h-8 text-white" />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )
                    ) : (
                      <EyeOff className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Nom */}
                  <div className="text-center">
                    <p className="text-white font-bold text-lg truncate">{player.name}</p>
                    
                    {isRevealed ? (
                      <div className="mt-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full">
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span className="text-emerald-300 text-sm font-medium">Ya ha visto</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-primary-300 text-sm mt-2">Clic para ver tu rol</p>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-1">
                  {isImpostor && showImpostor && (
                    <span className="px-2 py-1 bg-rose-500/30 text-rose-300 text-xs font-bold rounded-full">
                      IMPOSTOR
                    </span>
                  )}
                  {isStarting && allRevealed && (
                    <span className="px-2 py-1 bg-yellow-500/30 text-yellow-300 text-xs font-bold rounded-full">
                      COMIENZA
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Progrés */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">
              {revealedPlayers.length}/{selectedPlayers.length} jugadores han visto su rol
            </span>
            <span className="text-gray-400 text-sm">
              {allRevealed ? 'Todos listos' : 'Esperando...'}
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(revealedPlayers.length / selectedPlayers.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Fases del joc */}
        <div className="space-y-4">
          {/* Fase 1: Revelando */}
          {!allRevealed && (
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl mb-4">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">
                  Esperando a que todos los jugadores vean su rol
                </span>
              </div>
            </div>
          )}

          {/* Fase 2: Tots han revelat */}
          {allRevealed && !showImpostor && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Play className="w-10 h-10 text-emerald-300" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Todos listos!</h3>
                  <p className="text-gray-300 mb-6">
                    El juego comienza con <span className="font-bold text-yellow-300">{startingPlayer?.name}</span>
                  </p>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleStartGame}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Comenzar Juego
                    </button>
                    
                    <button
                      onClick={handleRevealImpostor}
                      className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-5 h-5" />
                      Revelar Impostor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fase 3: Impostor revelat */}
          {showImpostor && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-rose-500/20 rounded-2xl flex items-center justify-center">
                  <Crown className="w-10 h-10 text-rose-300" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡El impostor era!</h3>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {impostor?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-3xl font-bold text-rose-300">{impostor?.name || 'Desconocido'}</span>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={handleFinishRound}
                      className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Finalizar Ronda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

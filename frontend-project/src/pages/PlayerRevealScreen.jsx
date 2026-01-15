import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { Check, Eye, Shield, User, Lock, ArrowLeft } from 'lucide-react';

export default function PlayerRevealScreen() {
  const { gameId, playerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useApp();
  
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [word, setWord] = useState('');
  const [isImpostor, setIsImpostor] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    const { roundData, players, playerId: locPlayerId } = location.state || {};
    const actualPlayerId = playerId || locPlayerId;
    
    if (!roundData || !players || !actualPlayerId) {
      addNotification('Datos incompletos', 'error');
      navigate(`/game/${gameId}/play-round`);
      return;
    }

    const foundPlayer = players.find(p => p.id === parseInt(actualPlayerId));
    if (!foundPlayer) {
      addNotification('Jugador no encontrado', 'error');
      navigate(`/game/${gameId}/play-round`);
      return;
    }

    setPlayer(foundPlayer);
    setIsImpostor(foundPlayer.id === roundData.impostor_player_id);
    
    if (roundData.word_text) {
      setWord(roundData.word_text);
    } else {
      const words = ['ELEFANTE', 'GUITARRA', 'HELICÓPTERO', 'BIBLIOTECA', 'PARAGUAS', 'MONTANA', 'OCEANO', 'ESTRELLA'];
      setWord(words[Math.floor(Math.random() * words.length)]);
    }
    
    setLoading(false);
  }, []);

  const handleConfirm = () => {
    setHasConfirmed(true);
    
    setTimeout(() => {
      addNotification('Rol confirmado', 'success');
      
      navigate(`/game/${gameId}/play-round`, {
        state: {
          ...location.state,
          playerRevealed: playerId || location.state.playerId,
          confirmed: true
        }
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando tu rol...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(`/game/${gameId}/play-round`)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al juego
        </button>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center">
              {isImpostor ? (
                <Shield className="w-12 h-12 text-rose-300" />
              ) : (
                <User className="w-12 h-12 text-emerald-300" />
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">{player?.name}</h1>
            <p className="text-gray-400">Esta es tu información privada</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-blue-300" />
              <p className="text-sm text-gray-300">
                Solo tú puedes ver esta pantalla. No la muestres a los demás jugadores.
              </p>
            </div>
          </div>

          <div className={`rounded-2xl p-8 mb-8 text-center transition-all ${
            isImpostor 
              ? 'bg-rose-500/10 border-2 border-rose-500/30' 
              : 'bg-emerald-500/10 border-2 border-emerald-500/30'
          }`}>
            {isImpostor ? (
              <>
                <div className="text-5xl font-black text-rose-300 mb-4">IMPOSTOR</div>
                <p className="text-rose-200 text-lg font-medium mb-2">Tu misión es engañar</p>
                <p className="text-gray-300">
                  Los demás jugadores ven una palabra. Tú debes hacerles creer que también la ves.
                  ¡No te descubran!
                </p>
              </>
            ) : (
              <>
                <div className="text-5xl font-black text-emerald-300 mb-4">{word}</div>
                <p className="text-emerald-200 text-lg font-medium mb-2">Esta es tu palabra</p>
                <p className="text-gray-300">
                  El impostor no conoce esta palabra. Discute con los demás para descubrir quién miente.
                  Observa las reacciones de los demás jugadores.
                </p>
              </>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={hasConfirmed}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
              hasConfirmed
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-primary-500/25'
            }`}
          >
            {hasConfirmed ? (
              <>
                <Check className="w-6 h-6" />
                Confirmado
              </>
            ) : (
              <>
                <Eye className="w-6 h-6" />
                OK, YA LO HE VISTO
              </>
            )}
          </button>

          {!hasConfirmed && (
            <p className="text-center text-gray-400 text-sm mt-4">
              Haz clic cuando hayas memorizado tu rol. Después volverás al juego principal.
            </p>
          )}
        </div>

        <div className="mt-6 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-300 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300">
                <span className="font-bold text-white">Importante:</span> No reveles tu rol a los demás jugadores hasta el final del juego. El éxito depende del secreto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

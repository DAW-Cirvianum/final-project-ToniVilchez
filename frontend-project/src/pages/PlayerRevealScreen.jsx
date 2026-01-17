import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { wordService } from '../api/services';
import { Loading } from '../components/Loading';
import { ArrowLeft, Shield, User, Sword, Check, Key, AlertCircle, RefreshCw } from 'lucide-react';

export default function PlayerRevealScreen() {
  const { gameId, playerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useApp();
  const { roundData, players, words: wordsFromState } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [word, setWord] = useState(null);
  const [isImpostor, setIsImpostor] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWord = async () => {
    if (!roundData?.word_id) {
      throw new Error('No hay ID de palabra en los datos de la ronda');
    }

    console.log('Buscando palabra con ID:', roundData.word_id);
    console.log('WordsFromState:', wordsFromState);

    // 1. Buscar en wordsFromState (si viene de PlayRound)
    if (wordsFromState && Array.isArray(wordsFromState)) {
      const foundWord = wordsFromState.find(w => w.id === roundData.word_id);
      if (foundWord) {
        console.log('Palabra encontrada en wordsFromState:', foundWord);
        return foundWord;
      }
      console.log('Palabra NO encontrada en wordsFromState');
    }

    // 2. Intentar desde la API (si el método existe)
    try {
      console.log('Buscando palabra en API...');
      // Verificar si el método existe antes de llamarlo
      if (wordService.getWordById && typeof wordService.getWordById === 'function') {
        const response = await wordService.getWordById(roundData.word_id);
        if (response.data) {
          console.log('Palabra encontrada en API:', response.data);
          return response.data;
        }
      } else {
        console.log('wordService.getWordById no existe, saltando API');
      }
    } catch (apiError) {
      console.error('Error al obtener palabra de API:', apiError);
    }

    // 3. Si llegamos aquí, no se encontró la palabra
    throw new Error(`No se pudo encontrar la palabra con ID: ${roundData.word_id}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!roundData || !players) {
          addNotification('Datos incompletos de la ronda', 'error');
          setTimeout(() => navigate(`/game/${gameId}`), 2000);
          return;
        }

        const currentPlayer = players.find(p => p.id === parseInt(playerId));
        if (!currentPlayer) {
          addNotification('Jugador no encontrado', 'error');
          navigate(`/game/${gameId}/play`, { 
            state: { 
              ...location.state, 
              playerRevealed: null 
            } 
          });
          return;
        }

        setPlayer(currentPlayer);
        
        // Verificar si es el impostor
        const impostor = roundData.impostor_player_id === currentPlayer.id;
        setIsImpostor(impostor);

        console.log('Jugador:', currentPlayer.name, 'Es impostor:', impostor);

        // Solo buscar palabra si NO es impostor
        if (!impostor) {
          try {
            console.log('Buscando palabra para jugador no impostor');
            const fetchedWord = await fetchWord();
            setWord(fetchedWord);
            setError(null);
            console.log('Palabra establecida:', fetchedWord);
          } catch (wordError) {
            console.error('Error al cargar palabra:', wordError);
            setError(`No se pudo cargar la palabra: ${wordError.message}`);
            
            // Si tenemos word_text en roundData, usarlo
            if (roundData.word_text) {
              console.log('Usando word_text de roundData:', roundData.word_text);
              setWord({ 
                id: roundData.word_id,
                text: roundData.word_text,
                note: "Palabra de la ronda actual"
              });
            } else {
              // Aún así, mostrar una palabra de ejemplo para que no falle la UI
              setWord({ 
                id: roundData.word_id,
                text: "Palabra secreta",
                note: "La palabra se cargará durante el juego"
              });
            }
          }
        } else {
          console.log('Jugador es impostor, no necesita palabra');
        }

      } catch (error) {
        console.error('Error general cargando datos:', error);
        setError('Error al cargar los datos del jugador');
        addNotification('Error al cargar la información', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [roundData, players, playerId, gameId, navigate, addNotification, location.state, retryCount]);

  const handleBack = () => {
    navigate(`/game/${gameId}/play`, { 
      state: { 
        ...location.state, 
        playerRevealed: parseInt(playerId) 
      } 
    });
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoading(true);
    setError(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al juego
        </button>

        <div className="text-center mb-8">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl font-bold ${
            isImpostor 
              ? 'bg-gradient-to-br from-rose-500 to-rose-600' 
              : 'bg-gradient-to-br from-primary-500 to-primary-600'
          } text-white`}>
            {player?.name?.charAt(0) || '?'}
          </div>
          <h2 className="text-2xl font-bold text-white">{player?.name}</h2>
          <p className="text-gray-400">Este es tu rol secreto</p>
        </div>

        {error && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                <p className="text-amber-300 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div className={`rounded-2xl p-8 border-2 ${
          isImpostor 
            ? 'bg-rose-500/10 border-rose-500/30' 
            : 'bg-emerald-500/10 border-emerald-500/30'
        }`}>
          <div className="flex flex-col items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
              isImpostor 
                ? 'bg-rose-500/20' 
                : 'bg-emerald-500/20'
            }`}>
              {isImpostor ? (
                <Sword className="w-10 h-10 text-rose-300" />
              ) : (
                <Shield className="w-10 h-10 text-emerald-300" />
              )}
            </div>
            
            <div className="text-center w-full">
              {isImpostor ? (
                <>
                  <h3 className="text-3xl font-bold text-rose-300 mb-4">¡ERES EL IMPOSTOR!</h3>
                  
                  <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <User className="w-6 h-6 text-rose-300" />
                      <span className="text-lg font-bold text-rose-300">Tu identidad secreta</span>
                    </div>
                    <p className="text-gray-300">
                      Solo tú sabes que eres el impostor. Los demás ven una palabra que tú <span className="font-bold text-rose-300">NO conoces</span>.
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <h4 className="text-lg font-bold text-white mb-3">Tu misión:</h4>
                    <ul className="text-gray-300 space-y-2 text-left">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                        <span><span className="font-bold">Engaña</span> a los demás haciéndoles creer que conoces la palabra</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2"></div>
                        <span><span className="font-bold">Adivina</span> o descubre cuál es la palabra real</span>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-white mb-6">La palabra secreta es:</h3>
                  
                  <div className="relative mb-6">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl blur opacity-30"></div>
                    <div className="relative bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500/30 rounded-2xl p-8">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Key className="w-8 h-8 text-emerald-300" />
                        <span className="text-lg font-bold text-emerald-300">Palabra secreta</span>
                      </div>
                      <p className="text-5xl font-bold text-emerald-300 mb-3">
                        {word?.text || "Cargando..."}
                      </p>
                      {word?.note && (
                        <p className="text-amber-300 text-sm italic mb-2">
                          {word.note}
                        </p>
                      )}
                      <p className="text-emerald-200 text-sm">
                        Todos los jugadores (excepto el impostor) ven esta misma palabra
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                    <h4 className="text-lg font-bold text-blue-300 mb-3">Tu misión:</h4>
                    <p className="text-gray-300">
                      Descubrir quién es el impostor <span className="font-bold text-blue-300">sin decir la palabra directamente</span>.
                      El impostor intentará engañaros y adivinar la palabra.
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={handleBack}
              className={`mt-4 px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isImpostor
                  ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white'
              }`}
            >
              <Check className="w-5 h-5" />
              Entendido, volver al juego
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { X, Play, Shield, Lock, Users, RefreshCw, Home, EyeOff, Key, User, Sword } from 'lucide-react';

export default function CreateRoundModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  players = [], 
  words = [], 
  loading = false,
  gameId,
  navigate 
}) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImpostor, setSelectedImpostor] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);

  useEffect(() => {
    if (isOpen && words.length > 0 && players.length > 0) {
      selectRandomSecret();
    }
  }, [isOpen, words, players]);

  const selectRandomSecret = () => {
    if (words.length === 0 || players.length === 0) return;

    setIsRandomizing(true);
    
    setTimeout(() => {
      try {
        if (words.length > 0) {
          const randomWordIndex = Math.floor(Math.random() * words.length);
          const word = words[randomWordIndex];
          setSelectedWord(word);
        }

        if (players.length > 0) {
          const randomImpostorIndex = Math.floor(Math.random() * players.length);
          const impostor = players[randomImpostorIndex];
          setSelectedImpostor(impostor);

          let randomStartingIndex;
          if (players.length > 1) {
            do {
              randomStartingIndex = Math.floor(Math.random() * players.length);
            } while (randomStartingIndex === randomImpostorIndex);
          } else {
            randomStartingIndex = randomImpostorIndex;
          }
          
          const starting = players[randomStartingIndex];
          setStartingPlayer(starting);
        }
      } finally {
        setIsRandomizing(false);
      }
    }, 300);
  };

  const handleCreateRound = () => {
    if (selectedWord && selectedImpostor && startingPlayer) {
      onConfirm({ 
        word_id: selectedWord.id, 
        impostor_player_id: selectedImpostor.id,
        starting_player_id: startingPlayer.id 
      });
    }
  };

  const handleGoToMenu = () => {
    navigate(`/game/${gameId}`);
    onClose();
  };

  if (!isOpen) return null;
  
  const canCreate = selectedWord && selectedImpostor && startingPlayer && !isRandomizing && !loading;
  const canRandomize = words.length > 0 && players.length > 0 && !isRandomizing && !loading;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h3 className="text-xl font-bold text-white">Crear Nueva Ronda</h3>
            <p className="text-gray-400 text-sm">Configuración secreta</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white" 
            disabled={loading || isRandomizing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl">
                <Lock className="w-6 h-6 text-primary-300" />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-white">Información Secreta</h4>
                <p className="text-gray-400 text-sm">Los jugadores verán su rol al hacer clic</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <div className="p-2 bg-blue-500/10 rounded-lg inline-block mb-2">
                  <Key className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Palabra</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500/30 rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-500/30 rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-500/30 rounded-full"></div>
                  <EyeOff className="w-4 h-4 text-blue-300" />
                </div>
                <div className="text-xs text-gray-500">
                  {selectedWord ? 'Seleccionada' : 'No seleccionada'}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/20 rounded-xl p-4 text-center">
                <div className="p-2 bg-rose-500/10 rounded-lg inline-block mb-2">
                  <Sword className="w-5 h-5 text-rose-300" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Impostor</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="w-5 h-5 text-rose-300/50" />
                  <EyeOff className="w-4 h-4 text-rose-300" />
                </div>
                <div className="text-xs text-gray-500">
                  {selectedImpostor ? 'Seleccionado' : 'No seleccionado'}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                <div className="p-2 bg-yellow-500/10 rounded-lg inline-block mb-2">
                  <Users className="w-5 h-5 text-yellow-300" />
                </div>
                <p className="text-gray-400 text-sm mb-1">Comienza</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="w-5 h-5 text-yellow-300/50" />
                  <EyeOff className="w-4 h-4 text-yellow-300" />
                </div>
                <div className="text-xs text-gray-500">
                  {startingPlayer ? 'Seleccionado' : 'No seleccionado'}
                </div>
              </div>
            </div>
            
            <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-primary-300 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">
                    {selectedWord && selectedImpostor && startingPlayer ? (
                      <>
                        Se han seleccionado aleatoriamente: 
                        <span className="font-bold text-primary-300"> 1 palabra</span>, 
                        <span className="font-bold text-rose-300"> 1 impostor</span> y 
                        <span className="font-bold text-yellow-300"> 1 jugador inicial</span>.
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-yellow-300">Haz clic en "Cambiar Aleatorio"</span> para generar una nueva configuración secreta.
                      </>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Los jugadores descubrirán su rol al hacer clic en su nombre.
                  </p>
                </div>
              </div>
            </div>

            {(words.length === 0 || players.length === 0) && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mt-4">
                <p className="text-sm text-rose-300 text-center">
                  {words.length === 0 && players.length === 0 
                    ? 'No hay palabras ni jugadores disponibles'
                    : words.length === 0 
                    ? 'No hay palabras disponibles para esta categoría'
                    : 'No hay jugadores en el juego'}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={selectRandomSecret} 
                disabled={!canRandomize}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRandomizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Seleccionando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Cambiar Aleatorio
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={handleCreateRound} 
                disabled={!canCreate}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  canCreate 
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Iniciar Ronda
                  </>
                )}
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleGoToMenu}
                disabled={loading || isRandomizing}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Volver al Menú
              </button>
              
              <button
                onClick={onClose}
                disabled={loading || isRandomizing}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
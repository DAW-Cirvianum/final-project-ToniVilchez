import { useState, useEffect } from 'react';
import { X, Play, Shield, Lock } from 'lucide-react';

export default function CreateRoundModal({ isOpen, onClose, onConfirm, players = [], words = [], loading = false }) {
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedImpostor, setSelectedImpostor] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);

  useEffect(() => {
    if (isOpen && words.length > 0 && players.length > 0) selectRandomSecret();
  }, [isOpen, words, players]);

  const selectRandomSecret = () => {
    setIsRandomizing(true);
    setTimeout(() => {
      if (words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        setSelectedWord(words[randomIndex]);
      }
      if (players.length > 0) {
        const randomIndex = Math.floor(Math.random() * players.length);
        setSelectedImpostor(players[randomIndex]);
      }
      setIsRandomizing(false);
    }, 300);
  };

  const handleCreateRound = () => {
    if (selectedWord && selectedImpostor) onConfirm({ word_id: selectedWord.id, impostor_player_id: selectedImpostor.id });
  };

  if (!isOpen) return null;
  const canCreate = selectedWord && selectedImpostor && !isRandomizing;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div><h3 className="text-xl font-bold text-white">Crear Nueva Ronda</h3><p className="text-gray-400 text-sm">Selección secreta</p></div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-gray-400 hover:text-white" disabled={loading}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-primary-500/20 rounded-xl"><Lock className="w-6 h-6 text-primary-300" /></div>
              <div className="text-center"><h4 className="text-lg font-semibold text-white">Configuración secreta</h4><p className="text-gray-400 text-sm">La palabra y el impostor se seleccionan en privado</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="p-2 bg-blue-500/10 rounded-lg inline-block mb-2"><Shield className="w-5 h-5 text-blue-300" /></div>
                <p className="text-gray-400 text-sm mb-1">Palabra</p><p className="text-white font-medium">Seleccionada</p>
                <div className="mt-2 text-xs text-gray-500">{words.length} disponibles</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="p-2 bg-rose-500/10 rounded-lg inline-block mb-2"><Shield className="w-5 h-5 text-rose-300" /></div>
                <p className="text-gray-400 text-sm mb-1">Impostor</p><p className="text-white font-medium">Seleccionado</p>
                <div className="mt-2 text-xs text-gray-500">{players.length} jugadores</div>
              </div>
            </div>
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-gray-300 text-center">Cada jugador verá su rol en privado al hacer clic en su nombre. Solo el impostor sabrá que es el impostor.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={selectRandomSecret} disabled={isRandomizing || loading || words.length === 0 || players.length === 0} className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isRandomizing ? 'Seleccionando...' : 'Cambiar Aleatorio'}
            </button>
            <button type="button" onClick={handleCreateRound} disabled={!canCreate} className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${canCreate ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
              {loading ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Creando...</>) : (<><Play className="w-5 h-5" /> Iniciar Ronda</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

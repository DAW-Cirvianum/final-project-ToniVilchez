import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { gameService, categoryService } from '../api/services';
import { Loading } from '../components/Loading';
import CreateRoundModal from '../components/CreateRoundModal';
import { ArrowLeft, Eye, EyeOff, Play, CheckCircle, Check, RefreshCw, Users, Trophy, Sword, Key } from 'lucide-react';

export default function PlayRound() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useApp();
  const { roundData, players, categoryName, game: initialGame } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [revealedPlayers, setRevealedPlayers] = useState([]);
  const [clickedPlayers, setClickedPlayers] = useState([]);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showImpostor, setShowImpostor] = useState(false);
  const [startingPlayer, setStartingPlayer] = useState(null);
  const [showNewRoundModal, setShowNewRoundModal] = useState(false);
  const [words, setWords] = useState([]);
  const [gamePlayers, setGamePlayers] = useState([]);
  const [creatingRound, setCreatingRound] = useState(false);
  const [currentRoundId, setCurrentRoundId] = useState(null);
  const [game, setGame] = useState(initialGame || null);
  const [categoryId, setCategoryId] = useState(null);

  // Funció per reiniciar l'estat d'una nova ronda
  const resetRoundState = () => {
    console.log('Reiniciant estat de la nova ronda...');
    setRevealedPlayers([]);
    setClickedPlayers([]);
    setAllRevealed(false);
    setShowImpostor(false);
    setStartingPlayer(null);
  };

  // Funció per carregar les dades del joc des de l'API
  const loadGameData = async () => {
    try {
      console.log('Carregant dades del joc:', gameId);
      
      const response = await gameService.getById(gameId);
      if (response.data && response.data.success) {
        const gameData = response.data.data;
        console.log('Dades del joc carregades:', gameData);
        setGame(gameData);
        
        // Obtenir category_id del joc
        if (gameData.category_id) {
          setCategoryId(gameData.category_id);
          return gameData.category_id;
        }
      }
    } catch (error) {
      console.error('Error carregant dades del joc:', error);
      addNotification('Error al carregar les dades del joc', 'error');
    }
    return null;
  };

  // Funció per carregar paraules de la categoria
  const loadCategoryWords = async (catId) => {
    try {
      console.log('Carregant paraules de la categoria:', catId);
      
      // Provar amb /categories/{id}/words-only
      try {
        const response = await categoryService.getWordsOnly(catId);
        console.log('Resposta de getWordsOnly:', response);
        
        if (response.data && response.data.success) {
          console.log('Paraules de la categoria (words-only):', response.data.data);
          setWords(response.data.data);
          return response.data.data;
        }
      } catch (wordsOnlyError) {
        console.log('Error amb words-only, provant amb getById:', wordsOnlyError);
      }
      
      // Si words-only falla, provar amb /categories/{id}
      try {
        const response = await categoryService.getById(catId);
        console.log('Resposta de getById:', response);
        
        if (response.data && response.data.success) {
          const categoryData = response.data.data;
          if (categoryData.words && Array.isArray(categoryData.words)) {
            console.log('Paraules de la categoria (getById):', categoryData.words);
            setWords(categoryData.words);
            return categoryData.words;
          }
        }
      } catch (categoryError) {
        console.log('Error carregant categoria:', categoryError);
      }
      
      // Dades d'exemple com a últim recurs
      console.log('Utilitzant paraules d\'exemple');
      const exampleWords = [
        { id: 1, text: "Computadora", note: "Dispositiu electrònic" },
        { id: 2, text: "Telèfon", note: "Comunicació mòbil" },
        { id: 3, text: "Muntanya", note: "Formació natural" },
        { id: 4, text: "Riu", note: "Cos d'aigua" },
        { id: 5, text: "Futbol", note: "Esport popular" }
      ];
      setWords(exampleWords);
      return exampleWords;
      
    } catch (error) {
      console.error('Error carregant paraules:', error);
      addNotification('Error al carregar les paraules', 'error');
      
      // Tot i així establir paraules d'exemple
      const exampleWords = [
        { id: 1, text: "Computadora" },
        { id: 2, text: "Telèfon" },
        { id: 3, text: "Muntanya" },
        { id: 4, text: "Riu" },
        { id: 5, text: "Futbol" }
      ];
      setWords(exampleWords);
      return exampleWords;
    }
  };

  // Funció per carregar dades del localStorage per a la ronda actual
  const loadRoundStateFromStorage = (roundWordId) => {
    if (roundWordId) {
      console.log(`Carregant estat per a la ronda amb word_id: ${roundWordId}`);
      
      const savedRevealed = localStorage.getItem(`revealed_${gameId}_${roundWordId}`);
      if (savedRevealed) {
        const parsedRevealed = JSON.parse(savedRevealed);
        console.log('Jugadors revelats carregats:', parsedRevealed);
        setRevealedPlayers(parsedRevealed);
      } else {
        console.log('No hi ha jugadors revelats guardats per a aquesta ronda');
        setRevealedPlayers([]);
      }
      
      const savedClicked = localStorage.getItem(`clicked_${gameId}_${roundWordId}`);
      if (savedClicked) {
        const parsedClicked = JSON.parse(savedClicked);
        console.log('Clics registrats carregats:', parsedClicked);
        setClickedPlayers(parsedClicked);
      } else {
        console.log('No hi ha clics registrats per a aquesta ronda');
        setClickedPlayers([]);
      }
      
      // Actualitzar l'ID de la ronda actual
      setCurrentRoundId(roundWordId);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!roundData || !players || players.length === 0) {
        addNotification('Dades incompletes de la ronda', 'error');
        setTimeout(() => navigate(`/game/${gameId}`), 2000);
        return;
      }

      console.log('Dades rebudes:', { roundData, players, gameId });

      setSelectedPlayers(players);
      setGamePlayers(players);
      
      // Carregar estat de localStorage per a aquesta ronda específica
      if (roundData.word_id) {
        loadRoundStateFromStorage(roundData.word_id);
      }
      
      // Establir jugador inicial
      if (roundData.starting_player_id) {
        const starting = players.find(p => p.id === roundData.starting_player_id);
        setStartingPlayer(starting || players[0]);
      } else if (players.length > 0) {
        const randomIndex = Math.floor(Math.random() * players.length);
        setStartingPlayer(players[randomIndex]);
      }
      
      // Carregar dades del joc i paraules
      try {
        // Si ja tenim game amb category_id, usar-lo
        let catId = categoryId;
        
        if (!catId && initialGame && initialGame.category_id) {
          catId = initialGame.category_id;
          setCategoryId(initialGame.category_id);
        }
        
        // Si encara no tenim category_id, carregar dades del joc
        if (!catId) {
          catId = await loadGameData();
        }
        
        // Carregar paraules de la categoria
        if (catId) {
          await loadCategoryWords(catId);
        } else {
          console.warn('No s\'ha pogut obtenir category_id');
        }
      } catch (error) {
        console.error('Error carregant dades:', error);
      }
      
      setLoading(false);
    };

    loadData();
  }, [roundData, players, gameId, navigate, addNotification]);

  useEffect(() => {
    if (clickedPlayers.length >= selectedPlayers.length && selectedPlayers.length > 0) {
      setAllRevealed(true);
    } else {
      setAllRevealed(false);
    }
  }, [clickedPlayers, selectedPlayers]);

  useEffect(() => {
    if (clickedPlayers.length > 0 && currentRoundId) {
      console.log(`Guardant clics per a la ronda ${currentRoundId}:`, clickedPlayers);
      localStorage.setItem(`clicked_${gameId}_${currentRoundId}`, JSON.stringify(clickedPlayers));
    }
  }, [clickedPlayers, gameId, currentRoundId]);

  useEffect(() => {
    if (revealedPlayers.length > 0 && currentRoundId) {
      console.log(`Guardant jugadors revelats per a la ronda ${currentRoundId}:`, revealedPlayers);
      localStorage.setItem(`revealed_${gameId}_${currentRoundId}`, JSON.stringify(revealedPlayers));
    }
  }, [revealedPlayers, gameId, currentRoundId]);

  useEffect(() => {
    if (location.state?.playerRevealed) {
      const playerId = parseInt(location.state.playerRevealed);
      
      if (!revealedPlayers.includes(playerId)) {
        const updated = [...revealedPlayers, playerId];
        setRevealedPlayers(updated);
        
        if (location.state) {
          navigate(location.pathname, { 
            replace: true,
            state: { ...location.state, playerRevealed: null }
          });
        }
      }
    }
  }, [location.state?.playerRevealed, navigate, location, revealedPlayers]);

  const handlePlayerClick = (playerId) => {
    if (clickedPlayers.includes(playerId)) {
      addNotification('Ja has fet clic al teu botó', 'info');
      return;
    }

    const updatedClicked = [...clickedPlayers, playerId];
    setClickedPlayers(updatedClicked);
    
    const isRevealed = revealedPlayers.includes(playerId);
    
    if (isRevealed) {
      addNotification('Ja has vist el teu rol', 'info');
      return;
    }

    // IMPORTANT: Passar les paraules a PlayerRevealScreen
    navigate(`/game/${gameId}/player/${playerId}/reveal`, {
      state: {
        roundData,
        players: selectedPlayers,
        playerId,
        gameId,
        categoryName,
        game: game || { id: gameId },
        words: words // Això és crucial
      }
    });
  };

  const handleStartGame = () => {
    addNotification(`Que comenci el joc! ${startingPlayer?.name} comença.`, 'success');
  };

  const handleRevealImpostor = () => {
    setShowImpostor(true);
    addNotification('Impostor revelat!', 'info');
  };

  const handleCreateNewRound = async (newRoundData) => {
    try {
      setCreatingRound(true);
      setShowNewRoundModal(false);
      
      console.log('Creant nova ronda:', newRoundData);
      console.log('Paraules disponibles:', words);
      
      if (!newRoundData.word_id || !newRoundData.impostor_player_id) {
        addNotification('Error: Falten dades per crear la ronda', 'error');
        return;
      }
      
      // Verificar que la paraula existeix al nostre array
      const selectedWord = words.find(w => w.id === newRoundData.word_id);
      if (!selectedWord) {
        console.error('Paraula no trobada:', newRoundData.word_id, 'en:', words);
        addNotification('Error: La paraula seleccionada no existeix', 'error');
        return;
      }
      
      // Netejar localStorage de la ronda actual
      if (currentRoundId) {
        localStorage.removeItem(`revealed_${gameId}_${currentRoundId}`);
        localStorage.removeItem(`clicked_${gameId}_${currentRoundId}`);
      }
      
      // Crear la ronda al backend
      try {
        const roundResponse = await gameService.createRound(gameId, {
          word_id: newRoundData.word_id,
          impostor_player_id: newRoundData.impostor_player_id,
          starting_player_id: newRoundData.starting_player_id
        });
        
        console.log('Ronda creada al backend:', roundResponse);
        
        if (roundResponse.data && !roundResponse.data.success) {
          throw new Error(roundResponse.data.message || 'Error al crear la ronda');
        }
      } catch (apiError) {
        console.error('Error creant ronda al backend:', apiError);
        // Continuem igualment per mostrar la nova ronda al frontend
        addNotification('Ronda creada (local)', 'info');
      }
      
      // Reiniciar tot l'estat per a la nova ronda
      resetRoundState();
      
      addNotification('Nova ronda creada!', 'success');
      
      // Crear l'objecte de nova ronda amb totes les dades necessàries
      const newRoundComplete = {
        ...newRoundData,
        word_text: selectedWord.text
      };
      
      // Navegar a la nova ronda amb tot reiniciat
      navigate(`/game/${gameId}/play`, {
        state: {
          roundData: newRoundComplete,
          players: gamePlayers,
          categoryName,
          game: game || { id: gameId, category_id: categoryId },
          words: words // Passar les mateixes paraules
        },
        replace: true
      });
      
    } catch (error) {
      console.error('Error creant nova ronda:', error);
      addNotification('Error al crear nova ronda', 'error');
    } finally {
      setCreatingRound(false);
    }
  };

  const handleFinishRound = async () => {
    try {
      // Guardar la ronda al backend si encara no s'ha fet
      if (roundData && roundData.word_id) {
        await gameService.createRound(gameId, {
          word_id: roundData.word_id,
          impostor_player_id: roundData.impostor_player_id,
          starting_player_id: roundData.starting_player_id
        });
      }
      
      // Netejar localStorage d'AQUESTA ronda específica
      if (currentRoundId) {
        localStorage.removeItem(`revealed_${gameId}_${currentRoundId}`);
        localStorage.removeItem(`clicked_${gameId}_${currentRoundId}`);
      }
      
      addNotification('Ronda guardada a l\'historial', 'success');
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error al guardar ronda:', error);
      addNotification('Ronda completada', 'info');
      navigate(`/game/${gameId}`);
    }
  };

  if (loading) return <Loading />;

  const impostor = selectedPlayers.find(p => p.id === roundData?.impostor_player_id);
  const progressPercentage = selectedPlayers.length > 0 
    ? (clickedPlayers.length / selectedPlayers.length) * 100 
    : 0;
  const isComplete = progressPercentage === 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/game/${gameId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Tornar al joc
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Nova Ronda</h1>
            <p className="text-gray-400">{categoryName || 'Joc'}</p>
            <p className="text-gray-500 text-sm">
              {words.length > 0 ? `${words.length} paraules disponibles` : 'Carregant paraules...'}
            </p>
          </div>
          
          <div className="w-24"></div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">
              {clickedPlayers.length}/{selectedPlayers.length} jugadors han fet clic
            </span>
            <span className={`text-sm font-medium ${
              isComplete ? 'text-emerald-400' : 'text-yellow-400'
            }`}>
              {isComplete ? 'Tots a punt!' : 'Esperant...'}
            </span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                isComplete 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-primary-500 to-primary-600'
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {isComplete && startingPlayer && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-2xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">Ronda llesta per començar!</h3>
                <p className="text-gray-300 text-lg">
                  <span className="font-bold text-yellow-300">{startingPlayer.name}</span> començarà la ronda
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Users className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
          </div>
        )}

        {isComplete && (
          <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 animate-fade-in">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Començar Joc
              </button>
              
              <button
                onClick={() => setShowNewRoundModal(true)}
                disabled={words.length === 0}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  words.length > 0
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                {words.length > 0 ? 'Nova Ronda' : 'Sense paraules'}
              </button>
              
              <button
                onClick={handleRevealImpostor}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Revelar Impostor
              </button>
              
              <button
                onClick={handleFinishRound}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Finalitzar Ronda
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {selectedPlayers.map((player) => {
            const isRevealed = revealedPlayers.includes(player.id);
            const isClicked = clickedPlayers.includes(player.id);
            const isStarting = startingPlayer?.id === player.id;
            
            return (
              <button
                key={player.id}
                onClick={() => handlePlayerClick(player.id)}
                disabled={isClicked}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  isClicked
                    ? 'bg-blue-500/10 border-blue-500/30 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 hover:border-primary-500/40 hover:bg-white/10 active:scale-95'
                } ${isStarting && isComplete ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-slate-900' : ''}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    isClicked
                      ? isRevealed
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      : 'bg-gradient-to-br from-slate-700 to-slate-800'
                  }`}>
                    {isClicked ? (
                      isRevealed ? (
                        <Check className="w-8 h-8 text-white" />
                      ) : (
                        <Eye className="w-8 h-8 text-white" />
                      )
                    ) : (
                      <EyeOff className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-bold text-lg truncate">{player.name}</p>
                    
                    {isClicked ? (
                      <div className="mt-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                          isRevealed 
                            ? 'bg-emerald-500/20' 
                            : 'bg-blue-500/20'
                        }`}>
                          {isRevealed ? (
                            <>
                              <Check className="w-4 h-4 text-emerald-300" />
                              <span className="text-emerald-300 text-sm font-medium">Ja ha vist</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-blue-300" />
                              <span className="text-blue-300 text-sm font-medium">Clic registrat</span>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-primary-300 text-sm mt-2">Clic per veure el teu rol</p>
                    )}
                  </div>
                </div>

                {isStarting && isComplete && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-yellow-500/30 text-yellow-300 text-xs font-bold rounded-full animate-pulse">
                      COMENÇA
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 mb-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Key className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-medium text-blue-300">Paraula</span>
              </div>
              <div className="flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-blue-300/50" />
                <span className="text-xs text-gray-400 ml-2">Secreta</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-rose-500/10 to-rose-600/10 border border-rose-500/20 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sword className="w-4 h-4 text-rose-300" />
                <span className="text-xs font-medium text-rose-300">Impostor</span>
              </div>
              <div className="flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-rose-300/50" />
                <span className="text-xs text-gray-400 ml-2">Secret</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-4 h-4 text-yellow-300" />
                <span className="text-xs font-medium text-yellow-300">Comença</span>
              </div>
              {isComplete ? (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-yellow-300">{startingPlayer?.name}</span>
                  <span className="text-xs text-gray-400">Aleatori</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-yellow-300/50" />
                  <span className="text-xs text-gray-400 ml-2">Secret</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {showImpostor && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-rose-500/20 rounded-2xl flex items-center justify-center">
                <Sword className="w-10 h-10 text-rose-300" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">L'impostor era!</h3>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {impostor?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-rose-300 block">{impostor?.name || 'Desconegut'}</span>
                    <span className="text-rose-400 text-sm">Ha estat l'impostor!</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowNewRoundModal(true)}
                    disabled={words.length === 0}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      words.length > 0
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    Nova Ronda
                  </button>
                  
                  <button
                    onClick={handleFinishRound}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Guardar i Sortir
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateRoundModal
        isOpen={showNewRoundModal}
        onClose={() => setShowNewRoundModal(false)}
        onConfirm={handleCreateNewRound}
        players={gamePlayers}
        words={words}
        loading={creatingRound}
        gameId={gameId}
        navigate={navigate}
      />
    </div>
  );
}
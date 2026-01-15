import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Categories from '../pages/Categories';
import Games from '../pages/Games';
import Game from '../pages/Game';
import GameSetup from '../pages/GameSetup';
import PlayRound from '../pages/PlayRound';
import PlayerRevealScreen from '../pages/PlayerRevealScreen';
import Profile from '../pages/Profile';

export default function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      {/* Rutes públiques */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/categories" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/categories" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/categories" />} />

      {/* Rutes protegides */}
      <Route path="/" element={user ? <Navigate to="/categories" /> : <Navigate to="/login" />} />
      <Route path="/categories" element={user ? <Categories /> : <Navigate to="/login" />} />
      <Route path="/games" element={user ? <Games /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/game/setup" element={user ? <GameSetup /> : <Navigate to="/login" />} />
      <Route path="/game/:id" element={user ? <Game /> : <Navigate to="/login" />} />
      <Route path="/game/:gameId/play-round" element={user ? <PlayRound /> : <Navigate to="/login" />} />
      <Route path="/game/:gameId/player/:playerId/reveal" element={user ? <PlayerRevealScreen /> : <Navigate to="/login" />} />
    </Routes>
  );
}

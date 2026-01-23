import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import VerifyEmail from '../components/VerifyEmail';
import Categories from '../pages/Categories';
import Games from '../pages/Games';
import Game from '../pages/Game';
import GameSetup from '../pages/GameSetup';
import PlayRound from '../pages/PlayRound';
import PlayerRevealScreen from '../pages/PlayerRevealScreen';
import Profile from '../pages/Profile';
import Home from '../pages/Home';
import AdminUsers from '../pages/AdminUsers';

export default function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Navigate to="/categories" />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/categories" />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/categories" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/categories" />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email/:id/:hash" element={<VerifyEmail />} />
      
      <Route path="/categories" element={user ? <Categories /> : <Navigate to="/" />} />
      <Route path="/games" element={user ? <Games /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
      <Route path="/game/setup" element={user ? <GameSetup /> : <Navigate to="/" />} />
      <Route path="/game/:id" element={user ? <Game /> : <Navigate to="/" />} />
      <Route path="/game/:gameId/play-round" element={user ? <PlayRound /> : <Navigate to="/" />} />
      <Route path="/game/:gameId/player/:playerId/reveal" element={user ? <PlayerRevealScreen /> : <Navigate to="/" />} />
      <Route path="/game/:gameId/play" element={user ? <PlayRound /> : <Navigate to="/" />} />
      
      <Route path="/admin/users" element={
        user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/categories" />
      } />
      
      <Route path="*" element={<Navigate to={user ? "/categories" : "/"} />} />
    </Routes>
  );
}
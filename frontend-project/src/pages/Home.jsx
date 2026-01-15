import { Link } from 'react-router-dom';
import { Gamepad2, Users, Sparkles, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-primary-900/10 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-2xl">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-primary-200 bg-clip-text text-transparent">
              Impostor Game
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Juega a adivinar quién es el impostor en esta emocionante experiencia social
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-500/30"
            >
              Comenzar a jugar
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border border-white/20"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Personalizable</h3>
            <p className="text-gray-400">Crea tus propias categorías y palabras</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Multijugador</h3>
            <p className="text-gray-400">Juega con amigos en tiempo real</p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Competitivo</h3>
            <p className="text-gray-400">Sigue tu progreso y compite</p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Cómo funciona?</h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <p className="text-gray-300 mb-6">
              En cada ronda, se asigna una palabra secreta a todos los jugadores excepto al impostor.
              El impostor debe adivinarla haciéndose pasar por uno más, mientras los demás intentan
              descubrir quién es el impostor.
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>Selecciona categoría</p>
              </div>
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>Añade jugadores</p>
              </div>
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>¡Comienza a jugar!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
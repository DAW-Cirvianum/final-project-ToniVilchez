import { Link } from 'react-router-dom';
import { Gamepad2, Users, Sparkles, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-primary-900/10 to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-2xl">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-indigo-200 to-primary-200 bg-clip-text text-transparent">
              {t('home.title')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-500/30"
            >
              {t('home.startPlaying')}
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 border border-white/20"
            >
              {t('home.createAccount')}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('home.features.customizable.title')}
            </h3>
            <p className="text-gray-400">
              {t('home.features.customizable.description')}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('home.features.multiplayer.title')}
            </h3>
            <p className="text-gray-400">
              {t('home.features.multiplayer.description')}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-primary-500/30 transition-all group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-primary-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {t('home.features.competitive.title')}
            </h3>
            <p className="text-gray-400">
              {t('home.features.competitive.description')}
            </p>
          </div>
        </div>

        <div className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            {t('home.howItWorks.title')}
          </h2>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <p className="text-gray-300 mb-6">
              {t('home.howItWorks.description')}
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>{t('home.howItWorks.step1')}</p>
              </div>
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>{t('home.howItWorks.step2')}</p>
              </div>
              <div className="space-y-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full mx-auto"></div>
                <p>{t('home.howItWorks.step3')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
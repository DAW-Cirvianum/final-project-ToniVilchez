import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../api/services';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { id, hash } = useParams();
  const [search] = useState(new URLSearchParams(window.location.search));
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const expires = search.get('expires');
        const signature = search.get('signature');
        
        const params = {};
        if (expires) params.expires = expires;
        if (signature) params.signature = signature;

        const response = await authService.verifyEmail(id, hash, params);
        
        setMessage(response.data?.message || t('auth.messages.emailVerified', 'Email verificat correctament'));
        
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'emailVerified',
              email: response.data?.user?.email 
            } 
          });
        }, 3000);
        
      } catch (err) {
        const errorMsg = err.response?.data?.message || 
                        t('auth.messages.emailVerifyError', 'Error verificant email');
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id && hash) {
      verifyEmail();
    } else {
      setError(t('auth.errors.invalidVerificationLink', 'Link de verificació invàlid'));
      setLoading(false);
    }
  }, [id, hash, navigate, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-white">{t('auth.verifyingEmail', 'Verificant email...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white font-black text-3xl">I</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            {t('auth.emailVerification', 'Verificació d\'Email')}
          </h1>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6 shadow-2xl">
          {error ? (
            <div className="space-y-6">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.928-.833-2.698 0L6.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-lg font-medium text-rose-400">
                    {t('common.error', 'Error')}
                  </h3>
                </div>
                <div className="mt-3">
                  <p className="text-rose-300">{error}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all"
                >
                  {t('auth.backToLogin', 'Tornar a Login')}
                </button>
                
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-center"
                >
                  {t('auth.createNewAccount', 'Crear nova compte')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-emerald-400">
                    {t('common.success', 'Èxit')}
                  </h3>
                </div>
                <div className="mt-3">
                  <p className="text-emerald-300">{message}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {t('auth.redirectingToLogin', 'Redirigint a login...')}
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
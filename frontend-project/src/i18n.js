// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ca from './locales/ca.json';
import es from './locales/es.json';
import en from './locales/en.json';

// Funció per obtenir idioma del backend
const getInitialLanguage = async () => {
  try {
    const response = await fetch('/api/current-locale', {
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.locale || 'ca';
    }
  } catch (error) {
    console.warn('Could not load locale from backend');
  }
  
  // Fallback: mira localStorage, cookie o navegador
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && ['ca', 'es', 'en'].includes(savedLang)) {
    return savedLang;
  }
  
  // Idioma del navegador
  const browserLang = navigator.language?.split('-')[0];
  if (['ca', 'es', 'en'].includes(browserLang)) {
    return browserLang;
  }
  
  return 'ca';
};

// Inicialitza
getInitialLanguage().then(initialLang => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ca: { translation: ca },
        es: { translation: es },
        en: { translation: en }
      },
      lng: initialLang, // Idioma inicial
      fallbackLng: 'ca',
      debug: import.meta.env.DEV,
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'cookie', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'app_locale',
        cookieMinutes: 60 * 24 * 30,
      }
    });
});

export default i18n;
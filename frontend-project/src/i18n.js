import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ca from './locales/ca.json';
import es from './locales/es.json';
import en from './locales/en.json';

const getInitialLanguage = async () => {
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && ['ca', 'es', 'en'].includes(savedLang)) {
    return savedLang;
  }
  
  const cookieMatch = document.cookie.match('(^|;)\\s*app_locale\\s*=\\s*([^;]+)');
  if (cookieMatch) {
    const cookieLang = cookieMatch.pop();
    if (['ca', 'es', 'en'].includes(cookieLang)) {
      localStorage.setItem('i18nextLng', cookieLang);
      return cookieLang;
    }
  }
  
  try {
    const response = await fetch('/api/current-locale', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.locale && ['ca', 'es', 'en'].includes(data.locale)) {
        localStorage.setItem('i18nextLng', data.locale);
        return data.locale;
      }
    }
  } catch (error) {
    console.warn('No es pot obtenir l\'idioma del backend:', error.message);
  }
  
  const browserLang = navigator.language?.split('-')[0];
  if (['ca', 'es', 'en'].includes(browserLang)) {
    localStorage.setItem('i18nextLng', browserLang);
    return browserLang;
  }
  
  localStorage.setItem('i18nextLng', 'ca');
  return 'ca';
};

const initializeI18n = async () => {
  const initialLang = await getInitialLanguage();
  
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ca: { translation: ca },
        es: { translation: es },
        en: { translation: en }
      },
      
      lng: initialLang,
      fallbackLng: 'ca',
      supportedLngs: ['ca', 'es', 'en'],
            
      interpolation: {
        escapeValue: false
      },
      
      detection: {
        order: [
          'localStorage',
          'cookie',
          'sessionStorage',
          'navigator',
          'htmlTag',
          'path',
          'subdomain'
        ],
        
        caches: ['localStorage', 'cookie'],
        
        lookupLocalStorage: 'i18nextLng',
        lookupCookie: 'app_locale',
        lookupSessionStorage: 'i18nextLng',
        
        cookieMinutes: 60 * 24 * 30,
        cookieDomain: window.location.hostname,
        cookieSecure: false,
        cookieSameSite: 'lax',
        
        checkWhitelist: true
      },
      
      react: {
        useSuspense: false
      },
      
      saveMissing: import.meta.env.DEV,
    });
  
  i18n.on('languageChanged', (newLang) => {
    
    localStorage.setItem('i18nextLng', newLang);
    
    syncLocaleWithServer(newLang);
  });
  
  return i18n;
};

const syncLocaleWithServer = async (locale) => {
  try {
    const response = await fetch('/api/set-locale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ locale }),
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
    }
  } catch (error) {
    console.warn('No es pot sincronitzar l\'idioma amb el servidor:', error);
  }
};

export const changeLanguage = async (lang) => {
  if (!['ca', 'es', 'en'].includes(lang)) {
    console.error('Idioma no suportat:', lang);
    return false;
  }
  
  try {
    await i18n.changeLanguage(lang);
    
    document.cookie = `app_locale=${lang}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    
    await syncLocaleWithServer(lang);
    
    return true;
  } catch (error) {
    console.error('Error al canviar d\'idioma:', error);
    return false;
  }
};

export const getCurrentLanguage = () => i18n.language;

export const getSupportedLanguages = () => [
  { code: 'ca', name: 'Català'},
  { code: 'es', name: 'Español'},
  { code: 'en', name: 'English'}
];

const i18nInstance = initializeI18n();

export { i18nInstance as i18n };
export default i18n;
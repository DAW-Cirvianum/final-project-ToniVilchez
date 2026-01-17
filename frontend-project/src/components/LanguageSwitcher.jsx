import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'ca', name: 'Català', short: 'CA' },
    { code: 'es', name: 'Español', short: 'ES' },
    { code: 'en', name: 'English', short: 'EN' }
  ];

  const changeLanguage = async (locale) => {
    try {
      await i18n.changeLanguage(locale);
      localStorage.setItem('i18nextLng', locale);
      
      try {
        const response = await fetch('http://localhost/api/set-locale', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ locale })
        });
        
        if (!response.ok) {
          console.warn('No es pot sincronitzar idioma (CORS potser)');
        }
      } catch (error) {
        console.warn('Error sincronitzant idioma, però funciona localment');
      }
      
    } catch (error) {
      console.error('Error canviant idioma:', error);
    }
  };

  const currentLang = languages.find(lang => 
    i18n.language === lang.code || i18n.language?.startsWith(lang.code)
  );

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`px-2 py-1 rounded text-sm transition-colors ${
            i18n.language === lang.code
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title={lang.name}
        >
          {lang.flag} {lang.short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
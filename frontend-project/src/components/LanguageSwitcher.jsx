import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'ca', name: 'Català', short: 'CA'},
    { code: 'es', name: 'Español', short: 'ES'},
    { code: 'en', name: 'English', short: 'EN'}
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
          console.warn(t('languageSwitcher.warnings.corsWarning'));
        }
      } catch (error) {
        console.warn(t('languageSwitcher.warnings.syncError'));
      }
      
    } catch (error) {
      console.error(t('languageSwitcher.errors.changeError'), error);
    }
  };

  const currentLang = languages.find(lang => 
    i18n.language === lang.code || i18n.language?.startsWith(lang.code)
  );

  return (
    <div className="flex items-center space-x-2">
      <div className="hidden sm:flex items-center space-x-2">
        <Globe className="w-4 h-4 text-gray-400" />
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              i18n.language === lang.code || i18n.language?.startsWith(lang.code)
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
            }`}
            title={`${t('languageSwitcher.changeTo')} ${lang.name}`}
            aria-label={`${t('languageSwitcher.changeTo')} ${lang.name}`}
          >
            <span className="hidden md:inline">{lang.name}</span>
            <span className="md:hidden">{lang.flag}</span>
          </button>
        ))}
      </div>
      
      <div className="flex sm:hidden items-center">
        <div className="relative group">
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            <Globe className="w-5 h-5 text-gray-300" />
          </button>
          <div className="absolute right-0 mt-2 py-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                  i18n.language === lang.code || i18n.language?.startsWith(lang.code)
                    ? 'bg-primary-500/20 text-primary-300'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="text-xs opacity-70 ml-auto">({lang.short})</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
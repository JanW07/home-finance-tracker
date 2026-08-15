import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  if (SUPPORTED_LANGUAGES.length <= 1) {
    return null;
  }

  return (
    <div className="language-switcher">
      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = i18n.language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            disabled={isActive}
            className={isActive ? 'active' : ''}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};
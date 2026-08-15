import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button onClick={toggleTheme} className="theme-switcher-btn">
      {theme === 'light' ? t('theme.light') : t('theme.dark')}
    </button>
  );
};
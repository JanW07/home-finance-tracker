import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavCardGrid } from './NavCardGrid';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="home-page">
      <header className="home-header">
        <h1 className="home-title">{t('dashboard.title')}</h1>
        <p className="home-subtitle">{t('dashboard.subtitle')}</p>
      </header>
      <NavCardGrid />
    </section>
  );
};
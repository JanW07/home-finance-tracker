import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import './Layout.css';

export const Layout: React.FC = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <Navbar />
        <div className="header-controls">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};
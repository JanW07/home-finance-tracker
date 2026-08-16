import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/homePage/HomePage';
import CategoriesPage from './pages/categories/CategoriesPage';
import TransactionsPage from './pages/transactions/TransactionsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="expenses" element={<Navigate to="/transactions" replace />} />
        <Route path="subscriptions" element={<Navigate to="/transactions" replace />} />
        
        <Route path="*" element={<h2>404 — Strona nie istnieje</h2>} />
      </Route>
    </Routes>
  );
};

export default App;
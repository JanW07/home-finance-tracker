import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/homePage/HomePage';
import CategoriesPage from './pages/categories/CategoriesPage';
import TransactionsPage from './pages/transactions/TransactionsPage';
import SubscriptionsPage from './pages/subscriptions/SubscriptionsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />        
        <Route path="*" element={<h2>404 — Strona nie istnieje</h2>} />
      </Route>
    </Routes>
  );
};

export default App;
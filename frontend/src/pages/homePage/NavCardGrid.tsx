import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavCardItem } from './NavCardItem';
import type { NavCardData } from './NavCardItem';

const NAV_CARDS: NavCardData[] = [
  {
    titleKey: 'dashboard.categories.title',
    descriptionKey: 'dashboard.categories.description',
    path: '/categories',
    icon: '🏷️',
  },
  {
    titleKey: 'dashboard.transactions.title',
    descriptionKey: 'dashboard.transactions.description',
    path: '/transactions',
    icon: '💳',
  },
  {
    titleKey: 'dashboard.subscriptions.title',
    descriptionKey: 'dashboard.subscriptions.description',
    path: '/subscriptions',
    icon: '🔄',
  },
];
export const NavCardGrid: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="nav-card-grid">
      {NAV_CARDS.map((card) => (
        <NavCardItem
          key={card.path}
          path={card.path}
          icon={card.icon}
          title={t(card.titleKey)}
          description={t(card.descriptionKey)}
        />
      ))}
    </div>
  );
};
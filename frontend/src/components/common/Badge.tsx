import React from 'react';
import './common.css';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'income' | 'expense';
}

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral' }) => {
  return <span className={`badge badge-${tone}`}>{children}</span>;
};

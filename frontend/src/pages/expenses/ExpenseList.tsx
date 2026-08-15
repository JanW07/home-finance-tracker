import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExpenseResponseDTO } from '../../types/expense';
import { ExpenseListItem } from './ExpenseListItem';

interface ExpenseListProps {
  expenses: ExpenseResponseDTO[];
  onEdit: (expense: ExpenseResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (expenses.length === 0) {
    return <p>{t('expenses.empty')}</p>;
  }

  return (
    <div className="item-list">
      {expenses.map((expense) => (
        <ExpenseListItem key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
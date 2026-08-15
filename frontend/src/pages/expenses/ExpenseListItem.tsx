import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ExpenseResponseDTO } from '../../types/expense';
import { Button } from '../../components/common/Button';

interface ExpenseListItemProps {
  expense: ExpenseResponseDTO;
  onEdit: (expense: ExpenseResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = ({ expense, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="item-card">
      <span className="item-icon">{expense.category.icon || '💸'}</span>
      <div className="item-body">
        <span className="item-title">{expense.title}</span>
        <span className="item-subtitle">
          {expense.amount} {expense.currency} · {expense.category.name}
        </span>
      </div>
      <div className="item-actions">
        <Button
          variant="outline"
          size="sm"
          className="btn-icon"
          onClick={() => onEdit(expense)}
          title={t('common.edit')}
        >
          ✏️
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="btn-icon"
          onClick={() => onDelete(expense.id)}
          title={t('common.delete')}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};
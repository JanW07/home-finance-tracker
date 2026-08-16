import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionResponseDTO } from '../../types/transaction';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface TransactionListItemProps {
  transaction: TransactionResponseDTO;
  onEdit: (transaction: TransactionResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const isIncome = transaction.transactionType === 'INCOME';

  return (
    <div className="item-card">
      <span className="item-icon">{transaction.category?.icon || (isIncome ? '💰' : '💸')}</span>
      <div className="item-body">
        <div className="item-header-row">
          <span className="item-title" title={transaction.title}>{transaction.title}</span>
          {transaction.isSubscription && <Badge tone="accent">🔄 Subskrypcja</Badge>}
        </div>
        <span className={`item-subtitle mono-figure ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{transaction.amount} {transaction.currency} · {transaction.category?.name} · {transaction.transactionDate}
        </span>
      </div>
      <div className="item-actions">
        <Button
          variant="outline"
          size="sm"
          className="btn-icon"
          onClick={() => onEdit(transaction)}
          title={t('common.edit')}
        >
          ✏️
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="btn-icon"
          onClick={() => onDelete(transaction.id)}
          title={t('common.delete')}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};
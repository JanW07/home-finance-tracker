import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionResponseDTO } from '../../types/transaction';
import { TransactionListItem } from './TransactionListItem';

interface TransactionListProps {
  transactions: TransactionResponseDTO[];
  onEdit: (transaction: TransactionResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (transactions.length === 0) {
    return <p>{t('transactions.empty')}</p>;
  }

  return (
    <div className="item-list">
      {transactions.map((transaction) => (
        <TransactionListItem
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
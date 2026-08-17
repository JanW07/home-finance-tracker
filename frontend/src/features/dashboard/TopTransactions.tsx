import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TopTransactionResponseDTO } from '../../types/stats';
import type { TransactionType } from '../../types/transaction';
import './TopTransactions.css';

export interface TopTransactionsProps {
  data: TopTransactionResponseDTO[];
  type: TransactionType;
}

export const TopTransactions: React.FC<TopTransactionsProps> = ({ data, type }) => {
  const { t, i18n } = useTranslation();
  const isIncome = type === 'INCOME';

  return (
    <div className="form-card top-transactions">
      <h3 className="form-card-title">{t('dashboard.stats.topTransactions')}</h3>

      {data.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">🏆</span>
          <p className="empty-state-title">{t('dashboard.stats.noData')}</p>
        </div>
      ) : (
        <ul className="top-transactions-list">
          {data.map((tx) => (
            <li key={tx.id} className="item-card">
              <span
                className={`transaction-icon-bubble ${isIncome ? 'bubble-income' : 'bubble-expense'}`}
                aria-hidden="true"
              >
                {tx.icon}
              </span>
              <div className="item-body">
                <span className="item-title">{tx.title}</span>
                <span className="item-subtitle">
                  {tx.categoryName} · {new Date(tx.transactionDate).toLocaleDateString(i18n.language)}
                </span>
              </div>
              <span className={`top-transactions-amount ${isIncome ? 'text-income' : 'text-expense'}`}>
                {isIncome ? '+' : '-'}
                {tx.amount.toFixed(2)} PLN
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

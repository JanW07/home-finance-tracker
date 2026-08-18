import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TopTransactionResponseDTO } from '../../types/stats';
import type { TransactionType } from '../../types/transaction';
import { getDisplayIcon } from '../../utils/icon';
import './TopTransactions.css';

export interface TopTransactionsProps {
  data: TopTransactionResponseDTO[];
  type: TransactionType;
}

const VISIBLE_COUNT = 5;

export const TopTransactions: React.FC<TopTransactionsProps> = ({ data, type }) => {
  const { t, i18n } = useTranslation();
  const isIncome = type === 'INCOME';
  const [expanded, setExpanded] = useState(false);

  // Zmiana typu (Wydatek/Przychód) zawsze wraca do skróconego widoku,
  // żeby przełącznik nigdy nie "zaskakiwał" rozwiniętą listą po drugiej stronie.
  useEffect(() => {
    setExpanded(false);
  }, [type]);

  const hasMore = data.length > VISIBLE_COUNT;
  const visibleData = expanded ? data : data.slice(0, VISIBLE_COUNT);
  const hiddenCount = data.length - VISIBLE_COUNT;

  return (
    <div className="form-card top-transactions">
      <h3 className="form-card-title">{t('dashboard.stats.topTransactions')}</h3>

      <div className="top-transactions-body">
        {data.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🏆</span>
            <p className="empty-state-title">{t('dashboard.stats.noData')}</p>
          </div>
        ) : (
          <>
            <ul className="top-transactions-list">
              {visibleData.map((tx) => (
                <li key={tx.id} className="item-card">
                  <span
                    className={`transaction-icon-bubble ${isIncome ? 'bubble-income' : 'bubble-expense'}`}
                    aria-hidden="true"
                  >
                    {getDisplayIcon(tx.icon, isIncome ? '💰' : '💳')}
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

            {hasMore && (
              <button
                type="button"
                className="show-more-toggle"
                onClick={() => setExpanded((prev) => !prev)}
                aria-expanded={expanded}
              >
                {expanded
                  ? t('dashboard.stats.showLess', { defaultValue: 'Pokaż mniej' })
                  : t('dashboard.stats.showMore', {
                      defaultValue: `Pokaż więcej (${hiddenCount})`,
                      count: hiddenCount,
                    })}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
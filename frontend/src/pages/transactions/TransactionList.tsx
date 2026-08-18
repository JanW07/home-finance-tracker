import { useTranslation } from "react-i18next";
import type { TransactionResponseDTO } from "../../types/transaction";
import { TransactionListItem } from "./TransactionListItem";

interface TransactionListProps {
  transactions: TransactionResponseDTO[];
  onEdit: (transaction: TransactionResponseDTO) => void;
  onDelete: (id: number) => void;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const formatDayLabel = (dateStr: string, t: (key: string) => string, locale: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(date, today)) return t('transactions.today');
  if (sameDay(date, yesterday)) return t('transactions.yesterday');
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();

  if (transactions.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🧾</span>
        <p className="empty-state-title">{t('transactions.empty')}</p>
        <p className="empty-state-hint">{t('transactions.emptyHint')}</p>
      </div>
    );
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
  );

  const groups = new Map<string, TransactionResponseDTO[]>();
  sorted.forEach((tx) => {
    const key = tx.transactionDate.slice(0, 10);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(tx);
  });

  return (
    <div className="transaction-groups">
      {Array.from(groups.entries()).map(([dateKey, items]) => {
        const dayNet = items.reduce(
          (sum, tx) => sum + (tx.transactionType === 'INCOME' ? Number(tx.amount) : -Number(tx.amount)),
          0
        );
        return (
          <div className="transaction-day-group" key={dateKey}>
            <div className="transaction-day-header">
              <span className="transaction-day-label">{formatDayLabel(dateKey, t, i18n.language)}</span>
              <span className={`transaction-day-total ${dayNet >= 0 ? 'text-income' : 'text-expense'}`}>
                {dayNet >= 0 ? '+' : ''}{dayNet.toFixed(2)} PLN
              </span>
            </div>
            <div className="transaction-list">
              {items.map((transaction) => (
                <TransactionListItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
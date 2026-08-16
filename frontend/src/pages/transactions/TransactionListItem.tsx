import { useTranslation } from "react-i18next";
import type { TransactionResponseDTO } from "../../types/transaction";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

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
    <div className={`item-card transaction-card ${isIncome ? 'transaction-card-income' : 'transaction-card-expense'}`}>
      <span className={`transaction-icon-bubble ${isIncome ? 'bubble-income' : 'bubble-expense'}`}>
        {transaction.category?.icon || (isIncome ? '💰' : '💸')}
      </span>
      <div className="item-body">
        <div className="item-header-row">
          <span className="item-title" title={transaction.title}>{transaction.title}</span>
          {transaction.isSubscription && (
            <Badge tone="accent">🔄 {t('transactions.subscriptionBadge')}</Badge>
          )}
        </div>
        <span className="item-subtitle">{transaction.category?.name}</span>
      </div>
      <div className="transaction-amount-block">
        <span className={`transaction-amount mono-figure ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{transaction.amount} {transaction.currency}
        </span>
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
    </div>
  );
};
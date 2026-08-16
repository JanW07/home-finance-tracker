import { useTranslation } from "react-i18next";
import type { TransactionType } from "../../types/transaction";
import './TransactionTypeToggle.css';

export interface TransactionTypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  disabled?: boolean;
}

export const TransactionTypeToggle: React.FC<TransactionTypeToggleProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const { t } = useTranslation();
  const isExpense = value === 'EXPENSE';

  return (
    <div
      className={`type-segmented ${isExpense ? 'is-expense' : 'is-income'}`}
      role="radiogroup"
      aria-label={t('transactions.typeLabel', 'Typ transakcji')}
    >
      <span className="type-segmented-thumb" aria-hidden="true" />
      <button
        type="button"
        role="radio"
        aria-checked={isExpense}
        className={`type-segmented-option ${isExpense ? 'active' : ''}`}
        disabled={disabled}
        onClick={() => onChange('EXPENSE')}
      >
        {t('transactions.expense')}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={!isExpense}
        className={`type-segmented-option ${!isExpense ? 'active' : ''}`}
        disabled={disabled}
        onClick={() => onChange('INCOME')}
      >
        {t('transactions.income')}
      </button>
    </div>
  );
};
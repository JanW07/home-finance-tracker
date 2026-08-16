import { useEffect, useState } from "react";
import { Button } from "../../components/common/Button";
import { FormCard } from "../../components/common/FormCard";
import { Input } from "../../components/common/Input";
import type { CategoryResponseDTO } from "../../types/category";
import type { TransactionRequestDTO, TransactionResponseDTO, TransactionType } from "../../types/transaction";
import { useTranslation } from "react-i18next";
import { TransactionTypeToggle } from "../../components/common/TransactionTypeToggle";

export interface TransactionFormProps {
  editingTransaction: TransactionResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSubmit: (dto: TransactionRequestDTO) => Promise<void>;
  onCancel: () => void;
}
const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};
export const TransactionForm: React.FC<TransactionFormProps> = ({
  editingTransaction,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [transactionDate, setTransactionDate] = useState(today());
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.transactionType || 'EXPENSE');
      setTitle(editingTransaction.title || '');
      setAmount(String(editingTransaction.amount));
      setCurrency(editingTransaction.currency || 'PLN');
      setTransactionDate(editingTransaction.transactionDate?.slice(0, 10) || today());
      setCategoryId(editingTransaction.category?.id ? String(editingTransaction.category.id) : '');
    } else {
      setTransactionType('EXPENSE');
      setTitle('');
      setAmount('');
      setCurrency('PLN');
      setTransactionDate(today());
      setCategoryId('');
    }
  }, [editingTransaction]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        amount: Number(amount),
        currency,
        transactionDate,
        transactionType,
        categoryId: Number(categoryId),
      });
      if (!editingTransaction) {
        setTitle('');
        setAmount('');
        setCategoryId('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const isExpense = transactionType === 'EXPENSE';
  return (
    <FormCard
      title={editingTransaction ? t('transactions.edit') : t('transactions.add')}
      onSubmit={handleSubmit}
      bare
    >
      <div className={`amount-type-card ${isExpense ? 'is-expense' : 'is-income'}`}>
        <TransactionTypeToggle value={transactionType} onChange={setTransactionType} />
        <div className="amount-hero-body">
          <label htmlFor="amount" className="amount-hero-label">{t('transactions.amountLabel')}</label>
          <div className="amount-hero-row">
            <span className="amount-hero-sign">{isExpense ? '−' : '+'}</span>
            <input
              id="amount"
              className="amount-hero-input"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <input
              className="amount-hero-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              maxLength={3}
              required
            />
          </div>
        </div>
      </div>
      <Input
        label={t('transactions.titleLabel')}
        placeholder={t('transactions.titlePlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="form-field">
        <label className="form-label">{t('transactions.categoryLabel')}</label>
        <div className="category-chip-grid" role="radiogroup">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`category-chip ${String(c.id) === categoryId ? 'active' : ''}`}
              onClick={() => setCategoryId(String(c.id))}
            >
              <span className="category-chip-icon">{c.icon || '🏷️'}</span>
              <span className="category-chip-name">{c.name}</span>
            </button>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="field-hint">{t('transactions.noCategories')}</p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="transactionDate" className="form-label">{t('transactions.dateLabel')}</label>
        <div className="date-field-row">
          <input
            id="transactionDate"
            type="date"
            className="form-input"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
          <button
            type="button"
            className={`chip-btn ${transactionDate === today() ? 'active' : ''}`}
            onClick={() => setTransactionDate(today())}
          >
            {t('transactions.today')}
          </button>
          <button
            type="button"
            className={`chip-btn ${transactionDate === yesterday() ? 'active' : ''}`}
            onClick={() => setTransactionDate(yesterday())}
          >
            {t('transactions.yesterday')}
          </button>
        </div>
      </div>
      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {editingTransaction ? t('common.save') : t('common.add')}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
      </div>
    </FormCard>
  );
};
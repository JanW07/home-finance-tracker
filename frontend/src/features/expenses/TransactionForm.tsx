import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionResponseDTO, TransactionRequestDTO, TransactionType } from '../../types/transaction';
import type { CategoryResponseDTO } from '../../types/category';
import { FormCard } from '../../components/common/FormCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import './TransactionForm.css';

export interface TransactionFormProps {
  editingTransaction: TransactionResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSubmit: (dto: TransactionRequestDTO) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);

export const TransactionForm: React.FC<TransactionFormProps> = ({
  editingTransaction,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [transactionDate, setTransactionDate] = useState(today());
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setAmount(String(editingTransaction.amount));
      setCurrency(editingTransaction.currency);
      setTransactionDate(editingTransaction.transactionDate.slice(0, 10));
      setCategoryId(String(editingTransaction.category.id));
    } else {
      setType('EXPENSE');
      setDescription('');
      setAmount('');
      setCurrency('PLN');
      setTransactionDate(today());
      setCategoryId('');
    }
  }, [editingTransaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description.trim() || !amount || !categoryId) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        description,
        amount: Number(amount),
        currency,
        transactionDate,
        type,
        categoryId: Number(categoryId),
      });
      if (!editingTransaction) {
        setDescription('');
        setAmount('');
        setCategoryId('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title={editingTransaction ? t('transactions.edit') : t('transactions.add')}
      onSubmit={handleSubmit}
    >
      <div className="transaction-type-toggle" role="radiogroup" aria-label={t('transactions.typeLabel')}>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'EXPENSE'}
          className={`type-toggle-btn ${type === 'EXPENSE' ? 'active expense' : ''}`}
          onClick={() => setType('EXPENSE')}
        >
          {t('transactions.expense')}
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'INCOME'}
          className={`type-toggle-btn ${type === 'INCOME' ? 'active income' : ''}`}
          onClick={() => setType('INCOME')}
        >
          {t('transactions.income')}
        </button>
      </div>

      <Input
        label={t('transactions.descriptionLabel')}
        placeholder={t('transactions.descriptionPlaceholder')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Input
        label={t('transactions.amountLabel')}
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label={t('transactions.dateLabel')}
        type="date"
        value={transactionDate}
        onChange={(e) => setTransactionDate(e.target.value)}
        required
      />
      <Input
        label={t('transactions.currencyLabel')}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        maxLength={3}
        required
      />
      <Select
        label={t('transactions.categoryLabel')}
        placeholder={t('transactions.categoryPlaceholder')}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        required
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {editingTransaction ? t('common.save') : t('common.add')}
        </Button>
        {editingTransaction && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </FormCard>
  );
};

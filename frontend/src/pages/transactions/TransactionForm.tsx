import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormCard } from '../../components/common/FormCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import type { TransactionResponseDTO, TransactionRequestDTO, TransactionType, BillingPeriod } from '../../types/transaction';
import type { CategoryResponseDTO } from '../../types/category';

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
  
  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [transactionDate, setTransactionDate] = useState(today());
  const [categoryId, setCategoryId] = useState('');
  const [isSubscription, setIsSubscription] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('MONTHLY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setTransactionType(editingTransaction.transactionType || 'EXPENSE');
      setTitle(editingTransaction.title || '');
      setAmount(String(editingTransaction.amount));
      setCurrency(editingTransaction.currency || 'PLN');
      setTransactionDate(editingTransaction.transactionDate?.slice(0, 10) || today());
      setCategoryId(editingTransaction.category?.id ? String(editingTransaction.category.id) : '');
      setIsSubscription(!!editingTransaction.isSubscription);
      setBillingPeriod(editingTransaction.billingPeriod || 'MONTHLY');
    } else {
      setTransactionType('EXPENSE');
      setTitle('');
      setAmount('');
      setCurrency('PLN');
      setTransactionDate(today());
      setCategoryId('');
      setIsSubscription(false);
      setBillingPeriod('MONTHLY');
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
        isSubscription,
        billingPeriod: isSubscription ? billingPeriod : undefined,
      });
      
      if (!editingTransaction) {
        setTitle('');
        setAmount('');
        setCategoryId('');
        setIsSubscription(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title={editingTransaction ? t('transactions.edit') : t('transactions.add')}
      onSubmit={handleSubmit}
      bare
    >
      <div className="transaction-type-toggle" role="radiogroup">
        <button
          type="button"
          className={`type-toggle-btn ${transactionType === 'EXPENSE' ? 'active expense' : ''}`}
          onClick={() => setTransactionType('EXPENSE')}
        >
          {t('transactions.expense')}
        </button>
        <button
          type="button"
          className={`type-toggle-btn ${transactionType === 'INCOME' ? 'active income' : ''}`}
          onClick={() => setTransactionType('INCOME')}
        >
          {t('transactions.income')}
        </button>
      </div>

      <Input
        label={t('transactions.titleLabel')}
        placeholder={t('transactions.titlePlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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

      <div className="form-field-checkbox">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isSubscription}
            onChange={(e) => setIsSubscription(e.target.checked)}
          />
          {t('transactions.isSubscription')}
        </label>
      </div>

      {isSubscription && (
        <Select
          label={t('transactions.billingPeriod')}
          value={billingPeriod}
          onChange={(e) => setBillingPeriod(e.target.value as BillingPeriod)}
          options={[
            { value: 'WEEKLY', label: t('transactions.periods.WEEKLY') },
            { value: 'MONTHLY', label: t('transactions.periods.MONTHLY') },
            { value: 'YEARLY', label: t('transactions.periods.YEARLY') },
          ]}
        />
      )}

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
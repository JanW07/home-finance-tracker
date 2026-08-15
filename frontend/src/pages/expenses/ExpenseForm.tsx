import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ExpenseResponseDTO, ExpenseRequestDTO } from '../../types/expense';
import type { CategoryResponseDTO } from '../../types/category';
import { FormCard } from '../../components/common/FormCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

interface ExpenseFormProps {
  editingExpense: ExpenseResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSubmit: (dto: ExpenseRequestDTO) => Promise<void>;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  editingExpense,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(String(editingExpense.amount));
      setCurrency(editingExpense.currency);
      setCategoryId(String(editingExpense.category.id));
    } else {
      setTitle('');
      setAmount('');
      setCurrency('PLN');
      setCategoryId('');
    }
  }, [editingExpense]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ title, amount: Number(amount), currency, categoryId: Number(categoryId) });
      if (!editingExpense) {
        setTitle('');
        setAmount('');
        setCategoryId('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title={editingExpense ? t('expenses.edit') : t('expenses.add')}
      onSubmit={handleSubmit}
    >
      <Input
        label={t('expenses.titleLabel')}
        placeholder={t('expenses.titlePlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        label={t('expenses.amountLabel')}
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label={t('expenses.currencyLabel')}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        maxLength={3}
        required
      />
      <Select
        label={t('expenses.categoryLabel')}
        placeholder={t('expenses.categoryPlaceholder')}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        required
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {editingExpense ? t('common.save') : t('common.add')}
        </Button>
        {editingExpense && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </FormCard>
  );
};
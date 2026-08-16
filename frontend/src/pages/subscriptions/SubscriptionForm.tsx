import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionResponseDTO, SubscriptionRequestDTO } from '../../types/subscription';
import type { CategoryResponseDTO } from '../../types/category';
import { FormCard } from '../../components/common/FormCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

interface SubscriptionFormProps {
  editingSubscription: SubscriptionResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSubmit: (dto: SubscriptionRequestDTO) => Promise<void>;
  onCancel: () => void;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  editingSubscription,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [nextPaymentDate, setNextPaymentDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingSubscription) {
      setName(editingSubscription.name);
      setAmount(String(editingSubscription.amount));
      setCurrency(editingSubscription.currency);
      setNextPaymentDate(editingSubscription.nextPaymentDate);
      setCategoryId(String(editingSubscription.category.id));
    } else {
      setName('');
      setAmount('');
      setCurrency('PLN');
      setNextPaymentDate('');
      setCategoryId('');
    }
  }, [editingSubscription]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !amount || !nextPaymentDate || !categoryId) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name,
        amount: Number(amount),
        currency,
        nextPaymentDate,
        categoryId: Number(categoryId),
      });
      if (!editingSubscription) {
        setName('');
        setAmount('');
        setNextPaymentDate('');
        setCategoryId('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title={editingSubscription ? t('subscriptions.edit') : t('subscriptions.add')}
      onSubmit={handleSubmit}
      bare
    >
      <Input
        label={t('subscriptions.nameLabel')}
        placeholder={t('subscriptions.namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label={t('subscriptions.amountLabel')}
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        label={t('subscriptions.currencyLabel')}
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        maxLength={3}
        required
      />
      <Input
        label={t('subscriptions.nextPaymentDateLabel')}
        type="date"
        value={nextPaymentDate}
        onChange={(e) => setNextPaymentDate(e.target.value)}
        required
      />
      <Select
        label={t('subscriptions.categoryLabel')}
        placeholder={t('subscriptions.categoryPlaceholder')}
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        required
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {editingSubscription ? t('common.save') : t('common.add')}
        </Button>
        {editingSubscription && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </FormCard>
  );
};
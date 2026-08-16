import { useTranslation } from "react-i18next";
import type { CategoryResponseDTO } from "../../types/category";
import type { BillingPeriod, SubscriptionRequestDTO, SubscriptionResponseDTO } from "../../types/subscription";
import { useEffect, useState } from "react";
import type { TransactionType } from "../../types/transaction";
import { FormCard } from "../../components/common/FormCard";
import { TransactionTypeToggle } from "../../components/common/TransactionTypeToggle";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";

export interface SubscriptionFormProps {
  editingSubscription: SubscriptionResponseDTO | null;
  categories: CategoryResponseDTO[];
  onSubmit: (dto: SubscriptionRequestDTO) => Promise<void>;
  onCancel: () => void;
}
const today = () => new Date().toISOString().slice(0, 10);
export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  editingSubscription,
  categories,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [categoryId, setCategoryId] = useState('');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('MONTHLY');
  const [nextBillingPeriod, setNextBillingPeriod] = useState(today());
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (editingSubscription) {
      setTransactionType(editingSubscription.transactionType);
      setTitle(editingSubscription.title);
      setAmount(String(editingSubscription.amount));
      setCurrency(editingSubscription.currency);
      setCategoryId(String(editingSubscription.category.id));
      setBillingPeriod(editingSubscription.billingPeriod);
      setNextBillingPeriod(editingSubscription.nextBillingPeriod.slice(0, 10));
    } else {
      setTransactionType('EXPENSE');
      setTitle('');
      setAmount('');
      setCurrency('PLN');
      setCategoryId('');
      setBillingPeriod('MONTHLY');
      setNextBillingPeriod(today());
    }
  }, [editingSubscription]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !amount || !categoryId) return;
    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        amount: Number(amount),
        currency,
        categoryId: Number(categoryId),
        billingPeriod,
        nextBillingPeriod,
        status: editingSubscription?.status || 'ACTIVE',
        transactionType,
      });
      if (!editingSubscription) {
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
      title={editingSubscription ? t('subscriptions.edit') : t('subscriptions.add')}
      onSubmit={handleSubmit}
      bare
    >
      <TransactionTypeToggle value={transactionType} onChange={setTransactionType} />
      <div className={`amount-hero ${isExpense ? 'amount-hero-expense' : 'amount-hero-income'}`}>
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
      <Input
        label={t('transactions.titleLabel')}
        placeholder={t('subscriptions.titlePlaceholder')}
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
        {categories.length === 0 && <p className="field-hint">{t('transactions.noCategories')}</p>}
      </div>
      <div className="form-field">
        <label className="form-label">{t('transactions.billingPeriod')}</label>
        <div className="billing-period-toggle" role="radiogroup">
          {(['WEEKLY', 'MONTHLY', 'YEARLY'] as BillingPeriod[]).map((period) => (
            <button
              key={period}
              type="button"
              className={`period-chip ${billingPeriod === period ? 'active' : ''}`}
              onClick={() => setBillingPeriod(period)}
            >
              {t(`transactions.periods.${period}`)}
            </button>
          ))}
        </div>
      </div>
      <Input
        label={t('subscriptions.nextBillingLabel')}
        type="date"
        value={nextBillingPeriod}
        onChange={(e) => setNextBillingPeriod(e.target.value)}
        required
      />
      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {editingSubscription ? t('common.save') : t('common.add')}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
      </div>
    </FormCard>
  );
};
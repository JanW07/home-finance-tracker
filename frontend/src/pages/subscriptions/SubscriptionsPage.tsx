import { useEffect, useState } from 'react';
import { categoryService } from '../../api/categoryService';
import { Modal } from '../../components/common/Modal';
import { SummaryCard } from '../../features/dashboard/SummaryCard';
import type { BillingPeriod, SubscriptionRequestDTO, SubscriptionResponseDTO, SubscriptionStatus } from '../../types/subscription';
import { SubscriptionList } from './SubscriptionList';
import './subscriptions.css';
import { useTranslation } from 'react-i18next';
import type { CategoryResponseDTO } from '../../types/category';
import { Button } from '../../components/common/Button';
import { SubscriptionForm } from './SubscriptionForm';
import { subscriptionService } from '../../api/subscriptionService';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';

const monthlyEquivalent = (amount: number, period: BillingPeriod) => {
  switch (period) {
    case 'WEEKLY': return amount * 4.345;
    case 'YEARLY': return amount / 12;
    default: return amount;
  }
};
export const SubscriptionsPage: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const confirm = useConfirm();
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSubscription, setEditingSubscription] = useState<SubscriptionResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subscriptionsData, categoriesData] = await Promise.all([
        subscriptionService.getAll(),
        categoryService.getAll(),
      ]);
      setSubscriptions(subscriptionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openAddModal = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };
  const openEditModal = (subscription: SubscriptionResponseDTO) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };
  const handleFormSubmit = async (dto: SubscriptionRequestDTO) => {
    try {
      if (editingSubscription) {
        const updated = await subscriptionService.update(editingSubscription.id, dto);
        setSubscriptions((prev) => prev.map((item) => (item.id === editingSubscription.id ? updated : item)));
      } else {
        const created = await subscriptionService.create(dto);
        setSubscriptions((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      showError((err as Error).message);
    }
  };
  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      message: t('subscriptions.confirmDelete'),
      danger: true,
    });
    if (!confirmed) return;
    try {
      await subscriptionService.delete(id);
      setSubscriptions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      showError((err as Error).message);
    }
  };
  const handleStatusChange = async (id: number, status: SubscriptionStatus) => {
    try {
      const updated = await subscriptionService.changeStatus(id, status);
      setSubscriptions((prev) => prev.map((item) => (item.id === id ? updated : item)));
    } catch (err) {
      showError((err as Error).message);
    }
  };
  const activeSubs = subscriptions.filter((s) => s.status === 'ACTIVE');
  const monthlyTotal = activeSubs.reduce(
    (sum, s) => sum + (s.transactionType === 'INCOME' ? -1 : 1) * monthlyEquivalent(Number(s.amount), s.billingPeriod),
    0
  );
  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('subscriptions.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('subscriptions.add')}
        </Button>
      </header>
      {!loading && !error && subscriptions.length > 0 && (
        <div className="summary-strip">
          <SummaryCard label={t('subscriptions.summaryMonthly')} value={`${monthlyTotal.toFixed(2)} PLN`} tone="negative" icon="🔄" />
          <SummaryCard label={t('subscriptions.summaryActive')} value={String(activeSubs.length)} tone="neutral" icon="✅" />
        </div>
      )}
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPause={(id) => handleStatusChange(id, 'PAUSED')}
          onResume={(id) => handleStatusChange(id, 'ACTIVE')}
          onCancelSub={(id) => handleStatusChange(id, 'CANCELLED')}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSubscription ? t('subscriptions.edit') : t('subscriptions.add')}
        size="lg"
      >
        <SubscriptionForm
          editingSubscription={editingSubscription}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
export default SubscriptionsPage;
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { subscriptionService } from '../../api/subscriptionService';
import { categoryService } from '../../api/categoryService';
import type { SubscriptionResponseDTO, SubscriptionRequestDTO } from '../../types/subscription';
import type { CategoryResponseDTO } from '../../types/category';
import { SubscriptionForm } from './SubscriptionForm';
import { SubscriptionList } from './SubscriptionList';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const SubscriptionsPage: React.FC = () => {
  const { t } = useTranslation();
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
        setSubscriptions((prev) =>
          prev.map((item) => (item.id === editingSubscription.id ? updated : item))
        );
      } else {
        const created = await subscriptionService.create(dto);
        setSubscriptions((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('subscriptions.confirmDelete'))) return;

    try {
      await subscriptionService.delete(id);
      setSubscriptions((prev) => prev.filter((item) => item.id !== id));
      if (editingSubscription?.id === id) {
        closeModal();
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('subscriptions.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('subscriptions.add')}
        </Button>
      </header>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <SubscriptionList
          subscriptions={subscriptions}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSubscription ? t('subscriptions.edit') : t('subscriptions.add')}
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

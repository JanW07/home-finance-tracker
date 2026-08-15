import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionResponseDTO } from '../../types/subscription';
import { SubscriptionListItem } from './SubscriptionListItem';

interface SubscriptionListProps {
  subscriptions: SubscriptionResponseDTO[];
  onEdit: (subscription: SubscriptionResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  if (subscriptions.length === 0) {
    return <p>{t('subscriptions.empty')}</p>;
  }

  return (
    <div className="item-list">
      {subscriptions.map((subscription) => (
        <SubscriptionListItem
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
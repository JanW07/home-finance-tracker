import React from 'react';
import { useTranslation } from 'react-i18next';
import type { SubscriptionResponseDTO } from '../../types/subscription';
import { Button } from '../../components/common/Button';
import { getDisplayIcon } from '../../utils/icon';

interface SubscriptionListItemProps {
  subscription: SubscriptionResponseDTO;
  onEdit: (subscription: SubscriptionResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const SubscriptionListItem: React.FC<SubscriptionListItemProps> = ({
  subscription,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="item-card">
      <span className="item-icon">{getDisplayIcon(subscription.category.icon, '🔄')}</span>
      <div className="item-body">
        <span className="item-title" title={subscription.name}>{subscription.name}</span>
        <span className="item-subtitle mono-figure">
          {subscription.amount} {subscription.currency} · {subscription.nextPaymentDate}
        </span>
      </div>
      <div className="item-actions">
        <Button
          variant="outline"
          size="sm"
          className="btn-icon"
          onClick={() => onEdit(subscription)}
          title={t('common.edit')}
        >
          ✏️
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="btn-icon"
          onClick={() => onDelete(subscription.id)}
          title={t('common.delete')}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};
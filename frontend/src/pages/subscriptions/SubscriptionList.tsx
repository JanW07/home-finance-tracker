import { useTranslation } from "react-i18next";
import type { SubscriptionResponseDTO, SubscriptionStatus } from "../../types/subscription";
import { SubscriptionListItem } from "./SubscriptionListItem";

interface SubscriptionListProps {
  subscriptions: SubscriptionResponseDTO[];
  onEdit: (subscription: SubscriptionResponseDTO) => void;
  onDelete: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
  onCancelSub: (id: number) => void;
}
const STATUS_ORDER: Record<SubscriptionStatus, number> = { ACTIVE: 0, PAUSED: 1, CANCELLED: 2 };

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onCancelSub,
}) => {
  const { t } = useTranslation();

  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🔄</span>
        <p className="empty-state-title">{t('subscriptions.empty')}</p>
        <p className="empty-state-hint">{t('subscriptions.emptyHint')}</p>
      </div>
    );
  }

  const sorted = [...subscriptions].sort((a, b) => {
    if (a.status !== b.status) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    return new Date(a.nextBillingPeriod).getTime() - new Date(b.nextBillingPeriod).getTime();
  });

  return (
    <div className="subscription-list">
      {sorted.map((subscription) => (
        <SubscriptionListItem
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
          onPause={onPause}
          onResume={onResume}
          onCancelSub={onCancelSub}
        />
      ))}
    </div>
  );
};
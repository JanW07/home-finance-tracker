import { useTranslation } from "react-i18next";
import { Button } from "../../components/common/Button";
import type { SubscriptionResponseDTO } from "../../types/subscription";
import { Badge } from "../../components/common/Badge";
import { getDisplayIcon } from "../../utils/icon";

interface SubscriptionListItemProps {
  subscription: SubscriptionResponseDTO;
  onEdit: (subscription: SubscriptionResponseDTO) => void;
  onDelete: (id: number) => void;
  onPause: (id: number) => void;
  onResume: (id: number) => void;
  onCancelSub: (id: number) => void;
}

export const SubscriptionListItem: React.FC<SubscriptionListItemProps> = ({
  subscription,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onCancelSub,
}) => {
  const { t, i18n } = useTranslation();
  const isIncome = subscription.transactionType === 'INCOME';
  const isCancelled = subscription.status === 'CANCELLED';
  const isPaused = subscription.status === 'PAUSED';

  return (
    <div className={`item-card subscription-card ${isCancelled ? 'subscription-card-cancelled' : isIncome ? 'transaction-card-income' : 'transaction-card-expense'}`}>
      <span className={`transaction-icon-bubble ${isIncome ? 'bubble-income' : 'bubble-expense'}`}>
        {getDisplayIcon(subscription.category?.icon, '🔄')}
      </span>
      <div className="item-body">
        <div className="item-header-row">
          <span className="item-title" title={subscription.title}>{subscription.title}</span>
          {isPaused && <Badge tone="neutral">{t('subscriptions.statusPaused')}</Badge>}
          {isCancelled && <Badge tone="neutral">{t('subscriptions.statusCancelled')}</Badge>}
        </div>
        <span className="item-subtitle">
          {t(`transactions.periods.${subscription.billingPeriod}`)}
          {!isCancelled &&
            ` · ${t('subscriptions.nextBillingShort')}: ${new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(subscription.nextBillingPeriod))}`}
        </span>
      </div>
      <div className="transaction-amount-block">
        <span className={`transaction-amount mono-figure ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '-'}{subscription.amount} {subscription.currency}
        </span>
        <div className="item-actions">
          {subscription.status === 'ACTIVE' && (
            <Button variant="outline" size="sm" className="btn-icon" onClick={() => onPause(subscription.id)} title={t('subscriptions.pause')}>
              ⏸️
            </Button>
          )}
          {isPaused && (
            <Button variant="outline" size="sm" className="btn-icon" onClick={() => onResume(subscription.id)} title={t('subscriptions.resume')}>
              ▶️
            </Button>
          )}
          {!isCancelled && (
            <Button variant="outline" size="sm" className="btn-icon" onClick={() => onEdit(subscription)} title={t('common.edit')}>
              ✏️
            </Button>
          )}
          {!isCancelled && (
            <Button variant="danger" size="sm" className="btn-icon" onClick={() => onCancelSub(subscription.id)} title={t('subscriptions.cancel')}>
              ⛔
            </Button>
          )}
          {isCancelled && (
            <Button variant="danger" size="sm" className="btn-icon" onClick={() => onDelete(subscription.id)} title={t('common.delete')}>
              🗑️
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
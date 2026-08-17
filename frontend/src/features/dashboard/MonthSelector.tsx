import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import './MonthSelector.css';

export interface MonthSelectorProps {
  /** Wybrany miesiąc w formacie yyyy-MM */
  value: string;
  onChange: (value: string) => void;
  /** Blokuje przejście do miesięcy przyszłych względem dziś. Domyślnie true. */
  disableFuture?: boolean;
}

const toMonthKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const shiftMonth = (value: string, delta: number): string => {
  const [year, month] = value.split('-').map(Number);
  return toMonthKey(new Date(year, month - 1 + delta, 1));
};

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  disableFuture = true,
}) => {
  const { t, i18n } = useTranslation();
  const [year, month] = value.split('-').map(Number);

  const label = capitalize(
    new Date(year, month - 1, 1).toLocaleDateString(i18n.language, {
      month: 'long',
      year: 'numeric',
    })
  );

  const isNextDisabled = disableFuture && value >= toMonthKey(new Date());

  return (
    <div className="month-selector">
      <Button
        variant="outline"
        className="btn-icon"
        onClick={() => onChange(shiftMonth(value, -1))}
        aria-label={t('dashboard.stats.previousMonth')}
      >
        ←
      </Button>
      <span className="month-selector-label">{label}</span>
      <Button
        variant="outline"
        className="btn-icon"
        onClick={() => onChange(shiftMonth(value, 1))}
        disabled={isNextDisabled}
        aria-label={t('dashboard.stats.nextMonth')}
      >
        →
      </Button>
    </div>
  );
};

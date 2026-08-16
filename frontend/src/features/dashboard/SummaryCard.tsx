import React from 'react';
import './SummaryCard.css';

export interface SummaryCardProps {
  label: string;
  value: string;
  /** Procentowa zmiana względem poprzedniego okresu, np. 12.4 lub -3.2. Pomiń, jeśli brak punktu odniesienia. */
  trendPercent?: number;
  /** Etykieta okresu porównania, np. "vs. poprzedni miesiąc". */
  trendLabel?: string;
  icon?: React.ReactNode;
  /** Wariant koloru akcentu karty — pozwala odróżnić np. Przychody (positive) od Wydatków (negative). */
  tone?: 'neutral' | 'positive' | 'negative';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  trendPercent,
  trendLabel,
  icon,
  tone = 'neutral',
}) => {
  const hasTrend = typeof trendPercent === 'number';
  const isUp = hasTrend && trendPercent! > 0;
  const isDown = hasTrend && trendPercent! < 0;

  return (
    <div className={`summary-card summary-card-${tone}`}>
      <div className="summary-card-top">
        <span className="summary-card-label">{label}</span>
        {icon && <span className="summary-card-icon">{icon}</span>}
      </div>

      <span className="summary-card-value">{value}</span>

      {hasTrend && (
        <div
          className={`summary-card-trend ${
            isUp ? 'trend-up' : isDown ? 'trend-down' : 'trend-flat'
          }`}
        >
          <span className="summary-card-trend-arrow">{isUp ? '↑' : isDown ? '↓' : '→'}</span>
          <span>{Math.abs(trendPercent!).toFixed(1)}%</span>
          {trendLabel && <span className="summary-card-trend-label">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

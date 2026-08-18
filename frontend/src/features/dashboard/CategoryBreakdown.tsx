import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryStatResponseDTO } from '../../types/stats';
import type { TransactionType } from '../../types/transaction';
import { TransactionTypeToggle } from '../../components/common/TransactionTypeToggle';
import { Badge } from '../../components/common/Badge';
import { getDisplayIcon } from '../../utils/icon';
import './CategoryBreakdown.css';

export interface CategoryBreakdownProps {
  data: CategoryStatResponseDTO[];
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

type ViewMode = 'donut' | 'bars';

const CHART_COLORS = [
  '#f5a623',
  '#1fb579',
  '#e5484d',
  '#4f9eed',
  '#a78bfa',
  '#f472b6',
  '#facc15',
  '#38bdf8',
];

const VISIBLE_COUNT = 5;

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  type,
  onTypeChange,
}) => {
  const { t } = useTranslation();
  const badgeTone = type === 'INCOME' ? 'income' : 'expense';
  const [view, setView] = useState<ViewMode>('donut');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [type]);

  const hasMore = data.length > VISIBLE_COUNT;
  const visibleData = expanded ? data : data.slice(0, VISIBLE_COUNT);
  const hiddenCount = data.length - VISIBLE_COUNT;

  const showMoreToggle = hasMore && (
    <button
      type="button"
      className="show-more-toggle"
      onClick={() => setExpanded((prev) => !prev)}
      aria-expanded={expanded}
    >
      {expanded
        ? t('dashboard.stats.showLess', { defaultValue: 'Pokaż mniej' })
        : t('dashboard.stats.showMore', {
            defaultValue: `Pokaż więcej (${hiddenCount})`,
            count: hiddenCount,
          })}
    </button>
  );

  return (
    <div className="form-card category-breakdown">
      <div className="category-breakdown-header">
        <h3 className="form-card-title">{t('dashboard.stats.categoryBreakdown')}</h3>

        {data.length > 0 && (
          <div className="view-mode-toggle" role="group" aria-label={t('dashboard.stats.viewMode')}>
            <button
              type="button"
              className={view === 'donut' ? 'active' : ''}
              onClick={() => setView('donut')}
              aria-pressed={view === 'donut'}
            >
              {t('dashboard.stats.viewDonut')}
            </button>
            <button
              type="button"
              className={view === 'bars' ? 'active' : ''}
              onClick={() => setView('bars')}
              aria-pressed={view === 'bars'}
            >
              {t('dashboard.stats.viewBars')}
            </button>
          </div>
        )}
      </div>

      <TransactionTypeToggle value={type} onChange={onTypeChange} />

      <div className={`category-breakdown-body category-breakdown-body-${view}`}>
        {data.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📊</span>
            <p className="empty-state-title">{t('dashboard.stats.noData')}</p>
          </div>
        ) : view === 'donut' ? (
          <>
            <div className="category-breakdown-chart">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="categoryName"
                    innerRadius="60%"
                    outerRadius="88%"
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell key={entry.categoryId} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${Number(value).toFixed(2)} PLN`}
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="category-breakdown-list">
              {visibleData.map((stat, index) => (
                <li key={stat.categoryId} className="category-breakdown-row">
                  <span
                    className="category-breakdown-dot"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    aria-hidden="true"
                  />
                  <span className="item-icon">{getDisplayIcon(stat.icon, '🏷️')}</span>
                  <span className="category-breakdown-name">{stat.categoryName}</span>
                  <span className="category-breakdown-percentage">
                    {stat.percentage.toFixed(1)}%
                  </span>
                  <Badge tone={badgeTone}>{stat.total.toFixed(2)} PLN</Badge>
                </li>
              ))}
            </ul>

            {showMoreToggle}
          </>
        ) : (
          <>
            <ul className="category-breakdown-bars">
              {visibleData.map((stat, index) => (
                <li key={stat.categoryId} className="category-breakdown-bar-row">
                  <div className="category-breakdown-bar-top">
                    <span className="item-icon">{getDisplayIcon(stat.icon, '🏷️')}</span>
                    <span className="category-breakdown-name">{stat.categoryName}</span>
                    <span className="category-breakdown-percentage">
                      {stat.percentage.toFixed(1)}%
                    </span>
                    <Badge tone={badgeTone}>{stat.total.toFixed(2)} PLN</Badge>
                  </div>
                  <div className="category-breakdown-bar-track">
                    <div
                      className="category-breakdown-bar-fill"
                      style={{
                        width: `${Math.min(stat.percentage, 100)}%`,
                        backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {showMoreToggle}
          </>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryStatResponseDTO } from '../../types/stats';
import type { TransactionType } from '../../types/transaction';
import { TransactionTypeToggle } from '../../components/common/TransactionTypeToggle';
import { Badge } from '../../components/common/Badge';
import './CategoryBreakdown.css';

export interface CategoryBreakdownProps {
  data: CategoryStatResponseDTO[];
  type: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

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

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  data,
  type,
  onTypeChange,
}) => {
  const { t } = useTranslation();
  const badgeTone = type === 'INCOME' ? 'income' : 'expense';

  return (
    <div className="form-card category-breakdown">
      <h3 className="form-card-title">{t('dashboard.stats.categoryBreakdown')}</h3>

      <TransactionTypeToggle value={type} onChange={onTypeChange} />

      {data.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon">📊</span>
          <p className="empty-state-title">{t('dashboard.stats.noData')}</p>
        </div>
      ) : (
        <>
          <div className="category-breakdown-chart">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="total"
                  nameKey="categoryName"
                  innerRadius={55}
                  outerRadius={85}
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
            {data.map((stat, index) => (
              <li key={stat.categoryId} className="category-breakdown-row">
                <span
                  className="category-breakdown-dot"
                  style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  aria-hidden="true"
                />
                <span className="item-icon">{stat.icon}</span>
                <span className="category-breakdown-name">{stat.categoryName}</span>
                <span className="category-breakdown-percentage">
                  {stat.percentage.toFixed(1)}%
                </span>
                <Badge tone={badgeTone}>{stat.total.toFixed(2)} PLN</Badge>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

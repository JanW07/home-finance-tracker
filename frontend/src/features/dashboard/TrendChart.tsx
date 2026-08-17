import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthlyTrendResponseDTO } from '../../types/stats';
import './TrendChart.css';

export interface TrendChartProps {
  data: MonthlyTrendResponseDTO[];
}

const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const { t, i18n } = useTranslation();

  const chartData = data.map((entry) => {
    const [year, month] = entry.month.split('-').map(Number);
    const label = capitalize(
      new Date(year, month - 1, 1).toLocaleDateString(i18n.language, { month: 'short' })
    );
    return { label, income: entry.income, expense: entry.expense };
  });

  return (
    <div className="form-card trend-chart">
      <h3 className="form-card-title">{t('dashboard.stats.monthlyTrend')}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="label" stroke="var(--text-secondary)" fontSize={12} />
          <YAxis stroke="var(--text-secondary)" fontSize={12} />
          <Tooltip
            formatter={(value) => `${Number(value).toFixed(2)} PLN`}
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
            }}
          />
          <Legend />
          <Bar
            dataKey="income"
            name={t('transactions.income')}
            fill="var(--color-income)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name={t('transactions.expense')}
            fill="var(--color-expense)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

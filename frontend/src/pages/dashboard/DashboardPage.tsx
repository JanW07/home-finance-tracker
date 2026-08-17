import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { statsService } from '../../api/statsService';
import type {
  CategoryStatResponseDTO,
  MonthlyTrendResponseDTO,
  MonthSummaryResponseDTO,
  TopTransactionResponseDTO,
} from '../../types/stats';
import type { TransactionType } from '../../types/transaction';
import { SummaryCard } from '../../features/dashboard/SummaryCard';
import { MonthSelector } from '../../features/dashboard/MonthSelector';
import { CategoryBreakdown } from '../../features/dashboard/CategoryBreakdown';
import { TrendChart } from '../../features/dashboard/TrendChart';
import { TopTransactions } from '../../features/dashboard/TopTransactions';
import './DashboardPage.css';

const currentMonthKey = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  const [month, setMonth] = useState<string>(currentMonthKey());
  const [type, setType] = useState<TransactionType>('EXPENSE');

  const [summary, setSummary] = useState<MonthSummaryResponseDTO | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStatResponseDTO[]>([]);
  const [trend, setTrend] = useState<MonthlyTrendResponseDTO[]>([]);
  const [topTransactions, setTopTransactions] = useState<TopTransactionResponseDTO[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summaryData, categoryData, trendData, topTransactionsData] = await Promise.all([
        statsService.getSummary(month),
        statsService.getByCategory(month, type),
        statsService.getMonthlyTrend(6),
        statsService.getTopTransactions(month, type, 5),
      ]);
      setSummary(summaryData);
      setCategoryStats(categoryData);
      setTrend(trendData);
      setTopTransactions(topTransactionsData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, type]);

  return (
    <div className="dashboard-page">
      <header className="page-header page-header-row">
        <div>
          <h1>{t('dashboard.title')}</h1>
          <p className="home-subtitle">{t('dashboard.subtitle')}</p>
        </div>
        <MonthSelector value={month} onChange={setMonth} />
      </header>

      {loading && !summary ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className={`dashboard-content ${loading ? 'is-refreshing' : ''}`}>
          {summary && (
            <div className="summary-strip">
              <SummaryCard
                label={t('dashboard.stats.income')}
                value={`+${summary.totalIncome.toFixed(2)} PLN`}
                tone="positive"
                icon="💰"
              />
              <SummaryCard
                label={t('dashboard.stats.expense')}
                value={`-${summary.totalExpense.toFixed(2)} PLN`}
                tone="negative"
                icon="💸"
              />
              <SummaryCard
                label={t('dashboard.stats.balance')}
                value={`${summary.balance >= 0 ? '+' : ''}${summary.balance.toFixed(2)} PLN`}
                tone={summary.balance >= 0 ? 'positive' : 'negative'}
                icon="⚖️"
              />
              <SummaryCard
                label={t('dashboard.stats.subscriptionsShare')}
                value={`${summary.subscriptionsShare.toFixed(2)} PLN`}
                tone="neutral"
                icon="🔄"
              />
            </div>
          )}

          <TrendChart data={trend} />

          <div className="dashboard-grid">
            <CategoryBreakdown data={categoryStats} type={type} onTypeChange={setType} />
            <TopTransactions data={topTransactions} type={type} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

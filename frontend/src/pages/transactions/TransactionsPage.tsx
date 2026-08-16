import { useTranslation } from 'react-i18next';
import './transactions.css';
import type { TransactionRequestDTO, TransactionResponseDTO } from '../../types/transaction';
import type { CategoryResponseDTO } from '../../types/category';
import { useEffect, useState } from 'react';
import { transactionService } from '../../api/transactionService';
import { categoryService } from '../../api/categoryService';
import { Button } from '../../components/common/Button';
import { SummaryCard } from '../../features/dashboard/SummaryCard';
import { TransactionList } from './TransactionList';
import { Modal } from '../../components/common/Modal';
import { TransactionForm } from './TransactionForm';

export const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<TransactionResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [transactionsData, categoriesData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll(),
      ]);
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: TransactionResponseDTO) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (dto: TransactionRequestDTO) => {
    try {
      if (editingTransaction) {
        const updated = await transactionService.update(editingTransaction.id, dto);
        setTransactions((prev) =>
          prev.map((item) => (item.id === editingTransaction.id ? updated : item))
        );
      } else {
        const created = await transactionService.create(dto);
        setTransactions((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('transactions.confirmDelete'))) return;
    try {
      await transactionService.delete(id);
      setTransactions((prev) => prev.filter((item) => item.id !== id));
      if (editingTransaction?.id === id) {
        closeModal();
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const totals = transactions.reduce(
    (acc, tx) => {
      const value = Number(tx.amount);
      if (tx.transactionType === 'INCOME') acc.income += value;
      else acc.expense += value;
      return acc;
    },
    { income: 0, expense: 0 }
  );
  const balance = totals.income - totals.expense;

  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('transactions.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('transactions.add')}
        </Button>
      </header>

      {!loading && !error && transactions.length > 0 && (
        <div className="summary-strip">
          <SummaryCard
            label={t('transactions.summaryIncome')}
            value={`+${totals.income.toFixed(2)} PLN`}
            tone="positive"
            icon="💰"
          />
          <SummaryCard
            label={t('transactions.summaryExpense')}
            value={`-${totals.expense.toFixed(2)} PLN`}
            tone="negative"
            icon="💸"
          />
          <SummaryCard
            label={t('transactions.summaryBalance')}
            value={`${balance >= 0 ? '+' : ''}${balance.toFixed(2)} PLN`}
            tone={balance >= 0 ? 'positive' : 'negative'}
            icon="⚖️"
          />
        </div>
      )}

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <TransactionList
          transactions={transactions}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTransaction ? t('transactions.edit') : t('transactions.add')}
        size="lg"
      >
        <TransactionForm
          editingTransaction={editingTransaction}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
export default TransactionsPage;
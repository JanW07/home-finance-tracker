import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TransactionResponseDTO, TransactionRequestDTO } from '../../types/transaction';
import type { CategoryResponseDTO } from '../../types/category';
import { transactionService } from '../../api/transactionService';
import { categoryService } from '../../api/categoryService';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

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

  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('transactions.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('transactions.add')}
        </Button>
      </header>

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
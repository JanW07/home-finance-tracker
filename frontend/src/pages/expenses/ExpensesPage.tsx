import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { expenseService } from '../../api/expenseService';
import { categoryService } from '../../api/categoryService';
import type { ExpenseResponseDTO, ExpenseRequestDTO } from '../../types/expense';
import type { CategoryResponseDTO } from '../../types/category';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ExpensesPage: React.FC = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<ExpenseResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [expensesData, categoriesData] = await Promise.all([
        expenseService.getAll(),
        categoryService.getAll(),
      ]);
      setExpenses(expensesData);
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
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const openEditModal = (expense: ExpenseResponseDTO) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleFormSubmit = async (dto: ExpenseRequestDTO) => {
    try {
      if (editingExpense) {
        const updated = await expenseService.update(editingExpense.id, dto);
        setExpenses((prev) => prev.map((item) => (item.id === editingExpense.id ? updated : item)));
      } else {
        const created = await expenseService.create(dto);
        setExpenses((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('expenses.confirmDelete'))) return;

    try {
      await expenseService.delete(id);
      setExpenses((prev) => prev.filter((item) => item.id !== id));
      if (editingExpense?.id === id) {
        closeModal();
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('expenses.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('expenses.add')}
        </Button>
      </header>

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ExpenseList expenses={expenses} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? t('expenses.edit') : t('expenses.add')}
      >
        <ExpenseForm
          editingExpense={editingExpense}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ExpensesPage;

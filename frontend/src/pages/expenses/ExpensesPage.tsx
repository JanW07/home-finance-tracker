import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { expenseService } from '../../api/expenseService';
import { categoryService } from '../../api/categoryService';
import type { ExpenseResponseDTO, ExpenseRequestDTO } from '../../types/expense';
import type { CategoryResponseDTO } from '../../types/category';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';

export const ExpensesPage: React.FC = () => {
  const { t } = useTranslation();
  const [expenses, setExpenses] = useState<ExpenseResponseDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseResponseDTO | null>(null);

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

  const handleFormSubmit = async (dto: ExpenseRequestDTO) => {
    try {
      if (editingExpense) {
        const updated = await expenseService.update(editingExpense.id, dto);
        setExpenses((prev) => prev.map((item) => (item.id === editingExpense.id ? updated : item)));
        setEditingExpense(null);
      } else {
        const created = await expenseService.create(dto);
        setExpenses((prev) => [...prev, created]);
      }
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
        setEditingExpense(null);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="list-page">
      <header className="page-header">
        <h1>{t('expenses.title')}</h1>
      </header>

      <ExpenseForm
        editingExpense={editingExpense}
        categories={categories}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingExpense(null)}
      />

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ExpensesPage;
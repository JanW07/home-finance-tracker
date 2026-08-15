import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../api/categoryService';
import type { CategoryResponseDTO, CategoryRequestDTO } from '../../types/category';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDTO | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleFormSubmit = async (dto: CategoryRequestDTO) => {
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, dto);
        setCategories((prev) =>
          prev.map((item) => (item.id === editingCategory.id ? updated : item))
        );
        setEditingCategory(null);
      } else {
        const created = await categoryService.create(dto);
        setCategories((prev) => [...prev, created]);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('categories.confirmDelete'))) return;

    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      if (editingCategory?.id === id) {
        setEditingCategory(null);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="list-page">
      <header className="page-header">
        <h1>{t('categories.title')}</h1>
      </header>

      <CategoryForm
        editingCategory={editingCategory}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingCategory(null)}
      />

      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <CategoryList categories={categories} onEdit={setEditingCategory} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default CategoriesPage;
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../../api/categoryService';
import type { CategoryResponseDTO, CategoryRequestDTO } from '../../types/category';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { showError } = useToast();
  const confirm = useConfirm();
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };
  const openEditModal = (category: CategoryResponseDTO) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };
  const handleFormSubmit = async (dto: CategoryRequestDTO) => {
    try {
      if (editingCategory) {
        const updated = await categoryService.update(editingCategory.id, dto);
        setCategories((prev) =>
          prev.map((item) => (item.id === editingCategory.id ? updated : item))
        );
      } else {
        const created = await categoryService.create(dto);
        setCategories((prev) => [...prev, created]);
      }
      closeModal();
    } catch (err) {
      showError((err as Error).message);
    }
  };
  const handleDelete = async (id: number) => {
    const confirmed = await confirm({
      message: t('categories.confirmDelete'),
      danger: true,
    });
    if (!confirmed) return;
    try {
      await categoryService.delete(id);
      setCategories((prev) => prev.filter((item) => item.id !== id));
      if (editingCategory?.id === id) {
        closeModal();
      }
    } catch (err) {
      showError((err as Error).message);
    }
  };
  return (
    <div className="list-page">
      <header className="page-header page-header-row">
        <h1>{t('categories.title')}</h1>
        <Button variant="primary" onClick={openAddModal}>
          + {t('categories.add')}
        </Button>
      </header>
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <CategoryList categories={categories} onEdit={openEditModal} onDelete={handleDelete} />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? t('categories.edit') : t('categories.add')}
      >
        <CategoryForm
          editingCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
export default CategoriesPage;

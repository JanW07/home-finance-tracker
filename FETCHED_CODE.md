### `frontend\src\components\common\common.css`
```
/* Nagłówek strony (używany przez wszystkie widoki listowe) */
.page-header {
  margin-bottom: 0.5rem;
}

.page-header h1 {
  font-family: var(--font-heading);
}

.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 480px) {
  .page-header-row {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Pole formularza */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Input i Select */
.form-input,
.form-select {
  padding: 0.7rem 0.95rem;
  font-size: 0.95rem;
  font-family: var(--font-body);
  border: 1.5px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:hover,
.form-select:hover {
  border-color: var(--border-color-strong);
}

.form-input:focus,
.form-select:focus {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-focus);
  background-color: var(--bg-card);
}

.form-input.is-invalid,
.form-select.is-invalid {
  border-color: var(--color-expense);
}

.field-error {
  font-size: 0.78rem;
  color: var(--color-expense);
}

/* FormCard */
.form-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  box-shadow: var(--shadow-card);
}

.form-card-title {
  margin: 0 0 1.4rem 0;
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.form-card-content {
  display: flex;
  flex-direction: column;
}

/* Przyciski */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-sm { padding: 0.45rem 0.85rem; font-size: 0.85rem; border-radius: var(--radius-sm); }
.btn-md { padding: 0.7rem 1.35rem; font-size: 0.95rem; }
.btn-lg { padding: 0.85rem 1.65rem; font-size: 1.05rem; }

.btn-primary {
  background-color: var(--accent-color);
  color: var(--on-accent);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-card-hover);
}

.btn-danger {
  background-color: var(--color-expense-bg);
  color: var(--color-expense);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-expense);
  color: #ffffff;
}

.btn-outline {
  background-color: transparent;
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.btn-outline:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.btn-icon {
  padding: 0.5rem;
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: btn-spin 0.6s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

.form-actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

/* Layout list/page dla sekcji CRUD (kategorie, wydatki, subskrypcje) */
.list-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  width: 100%;
}

.error-message {
  color: var(--color-expense);
  font-size: 0.9rem;
}

.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.85rem;
}

.item-card {
  display: flex;
  align-items: center;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 0.9rem 1.1rem;
  gap: 0.85rem;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.item-card:hover {
  border-color: var(--border-color-strong);
  transform: translateY(-1px);
}

.item-icon {
  font-size: 1.2rem;
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  background-color: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
  line-height: 1;
}

.item-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.item-title {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
}

.item-actions {
  display: flex;
  gap: 0.4rem;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-pill);
  font-family: var(--font-body);
  line-height: 1;
}

.badge-neutral {
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.badge-accent {
  background-color: rgba(245, 166, 35, 0.16);
  color: var(--accent-color);
}

.badge-income {
  background-color: var(--color-income-bg);
  color: var(--color-income);
}

.badge-expense {
  background-color: var(--color-expense-bg);
  color: var(--color-expense);
}

```

### `frontend\src\pages\categories\CategoriesPage.tsx`
```
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

```

### `frontend\src\pages\categories\CategoryList.tsx`
```
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { CategoryResponseDTO } from '../../types/category';
import { CategoryListItem } from './CategoryListItem';

interface CategoryListProps {
  categories: CategoryResponseDTO[];
  onEdit: (category: CategoryResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return <p>{t('categories.empty')}</p>;
  }

  return (
    <div className="item-list">
      {categories.map((category) => (
        <CategoryListItem key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
```

### `frontend\src\pages\categories\CategoryListItem.tsx`
```
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { CategoryResponseDTO } from '../../types/category';
import { Button } from '../../components/common/Button';
import { getDisplayIcon } from '../../utils/icon';

interface CategoryListItemProps {
  category: CategoryResponseDTO;
  onEdit: (category: CategoryResponseDTO) => void;
  onDelete: (id: number) => void;
}

export const CategoryListItem: React.FC<CategoryListItemProps> = ({ category, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="item-card">
      <span className="item-icon">{getDisplayIcon(category.icon, '📁')}</span>
      <div className="item-body">
        <span className="item-title" title={category.name}>{category.name}</span>
      </div>
      <div className="item-actions">
        <Button
          variant="outline"
          size="sm"
          className="btn-icon"
          onClick={() => onEdit(category)}
          title={t('common.edit')}
        >
          ✏️
        </Button>
        <Button
          variant="danger"
          size="sm"
          className="btn-icon"
          onClick={() => onDelete(category.id)}
          title={t('common.delete')}
        >
          🗑️
        </Button>
      </div>
    </div>
  );
};

```
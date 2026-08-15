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
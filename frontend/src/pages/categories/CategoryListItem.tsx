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

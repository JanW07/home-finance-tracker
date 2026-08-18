import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { CategoryResponseDTO, CategoryRequestDTO } from '../../types/category';
import { FormCard } from '../../components/common/FormCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import './CategoryForm.css';

interface CategoryFormProps {
  editingCategory: CategoryResponseDTO | null;
  onSubmit: (dto: CategoryRequestDTO) => Promise<void>;
  onCancel: () => void;
}

const ICON_OPTIONS = [
  '🏠', '🚗', '🛒', '🍔', '❤️', '🎬', '✈️', '💰',
  '🎁', '📱', '👕', '📚', '☕', '🐾', '⚡', '💳',
  '🏥', '🎓', '🎮', '🧾',
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  editingCategory,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setIcon(editingCategory.icon || '');
    } else {
      setName('');
      setIcon('');
    }
  }, [editingCategory]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ name, icon });
      if (!editingCategory) {
        setName('');
        setIcon('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title={editingCategory ? t('categories.edit') : t('categories.add')}
      onSubmit={handleSubmit}
      bare
    >
      <Input
        label={t('categories.nameLabel')}
        placeholder={t('categories.namePlaceholder')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <div className="form-field">
        <span className="form-label">{t('categories.iconLabel')}</span>
        <div className="icon-picker" role="group" aria-label={t('categories.iconLabel')}>
          {ICON_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={`icon-picker-option ${icon === option ? 'active' : ''}`}
              onClick={() => setIcon(option)}
              aria-pressed={icon === option}
              title={option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={!icon}>
          {editingCategory ? t('common.save') : t('common.add')}
        </Button>
        {editingCategory && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </FormCard>
  );
};
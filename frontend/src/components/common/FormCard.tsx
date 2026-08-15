import React from 'react';
import './common.css';

interface FormCardProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  onSubmit,
  children,
  className = '',
}) => {
  return (
    <form className={`form-card ${className}`} onSubmit={onSubmit}>
      <h3 className="form-card-title">{title}</h3>
      <div className="form-card-content">{children}</div>
    </form>
  );
};
import React from 'react';
import './common.css';

interface FormCardProps {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  /** Gdy true, pomija własny tytuł i obramowanie karty — do użycia wewnątrz Modal, który już je zapewnia. */
  bare?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  onSubmit,
  children,
  className = '',
  bare = false,
}) => {
  return (
    <form className={bare ? className : `form-card ${className}`} onSubmit={onSubmit}>
      {!bare && <h3 className="form-card-title">{title}</h3>}
      <div className="form-card-content">{children}</div>
    </form>
  );
};

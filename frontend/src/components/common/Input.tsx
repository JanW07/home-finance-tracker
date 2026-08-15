import React from 'react';
import './common.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="form-field">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <input
        id={inputId}
        className={`form-input ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error && <span className="field-error">{error}</span>}
    </div>
  );
};
import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  size?: 'small' | 'medium' | 'large';
  magic?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      success,
      helper,
      size = 'medium',
      magic = false,
      options,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectClasses = cn(
      styles.selectWrapper,
      error && styles.error,
      success && styles.success,
      disabled && styles.disabled,
      size !== 'medium' && styles[size],
      magic && styles.magic,
      className
    );

    const message = error || success || helper;
    const messageClass = cn(
      styles.message,
      error && styles.errorMessage,
      success && styles.successMessage,
      helper && styles.helperMessage
    );

    return (
      <div className={selectClasses}>
        {label && <label className={styles.label}>{label}</label>}
        <select
          className={styles.select}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={styles.option}
            >
              {option.label}
            </option>
          ))}
        </select>
        {message && <span className={messageClass}>{message}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;

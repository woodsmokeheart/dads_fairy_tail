import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Input.module.css';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  helper?: string;
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magic?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      success,
      helper,
      size = 'medium',
      leftIcon,
      rightIcon,
      magic = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputClasses = cn(
      styles.inputWrapper,
      error && styles.error,
      success && styles.success,
      disabled && styles.disabled,
      size !== 'medium' && styles[size],
      (leftIcon || rightIcon) && styles.withIcon,
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
      <div className={inputClasses}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.inputWrapper}>
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          <input
            className={styles.input}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {rightIcon && <span className={cn(styles.icon, styles.iconRight)}>{rightIcon}</span>}
        </div>
        {message && <span className={messageClass}>{message}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

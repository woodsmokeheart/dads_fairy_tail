import React from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magic?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'medium',
      loading = false,
      leftIcon,
      rightIcon,
      magic = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      styles.button,
      styles[variant],
      size !== 'medium' && styles[size],
      loading && styles.loading,
      magic && styles.magic,
      className
    );

    return (
      <button
        className={buttonClasses}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className={styles.loading} />
        ) : (
          <>
            {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

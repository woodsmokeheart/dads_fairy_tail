'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closable?: boolean;
  magic?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  closable = true,
  magic = false,
  children,
  footer
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closable, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closable && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalClasses = cn(
    styles.modal,
    styles[size],
    magic && styles.magic
  );

  const content = (
    <div
      className={styles.overlay}
      data-closable={closable}
      onClick={handleOverlayClick}
    >
      <div className={modalClasses}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {closable && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className={styles.closeIcon} />
              </button>
            )}
          </div>
        )}
        
        <div className={title ? styles.content : styles.contentNoHeader}>
          {children}
        </div>
        
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default Modal;

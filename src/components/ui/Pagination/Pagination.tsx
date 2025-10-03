'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import styles from './Pagination.module.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  className
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`${styles.pagination} ${className || ''}`}>
      <Button
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={styles.navButton}
        title="Предыдущая страница"
      >
        <ChevronLeft className={styles.navIcon} />
      </Button>

      <div className={styles.pages}>
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={styles.dots}>...</span>
            ) : (
              <Button
                variant={page === currentPage ? "primary" : "secondary"}
                size="small"
                onClick={() => onPageChange(page as number)}
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.active : ''
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="secondary"
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={styles.navButton}
        title="Следующая страница"
      >
        <ChevronRight className={styles.navIcon} />
      </Button>
    </div>
  );
};

export default Pagination;

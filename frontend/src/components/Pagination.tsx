import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisibleButtons = 7;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.buttonsContainer}>
        <button
          className={styles.pageButton}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{ padding: '0 8px', color: '#6b7280' }}>...</span>
            ) : (
              <button
                className={`${styles.pageButton} ${page === currentPage ? styles.activePage : ''}`}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          className={styles.pageButton}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className={styles.pageInfo}>
        {currentPage} de {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
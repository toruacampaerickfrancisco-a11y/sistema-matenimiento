import { FC } from 'react';
import styles from './Table.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 7; // Máximo de páginas visibles

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con ellipsis
      if (currentPage <= 4) {
        // Inicio: 1 2 3 4 5 ... última
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Final: 1 ... última-4 última-3 última-2 última-1 última
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Medio: 1 ... actual-1 actual actual+1 ... última
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push(-2); // Ellipsis
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        <span>
          Mostrando {startItem} - {endItem} de {totalItems} registros
        </span>
        <div className={styles.itemsPerPage}>
          <label>Registros por página:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className={styles.pageSelect}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className={styles.paginationControls}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
          title="Primera página"
        >
          &#8249;&#8249;
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={styles.paginationButton}
          title="Página anterior"
        >
          &#8249;
        </button>

        {visiblePages.map((page, index) => {
          if (page === -1 || page === -2) {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${styles.paginationButton} ${
                page === currentPage ? styles.active : ''
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
          title="Página siguiente"
        >
          &#8250;
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
          title="Última página"
        >
          &#8250;&#8250;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
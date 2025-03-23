import { MatPaginatorIntl } from '@angular/material/paginator';

export function getEsPaginationIntl(): MatPaginatorIntl {
  const paginationIntl = new MatPaginatorIntl();

  paginationIntl.itemsPerPageLabel = 'Elementos por página:';
  paginationIntl.nextPageLabel = 'Página siguiente';
  paginationIntl.previousPageLabel = 'Página anterior';
  paginationIntl.firstPageLabel = 'Primera página';
  paginationIntl.lastPageLabel = 'Última página';
  paginationIntl.getRangeLabel = (
    page: number,
    pageSize: number,
    lenght: number
  ) => {
    if (lenght === 0 || pageSize === 0) return `0 de ${lenght}`;

    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, lenght);
    return `${startIndex + 1} - ${endIndex} de ${lenght}`;
  };

  return paginationIntl;
}

import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { setPage, setLimit } from '../../features/tasks/tasksSlice';

export default function Pagination() {
  const dispatch = useDispatch();
  const { pagination } = useSelector((state) => state.tasks);
  const { page, limit, totalItems, totalPages, hasNextPage, hasPreviousPage } = pagination;

  if (totalItems === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <div className="flex items-center gap-3 text-sm text-surface-500">
        <span>
          {startItem}–{endItem} of {totalItems}
        </span>
        <select
          value={limit}
          onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
          className="select !w-auto !py-1 text-xs"
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={!hasPreviousPage}
          className="btn-ghost btn-icon btn-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((p, i) => (
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-surface-400">...</span>
          ) : (
            <button
              key={p}
              onClick={() => dispatch(setPage(p))}
              className={`btn-sm min-w-[32px] rounded-lg ${
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'btn-ghost'
              }`}
            >
              {p}
            </button>
          )
        ))}

        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={!hasNextPage}
          className="btn-ghost btn-icon btn-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

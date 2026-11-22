import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Tooltip } from '@/components/common/Tooltip';
import { cn } from '@/utils/classNames';
import { pageButtons, shownRange } from '@/utils/paginationUtils';

/** "Showing 1-20 of 303" and page buttons, under a list. */
export function Pagination({ page, size, totalPages, totalElements, onPageChange, summary }) {
  return (
    <nav
      aria-label="Pages"
      className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4"
    >
      <p className="text-sm text-ink-soft">
        {summary ?? `Showing ${shownRange(page, size, totalElements)}`}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <PageButton
            label="Previous page"
            disabled={page === 0}
            tooltipIcon={ChevronLeft}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </PageButton>
          {pageButtons(page, totalPages).map((button, index) =>
            button === 'gap' ? (
              <span key={`gap-${index}`} className="px-2 text-ink-soft">
                ...
              </span>
            ) : (
              <PageButton
                key={button}
                label={`Page ${button + 1}`}
                current={button === page}
                onClick={() => onPageChange(button)}
              >
                {button + 1}
              </PageButton>
            ),
          )}
          <PageButton
            label="Next page"
            disabled={page >= totalPages - 1}
            tooltipIcon={ChevronRight}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </PageButton>
        </div>
      )}
    </nav>
  );
}

function PageButton({ label, onClick, disabled = false, current = false, children, tooltipIcon }) {
  const button = (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex size-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors',
        current ? 'bg-brand-500 text-on-brand' : 'text-ink hover:bg-brand-50',
        'disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      {children}
    </button>
  );
  return tooltipIcon ? (
    <Tooltip label={label} icon={tooltipIcon} placement="top">
      {button}
    </Tooltip>
  ) : (
    button
  );
}

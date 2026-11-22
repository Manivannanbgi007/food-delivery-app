import { AsyncContent } from '@/components/common/AsyncContent';
import { ClearFiltersButton } from '@/components/common/ClearFiltersButton';
import { EmptyState } from '@/components/common/EmptyState';
import { TableLoader } from '@/components/common/Loader';
import { Pagination } from '@/components/common/Pagination';

/**
 * The result part of every admin list: loading, error with "Try again", empty (with "Clear filters" when
 * filters are set), or the rows and the page buttons under them.
 */
export function PagedResults({
  query,
  errorTitle,
  emptyTitle,
  filteredEmptyTitle,
  hasFilters,
  onClearFilters,
  onPageChange,
  isDisabled = false,
  columns = 6,
  loading,
  summary,
  children,
}) {
  return (
    <AsyncContent
      isLoading={query.isPending && !isDisabled}
      error={query.error}
      isEmpty={query.data?.content.length === 0}
      errorTitle={errorTitle}
      onRetry={() => void query.refetch()}
      isRetrying={query.isFetching}
      loading={loading ?? <TableLoader columns={columns} />}
      empty={
        <EmptyState
          title={hasFilters ? filteredEmptyTitle : emptyTitle}
          action={hasFilters && <ClearFiltersButton size="sm" onClick={onClearFilters} />}
        />
      }
    >
      {query.data && (
        <div className="flex flex-col gap-4">
          {children(query.data.content, query.isPlaceholderData)}
          <Pagination
            page={query.data.page}
            size={query.data.size}
            totalPages={query.data.totalPages}
            totalElements={query.data.totalElements}
            onPageChange={onPageChange}
            summary={summary?.(query.data.content.length, query.data.totalElements)}
          />
        </div>
      )}
    </AsyncContent>
  );
}

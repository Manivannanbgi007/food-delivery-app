import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { SkeletonLoader } from '@/components/common/Loader';

/**
 * Shows exactly one of: loading, error, empty, or the content. Every API-driven part of a page uses it, so the
 * three states always look and behave the same:
 *
 *   <AsyncContent isLoading={query.isPending} error={query.error} isEmpty={!query.data?.length}
 *                 errorTitle={ERROR_MESSAGES.ORDER_LOAD_FAILED} onRetry={() => query.refetch()}>
 *     <OrderTable orders={query.data} />
 *   </AsyncContent>
 */
export function AsyncContent({
  isLoading,
  error,
  isEmpty = false,
  errorTitle,
  onRetry,
  isRetrying,
  loading,
  empty,
  children,
}) {
  if (isLoading) {
    return loading ?? <SkeletonLoader lines={4} />;
  }
  if (error) {
    return (
      <ErrorMessage title={errorTitle} error={error} onRetry={onRetry} isRetrying={isRetrying} />
    );
  }
  if (isEmpty) {
    return empty ?? <EmptyState title="Nothing to show yet" />;
  }
  return children;
}

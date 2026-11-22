import { AlertTriangle, RefreshCw } from 'lucide-react';

import { toApiError } from '@/api/apiErrorHandler';
import { Button } from '@/components/common/Button';

/** A failed request, explained in plain words, with a way to try again. */
export function ErrorMessage({ title, error, onRetry, isRetrying = false }) {
  const { userMessage, requestId } = toApiError(error);
  return (
    <div role="alert" className="flex flex-col items-center gap-3 px-6 py-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-danger-50 text-danger-500">
        <AlertTriangle aria-hidden="true" className="size-7" />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-ink-soft">{userMessage}</p>
      {requestId && <p className="text-xs text-ink-soft">Reference: {requestId}</p>}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RefreshCw aria-hidden="true" className="size-4" />}
        >
          Try again
        </Button>
      )}
    </div>
  );
}

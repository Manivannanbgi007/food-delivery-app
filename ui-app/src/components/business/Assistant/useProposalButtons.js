import { useRef, useState } from 'react';

import { useAssistant } from '@/context/AssistantContext';
import { useCancelAssistantAction, useConfirmAssistantAction } from '@/hooks/api/assistantHooks';
import { useNow } from '@/hooks/useNow';
import { resolutionAfterActionError } from '@/utils/assistantUtils';
import { ERROR_MESSAGES } from '@/utils/errorMessages';

/**
 * The Confirm and Cancel buttons of something the assistant prepared (an order or another change): one press at a
 * time, the countdown, and how it ended. The ending is kept by the provider, so closing the panel or moving to another
 * page never brings the buttons back.
 */
export function useProposalButtons(action, subject) {
  const { resolutions, resolveAction } = useAssistant();
  const confirm = useConfirmAssistantAction();
  const cancel = useCancelAssistantAction();
  const now = useNow(1000);
  const working = useRef(false);
  const [problem, setProblem] = useState(null);
  const [pending, setPending] = useState(null);

  const { actionId } = action;
  const resolution = resolutions[actionId];
  const remainingMs = Date.parse(action.expiresAt) - now;
  const expired = resolution?.status === 'expired' || (!resolution && remainingMs <= 0);

  const run = async (kind) => {
    if (working.current) {
      return; // a second click while the first is still on its way
    }
    working.current = true;
    setPending(kind);
    setProblem(null);
    try {
      if (kind === 'confirm') {
        const result = await confirm.mutateAsync(actionId);
        resolveAction(actionId, {
          status: 'confirmed',
          message:
            result.message || (subject === 'order' ? 'Your order has been placed.' : 'Done.'),
          link: result.link,
        });
      } else {
        await cancel.mutateAsync(actionId);
        resolveAction(actionId, { status: 'cancelled' });
      }
    } catch (error) {
      const ended = resolutionAfterActionError(error, kind, subject);
      if (ended) {
        resolveAction(actionId, ended);
      } else {
        setProblem(
          subject === 'order'
            ? ERROR_MESSAGES.ASSISTANT_ORDER_RETRY
            : ERROR_MESSAGES.ASSISTANT_CHANGE_RETRY,
        );
      }
    } finally {
      working.current = false;
      setPending(null);
    }
  };

  return { resolution, remainingMs, expired, pending, problem, run };
}

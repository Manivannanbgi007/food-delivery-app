import { useEffect, useRef } from 'react';

import { AssistantLauncher } from '@/components/business/Assistant/AssistantLauncher';
import { AssistantPanel } from '@/components/business/Assistant/AssistantPanel';
import { AssistantProvider } from '@/components/business/Assistant/AssistantProvider';
import { useActingUser } from '@/hooks/useActingUser';
import { saveConversationId } from '@/utils/assistantUtils';

/**
 * The assistant as the layouts mount it (once each): the floating button and its panel, for whoever the page acts
 * as (the admin area's user, the signed-in owner or delivery partner in their area, or the signed-in customer;
 * nobody signed in = nothing is shown). When that user signs out or changes, the old conversation id is forgotten
 * and the next user starts clean.
 */
export function AssistantWidget({ raised = false }) {
  const user = useActingUser();
  const previousUserId = useRef(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    const previous = previousUserId.current;
    if (previous !== null && previous !== userId) {
      saveConversationId(previous, null);
    }
    previousUserId.current = userId;
  }, [userId]);

  if (!user) {
    return null;
  }
  return (
    <AssistantProvider key={`${user.id}-${user.role}`} user={user}>
      <AssistantLauncher raised={raised} />
      <AssistantPanel />
    </AssistantProvider>
  );
}

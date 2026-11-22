/** Types of the AI assistant API (ai-mcp-client behind the gateway: /api/v1/assistant/**). */

/** The longest question the assistant accepts. */
export const ASSISTANT_MESSAGE_MAX_LENGTH = 1000;

export const ENTITY_TYPES = ['RESTAURANT', 'FOOD', 'OFFER', 'ORDER', 'DELIVERY'];

export function isOrderProposal(action) {
  return action.kind === 'PLACE_ORDER' && 'summary' in action;
}

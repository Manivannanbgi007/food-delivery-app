import { createContext, useContext } from 'react';

export const OrderActionsContext = createContext(null);

/** The dialogs of the order list's menus: `const { openHistory, openCancel } = useOrderActionDialogs();` */
export function useOrderActionDialogs() {
  const dialogs = useContext(OrderActionsContext);
  if (!dialogs) {
    throw new Error('Order menus need an <OrderActionsProvider> around them');
  }
  return dialogs;
}

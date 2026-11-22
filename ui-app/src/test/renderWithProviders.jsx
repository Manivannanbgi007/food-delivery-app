import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';

import { ToastProvider } from '@/context/ToastProvider';
import { makeStore } from '@/store/store';

/**
 * Renders a component the way the application does (Redux, React Query, toasts, router), with a fresh store and
 * cache for every test, and no automatic retries (a failure shows at once).
 */
export function renderWithProviders(ui, { route = '/', store = makeStore(), ...options } = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const result = render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
          </ToastProvider>
        </QueryClientProvider>
      </Provider>
    ),
    ...options,
  });
  return { ...result, store, queryClient };
}

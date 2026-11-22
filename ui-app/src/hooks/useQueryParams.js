import { useSearchParams } from 'react-router';

/**
 * Filters kept in the address (?city=Pune&page=2) instead of Redux: a customer can share or bookmark a list, and
 * the back button returns to the previous filters. Changing any filter goes back to the first page.
 *
 *   const [params, setParams] = useQueryParams(['search', 'city', 'page']);
 *   setParams({ city: 'Pune' });   // ?city=Pune (page removed)
 */
export function useQueryParams(keys) {
  const [searchParams, setSearchParams] = useSearchParams();
  const values = {};
  for (const key of keys) {
    const value = searchParams.get(key)?.trim();
    if (value) {
      values[key] = value;
    }
  }

  const update = (changes) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!('page' in changes)) {
          next.delete('page');
        }
        for (const [key, value] of Object.entries(changes)) {
          if (value?.trim()) {
            next.set(key, value.trim());
          } else {
            next.delete(key);
          }
        }
        return next;
      },
      { replace: true },
    );
  };
  return [values, update];
}

/** '2' -> 1 (pages count from 0 in the APIs, from 1 in the address); anything else -> 0. */
export function pageFromParam(value) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page - 1 : 0;
}

/** 0 -> undefined (no ?page= on the first page), 1 -> '2'. */
export function pageToParam(page) {
  return page > 0 ? String(page + 1) : undefined;
}

import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/common/Input';
import { useDebounce } from '@/hooks/useDebounce';

/** A search or filter box that asks the server only when the user pauses typing. */
export function SearchInput({ value, onSearch, validate, delayMs = 400, ...props }) {
  const [text, setText] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  // The search was changed elsewhere (filters cleared): show it in the box (React's "adjust state on change")
  if (value !== previousValue) {
    setPreviousValue(value);
    setText(value);
  }

  const debouncedText = useDebounce(text, delayMs);
  const error = validate?.(text);

  useEffect(() => {
    // Only once typing has stopped, the text is valid, and it differs from the search in use
    if (debouncedText === text && !validate?.(debouncedText) && debouncedText.trim() !== value) {
      onSearch(debouncedText.trim());
    }
  }, [debouncedText, text, value, validate, onSearch]);

  return (
    <Input
      type="search"
      value={text}
      onChange={(event) => setText(event.target.value)}
      error={error}
      leftIcon={<Search aria-hidden="true" className="size-4" />}
      {...props}
    />
  );
}

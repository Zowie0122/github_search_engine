// src/hooks/useDebounce.ts
import { useEffect, useState } from "react";
import { DEBOUNCED_TIME_IN_MS_DEFAULT } from "../../constants";

export function useDebounce<T>(
  value: T,
  delay = DEBOUNCED_TIME_IN_MS_DEFAULT
): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

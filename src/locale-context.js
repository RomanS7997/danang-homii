import { createContext } from 'react';

// Keep context identity stable when Vite refreshes translated content/routes.
// Otherwise an updated consumer can temporarily read a different context from
// the mounted provider while editing the multilingual editorial data.
export const LocaleContext = createContext(null);

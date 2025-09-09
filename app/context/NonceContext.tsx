// app/context/NonceContext.tsx
import { createContext } from 'react';

// Create a new context.
// The default value can be an empty string, as it will be overwritten in the provider.
export const NonceContext = createContext<string>('');
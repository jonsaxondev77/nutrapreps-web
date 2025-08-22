import * as icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { ComponentType } from 'react';

// Define a more specific type for our icon map.
type IconMapType = { [key: string]: ComponentType<LucideProps> };

/**
 * A map of all available Lucide icons.
 * We dynamically build this map from the 'lucide-react' library exports.
 */
export const ReactIconMap = Object.keys(icons)
  // Filter out non-icon exports that lucide-react includes.
  .filter(key => !['createLucideIcon', 'LucideProvider', 'IconNode', 'default'].includes(key))
  // Use reduce to build the final map object.
  .reduce((acc: IconMapType, key) => {
    acc[key] = (icons as any)[key];
    return acc;
  }, {});

/**
 * An array of options suitable for a select/dropdown input,
 * derived from the keys of the ReactIconMap.
 */
export const ReactIconOptions = Object.keys(ReactIconMap).map((iconName) => ({
  value: iconName,
  label: iconName,
}));
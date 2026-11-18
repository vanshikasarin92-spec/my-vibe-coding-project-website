import { useStoredString } from '../../../shared/hooks/useStored.js';
import { KEYS } from '../../../shared/lib/storage.js';

// The last platform tab viewed.
export const usePlatformTab = (isValid) => useStoredString(KEYS.tab, isValid, 'web');

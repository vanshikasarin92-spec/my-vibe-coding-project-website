import { useStoredString } from '../../../shared/hooks/useStored.js';
import { KEYS } from '../../../shared/lib/storage.js';

// The library's role filter. Your role sets it too, so the library opens on your role.
export const useLibraryRole = (isValid) => useStoredString(KEYS.libraryRole, isValid, 'all');

import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { readPersistedLanguage, resolveLanguage, type Language } from '@/lib/multilingualReading';

export type { Language } from '@/lib/multilingualReading';

type PersistedLanguageState = Pick<LanguageState, 'language'>;

export interface LanguageState {
  language: Language;
  requestedLanguage: Language | null;
  setLanguage: (language: Language) => void;
  requestLanguage: (language: Language) => void;
  clearRequestedLanguage: () => void;
}

const languageStorage: PersistStorage<PersistedLanguageState> = {
  getItem: (name) => {
    if (typeof localStorage === 'undefined') return null;

    try {
      const language = readPersistedLanguage(localStorage.getItem(name));
      return language ? { state: { language } } : null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value));
    } catch {
      // The current in-memory language remains usable when storage is blocked.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Nothing else is required when storage is blocked.
    }
  },
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      requestedLanguage: null,
      setLanguage: (language) => set({ language, requestedLanguage: null }),
      requestLanguage: (language) => set((state) => ({
        requestedLanguage: language === state.language ? null : language,
      })),
      clearRequestedLanguage: () => set({ requestedLanguage: null }),
    }),
    {
      name: 'language-storage',
      storage: languageStorage,
      partialize: ({ language }) => ({ language }),
      merge: (persisted, current) => ({
        ...current,
        language: resolveLanguage(
          (persisted as Partial<PersistedLanguageState> | undefined)?.language,
          typeof navigator === 'undefined' ? undefined : navigator.languages?.[0] || navigator.language,
        ),
        requestedLanguage: null,
      }),
      skipHydration: true,
    },
  ),
);

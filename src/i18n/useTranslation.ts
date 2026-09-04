import { useLanguageStore } from '@/store/languageStore';
import { getTranslations } from '@/content/translations';
import type { Language } from '@/store/languageStore';

export const useTranslation = (forcedLanguage?: Language) => {
  const storedLanguage = useLanguageStore((state) => state.language);
  const language = forcedLanguage ?? storedLanguage;
  const translations = getTranslations(language);

  const t = (key: string): string => {
    if (!translations) return key;

    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

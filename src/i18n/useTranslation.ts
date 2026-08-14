import { useLanguageStore } from '@/store/languageStore';
import { getTranslations } from '@/content/translations';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);
  const translations = getTranslations(language as 'en' | 'ko' | 'ja');

  const t = (key: string): string => {
    if (!translations) return key;

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
};

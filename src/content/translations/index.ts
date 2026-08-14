import { commonTranslations } from './common';
import { homeTranslations } from './home';
import { blogTranslations } from './blog';
import { authTranslations } from './auth';
import { aboutTranslations } from './about';

type Language = 'en' | 'ko' | 'ja';

export interface TranslationMeta {
  common: (typeof commonTranslations)[Language];
  home: (typeof homeTranslations)[Language];
  blog: (typeof blogTranslations)[Language];
  auth: (typeof authTranslations)[Language];
  about: (typeof aboutTranslations)[Language];
}

interface TranslationContent {
  en?: TranslationMeta;
  ko?: TranslationMeta;
  ja?: TranslationMeta;
}

// 모든 번역을 통합한 registry
const translationsRegistry: TranslationContent = {
  en: {
    common: commonTranslations.en,
    home: homeTranslations.en,
    blog: blogTranslations.en,
    auth: authTranslations.en,
    about: aboutTranslations.en,
  },
  ko: {
    common: commonTranslations.ko,
    home: homeTranslations.ko,
    blog: blogTranslations.ko,
    auth: authTranslations.ko,
    about: aboutTranslations.ko,
  },
  ja: {
    common: commonTranslations.ja,
    home: homeTranslations.ja,
    blog: blogTranslations.ja,
    auth: authTranslations.ja,
    about: aboutTranslations.ja,
  },
};

export function getTranslations(language: Language): TranslationMeta | null {
  return translationsRegistry[language] || null;
}

export type { Language };

import { commonTranslations } from './common';
import { homeTranslations } from './home';
import { blogTranslations } from './blog';
import { aboutTranslations } from './about';
import { profileTranslations } from './profile';

type Language = 'en' | 'ko' | 'ja';

export interface TranslationMeta {
  common: (typeof commonTranslations)[Language];
  home: (typeof homeTranslations)[Language];
  blog: (typeof blogTranslations)[Language];
  about: (typeof aboutTranslations)[Language];
  profile: (typeof profileTranslations)[Language];
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
    about: aboutTranslations.en,
    profile: profileTranslations.en,
  },
  ko: {
    common: commonTranslations.ko,
    home: homeTranslations.ko,
    blog: blogTranslations.ko,
    about: aboutTranslations.ko,
    profile: profileTranslations.ko,
  },
  ja: {
    common: commonTranslations.ja,
    home: homeTranslations.ja,
    blog: blogTranslations.ja,
    about: aboutTranslations.ja,
    profile: profileTranslations.ja,
  },
};

export function getTranslations(language: Language): TranslationMeta | null {
  return translationsRegistry[language] || null;
}

export type { Language };

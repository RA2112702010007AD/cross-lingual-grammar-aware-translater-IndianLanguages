import { Language } from './types';

export const LANGUAGES: Language[] = [
  Language.ENGLISH,
  Language.HINDI,
  Language.SANSKRIT,
  Language.TAMIL,
  Language.BENGALI,
  Language.MALAYALAM,
];

export const LANGUAGE_CODES: { [key in Language]: string } = {
    [Language.ENGLISH]: 'en-US',
    [Language.HINDI]: 'hi-IN',
    [Language.SANSKRIT]: 'sa-IN',
    [Language.TAMIL]: 'ta-IN',
    [Language.BENGALI]: 'bn-IN',
    [Language.MALAYALAM]: 'ml-IN',
};
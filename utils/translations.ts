import { createTranslator } from 'next-intl';

export function getTranslations(locale: string, namespace: string = 'common') {
  try {
    // Import locale files dynamically
    const messages = require(`../locales/${locale}.json`);
    
    // Create a translator with the messages
    return createTranslator({ locale, messages, namespace });
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Return an empty translator if translations fail to load
    return (key: string) => key;
  }
}

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector) // auto-detect language
    .use(initReactI18next)  // bind i18n to React
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // react already escapes
        },
        resources: {
            en: {
                translation: {
                    home: 'Home',
                    settings: 'Settings',
                    language: 'Language',
                },
            },
            sk: {
                translation: {
                    home: 'Domov',
                    settings: 'Nastavenia',
                    language: 'Jazyk',
                },
            },
        },
    });

export default i18n;
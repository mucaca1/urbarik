import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const savedLang = localStorage.getItem('i18nextLng') || 'sk';

i18n
    .use(LanguageDetector) // auto-detect language
    .use(initReactI18next)  // bind i18n to React
    .init({
        lng: savedLang,
        fallbackLng: 'sk',
        interpolation: {
            escapeValue: false, // react already escapes
        },
        resources: {
            en: {
                translation: {
                    home: 'Home',
                    settings: 'Settings',
                    language: 'Language',

                    systemSectionLabel: 'System',
                    unitSelectionLabel: 'Select Unit',
                    theme: 'Theme',
                    private: 'Private',
                    deleteAllData: 'Delete all data',
                    cancelBtn: 'Cancel',
                    import: 'Import',
                    importMnemonicDialog: 'Write your mnemonic key',
                    deleteMnemonicQuestion: 'Are you sure you wand delete owner data?',
                    saveBtn: 'Save',
                    themeLight: 'Light',
                    themeDark: 'Dark',
                    preview: 'Preview',
                },
            },
            sk: {
                translation: {
                    home: 'Domov',
                    settings: 'Nastavenia',
                    language: 'Jazyk',

                    systemSectionLabel: 'Systém',
                    unitSelectionLabel: 'Výber jednotky',
                    theme: 'Téma',
                    private: 'Súkromie',
                    deleteAllData: 'Odstrániť všetky dáta',
                    cancelBtn: 'Zrušiť',
                    import: 'Import',
                    importMnemonicDialog: 'Napíš svoj mnemonic kľúč',
                    deleteMnemonicQuestion: 'Si si naozaj istný, že chceš odstrániť všetky dáta používateľa?',
                    saveBtn: 'Uložiť',
                    themeLight: 'Svetlá',
                    themeDark: 'Tmavá',
                    preview: 'Náhľad',
                },
            },
        },
    });

export default i18n;
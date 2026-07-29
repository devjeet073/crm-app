import { usePage } from '@inertiajs/react';

export type SharedPageProps = {
    locale: string;
    locales: Record<string, string>;
    translations: Record<string, string>;
    [key: string]: unknown;
};

export function useTranslation() {
    const page = usePage<SharedPageProps>();
    const locale = page.props.locale || 'en';
    const locales = page.props.locales || { en: 'English' };
    const translations = page.props.translations || {};

    /**
     * Translate key with optional parameter replacements (e.g. :name or {name}).
     */
    const t = (key: string, replacements?: Record<string, string | number>): string => {
        let translation = translations[key] ?? key;

        if (replacements) {
            Object.entries(replacements).forEach(([param, value]) => {
                translation = translation.replace(new RegExp(`:${param}|\\{${param}\\}`, 'g'), String(value));
            });
        }

        return translation;
    };

    return { t, locale, locales };
}

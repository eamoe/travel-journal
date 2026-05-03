import { Language } from "./types.ts";

export const UI_STRINGS: Record<Language, {
    journalTitle: string;
    tagline: string;
    footerTitle: string;
    footerText: string;
    readMore: string;
    showLess: string;
}> = {
    en: {
        journalTitle: "The Italian Journal 2026",
        tagline: "Tracing history through the lens of modern travel",
        footerTitle: "The Italian Journal · 2026",
        footerText: "Until the next journey",
        readMore: "Read more",
        showLess: "Show less",
    },
    local: { // Wildcard: Update to match your language
        journalTitle: "The Italian Journal 2026",
        tagline: "Прослеживая историю через призму современных путешествий",
        footerTitle: "Итальянский дневник · 2026",
        footerText: "До следующего путешествия",
        readMore: "Читать далее",
        showLess: "Свернуть",
    }
} as const;

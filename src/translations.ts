import { Language } from "./types.ts";

export const UI_STRINGS: Record<Language, {
    journalTitle: string;
    tagline: string;
    footerTitle: string;
    footerText: string;
    readMore: string;
    showLess: string;
    closeImage: string;
    previousImage: string;
    nextImage: string;
    downloadImage: string;
    goToImage: string;
}> = {
    en: {
        journalTitle: "The Italian Journal 2026",
        tagline: "Tracing history through the lens of modern travel",
        footerTitle: "The Italian Journal · 2026",
        footerText: "Until the next journey",
        readMore: "Read more",
        showLess: "Show less",
        closeImage: "Close image",
        previousImage: "Previous image",
        nextImage: "Next image",
        downloadImage: "Download image",
        goToImage: "Go to image {n}",
    },
    local: { // Wildcard: Update to match your language
        journalTitle: "The Italian Journal 2026",
        tagline: "Прослеживая историю через призму современных путешествий",
        footerTitle: "Итальянский дневник · 2026",
        footerText: "До следующего путешествия",
        readMore: "Читать далее",
        showLess: "Свернуть",
        closeImage: "Закрыть изображение",
        previousImage: "Предыдущее изображение",
        nextImage: "Следующее изображение",
        downloadImage: "Скачать изображение",
        goToImage: "Перейти к изображению {n}",
    }
} as const;

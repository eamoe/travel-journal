import { asset } from "./lib/format";

export const LANG_CONFIG = {
    en: {
        label: "EN",
        locale: "en-US",
        flag: asset("flags/en.svg"),
    },
    local: {
        label: "RU", // Wildcard: Change to "IT", "ES", "FR", etc.
        locale: "ru-RU",
        flag: asset("flags/local.svg"),
    }
} as const;

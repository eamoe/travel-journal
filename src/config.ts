import { asset } from "./lib/format";

export const LANG_CONFIG = {
    en: {
        label: "EN",
        flag: asset("flags/en.svg"),
    },
    local: {
        label: "RU", // Wildcard: Change to "IT", "ES", "FR", etc.
        flag: asset("flags/local.svg"),
    }
} as const;

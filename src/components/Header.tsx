import { Language } from "../types";
import { LANG_CONFIG } from "../config.ts";
import { UI_STRINGS } from "../translations.ts";

interface HeaderProps {
  currentLang: Language;
  onLanguageToggle: (lang: Language) => void;
}


export default function Header({ currentLang, onLanguageToggle }: HeaderProps) {
  const isEn = currentLang === 'en';
  const t = UI_STRINGS[currentLang];

  return (
      <header
          className="sticky top-0 z-30 border-b border-muted/40 backdrop-blur-md"
          style={{ backgroundColor: "rgba(248, 246, 242, 0.82)" }}
      >
      <div className="mx-auto flex max-w-[760px] items-center justify-between px-5 py-5 sm:py-6">
        <div className="flex flex-col gap-0.5 sm:gap-1">
          <h1 className="font-serif text-xl font-semibold text-ink sm:text-2xl leading-tight">
            {t.journalTitle}
          </h1>
          <p className="hidden sm:block text-[13px] text-ink/65">
            {t.tagline}
          </p>
        </div>

        {/* Language Toggle UI */}
        <div className="flex items-center gap-3">
          <span className={`text-[11px] font-bold tracking-wider transition-opacity ${isEn ? 'opacity-100' : 'opacity-30'}`}>
            {LANG_CONFIG.en.label}
          </span>

          <button
              onClick={() => onLanguageToggle(isEn ? 'local' : 'en')}
              className="group relative h-7 w-14 rounded-full border border-ink/10 bg-paper shadow-inner transition-transform active:scale-95 hover:scale-105 overflow-hidden"
              aria-label="Toggle language"
          >
            {/* Flag Track */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <img
                  src={isEn ? LANG_CONFIG.en.flag : LANG_CONFIG.local.flag}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition-opacity duration-500"
              />
              {/* Subtle overlay to keep the 'sunken' track look even with a bright flag */}
              <div className="absolute inset-0 bg-ink/5 pointer-events-none" />
            </div>

            {/* Slider Knob */}
            <div
                className={`absolute top-0.5 h-5.5 w-5.5 rounded-full bg-white shadow-md transition-all duration-300 ease-in-out border border-ink/5 ${
                    isEn ? 'left-0.5' : 'left-7.5'
                }`}
            />
          </button>

          <span className={`text-[11px] font-bold tracking-wider transition-opacity ${!isEn ? 'opacity-100' : 'opacity-30'}`}>
            {LANG_CONFIG.local.label}
          </span>
        </div>
      </div>
    </header>
  )
}

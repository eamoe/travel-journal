export default function Header() {
  return (
    <header
      className="sticky top-0 z-30 border-b border-muted/70 backdrop-blur-md backdrop-saturate-150"
      style={{ backgroundColor: "rgba(248, 246, 242, 0.85)" }}
    >
      <div className="mx-auto flex max-w-[760px] flex-col gap-1 px-5 py-5 sm:py-6">
        <h1 className="font-serif text-pretty text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          The World Travel Journal 2026
        </h1>
        <p className="hidden sm:block text-balance text-[13px] leading-relaxed text-ink/65 sm:text-sm">
          A record of travels from the spring bloom through the early summer heat.
        </p>
      </div>
    </header>
  )
}

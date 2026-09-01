export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="AI Command Centre">
      <svg aria-hidden="true" className="size-8 shrink-0" viewBox="0 0 36 36" fill="none">
        <path d="M18 4 6.5 29.5 18 23l11.5 6.5L18 4Z" stroke="url(#brand-gradient)" strokeWidth="3" strokeLinejoin="round" />
        <path d="m12.5 25.5 5.5-13 5.5 13M14.5 20h7" stroke="#63B3FF" strokeWidth="2" strokeLinecap="round" />
        <defs>
          <linearGradient id="brand-gradient" x1="7" y1="30" x2="29" y2="5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C5CFF" />
            <stop offset="1" stopColor="#13A8FF" />
          </linearGradient>
        </defs>
      </svg>
      {!compact && <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em] text-foreground">AI Command Centre</span>}
    </div>
  );
}

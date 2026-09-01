import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="AI Command Centre">
      <Image src="/favicon.png" alt="" aria-hidden="true" width={36} height={36} className="size-8 shrink-0 rounded-lg object-cover" priority />
      {!compact && <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em] text-foreground">AI Command Centre</span>}
    </div>
  );
}

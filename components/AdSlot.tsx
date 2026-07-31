type AdSlotProps = {
  /** Named so it's obvious in devtools / CMS which slot this is. */
  slot: "top-banner" | "in-content" | "footer";
  className?: string;
};

const SIZE_LABEL: Record<AdSlotProps["slot"], string> = {
  "top-banner": "728 × 90",
  "in-content": "336 × 120",
  footer: "728 × 90",
};

const HEIGHT_CLASS: Record<AdSlotProps["slot"], string> = {
  "top-banner": "h-[90px]",
  "in-content": "h-[120px]",
  footer: "h-[90px]",
};

/**
 * Placeholder ad unit. Swap the contents of this component for your
 * ad network's tag (e.g. Google Ad Manager / AdSense slot) — the
 * outer frame, sizing, and labelling are the design contract to keep.
 */
export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div
      data-ad-slot={slot}
      className={`flex w-full items-center justify-center rounded-md border border-dashed border-border bg-surface ${HEIGHT_CLASS[slot]} ${className}`}
    >
      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        Advertisement · {SIZE_LABEL[slot]}
      </span>
    </div>
  );
}

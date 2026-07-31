const PLATFORMS = [
  "YouTube",
  "Facebook",
  "Instagram",
  "TikTok",
  "X",
  "Vimeo",
  "Reddit",
  "Twitch",
  "Dailymotion",
];

/**
 * Neutral monogram badges rather than reproductions of each
 * platform's brand mark — keeps the row legally safe while still
 * communicating breadth of support.
 */
export function PlatformRow() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-2.5" aria-label="Supported platforms">
      {PLATFORMS.map((name) => (
        <li key={name}>
          <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
              {name[0]}
            </span>
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

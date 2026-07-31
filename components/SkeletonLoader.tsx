export function SkeletonLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Analyzing link"
      className="rounded-lg border border-border bg-surface p-5"
    >
      <div className="flex gap-4">
        <div className="h-24 w-40 flex-none rounded-md bg-border" />
        <div className="flex flex-1 flex-col gap-2.5 py-1">
          <div className="h-4 w-3/4 rounded bg-border" />
          <div className="h-3 w-1/3 rounded bg-border" />
          <div className="h-3 w-1/4 rounded bg-border" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-text-secondary">Analyzing link…</p>
    </div>
  );
}

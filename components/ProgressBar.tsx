type ProgressBarProps = {
  fileName: string;
  percent: number; // 0-100
  speed: string; // e.g. "6.4 MB/s"
  eta: string; // e.g. "0:08 left"
  onCancel: () => void;
};

export function ProgressBar({ fileName, percent, speed, eta, onCancel }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="truncate text-sm font-medium text-text-primary">{fileName}</span>
        <button
          type="button"
          onClick={onCancel}
          className="flex-none text-xs font-semibold text-error hover:underline"
        >
          Cancel
        </button>
      </div>

      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-pill bg-border"
      >
        <div className="h-full rounded-pill bg-accent" style={{ width: `${clamped}%` }} />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
        <span>{clamped}%</span>
        <span>
          {speed} · {eta}
        </span>
      </div>
    </div>
  );
}

import type { VideoFormat } from "@/lib/types";

type FormatListProps = {
  formats: VideoFormat[];
  onDownload: (format: VideoFormat) => void;
};

export function FormatList({ formats, onDownload }: FormatListProps) {
  const videoFormats = formats.filter((f) => f.kind === "video");
  const audioFormats = formats.filter((f) => f.kind === "audio");

  return (
    <div className="flex flex-col gap-5">
      <FormatGroup title="Video" formats={videoFormats} onDownload={onDownload} />
      <FormatGroup title="Audio only" formats={audioFormats} onDownload={onDownload} />
    </div>
  );
}

function FormatGroup({
  title,
  formats,
  onDownload,
}: {
  title: string;
  formats: VideoFormat[];
  onDownload: (format: VideoFormat) => void;
}) {
  if (formats.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {title}
      </h3>
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
        {formats.map((format) => (
          <li key={format.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-baseline gap-2.5">
              <span className="text-sm font-semibold text-text-primary">{format.label}</span>
              <span className="text-xs uppercase text-text-secondary">{format.container}</span>
              <span className="text-xs text-text-secondary">{format.fileSize}</span>
            </div>
            <button
              type="button"
              onClick={() => onDownload(format)}
              className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { VideoFormat, VideoInfo } from "@/lib/types";
import { FormatList } from "./FormatList";

type VideoResultProps = {
  video: VideoInfo;
  onDownload: (format: VideoFormat) => void;
};

export function VideoResult({ video, onDownload }: VideoResultProps) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex h-32 w-full flex-none items-center justify-center rounded-md bg-border sm:w-56">
          <span className="text-xs font-medium text-text-secondary">{video.thumbnailLabel}</span>
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {video.duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <span className="inline-flex w-fit items-center rounded-pill bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
            {video.platform}
          </span>
          <h2 className="text-base font-semibold leading-snug text-text-primary">
            {video.title}
          </h2>
          <p className="text-sm text-text-secondary">{video.channel}</p>
          <p className="text-xs text-text-secondary">
            {video.uploadDate}
            {video.views ? ` · ${video.views}` : ""}
          </p>
        </div>
      </div>

      <FormatList formats={video.formats} onDownload={onDownload} />
    </div>
  );
}

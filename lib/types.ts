export type Platform =
  | "YouTube"
  | "Facebook"
  | "Instagram"
  | "TikTok"
  | "X"
  | "Vimeo"
  | "Reddit"
  | "Twitch"
  | "Dailymotion";

export interface VideoFormat {
  id: string;
  kind: "video" | "audio";
  label: string; // e.g. "1080p" or "MP3"
  container: string; // e.g. "mp4", "mp3"
  fileSize: string; // display string, e.g. "84.2 MB"
  url?: string;
  formatId?: string;
  videoUrl?: string;
  resolution?: number;
  needsMux?: boolean;
}

export interface VideoInfo {
  title: string;
  channel: string;
  platform: Platform;
  duration: string; // "12:34"
  uploadDate: string; // display string
  views?: string;
  thumbnailUrl?: string;
  thumbnailLabel: string; // short label used on the placeholder thumbnail
  formats: VideoFormat[];
}

export type AnalyzeErrorCode =
  | "invalid_url"
  | "unsupported_platform"
  | "video_unavailable"
  | "private_video"
  | "network_timeout"
  | "copyright_restricted";

export interface AnalyzeSuccess {
  ok: true;
  video: VideoInfo;
}

export interface AnalyzeFailure {
  ok: false;
  code: AnalyzeErrorCode;
  message: string;
}

export type AnalyzeResponse = AnalyzeSuccess | AnalyzeFailure;

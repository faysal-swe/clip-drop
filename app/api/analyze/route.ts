import { NextResponse } from "next/server";
import type { AnalyzeResponse } from "@/lib/types";

/**
 * Mock analyze endpoint. Ships with fake data only, so the UI has
 * something real to render for each state (success / every error
 * case). Replace the body of this handler with a call to your own
 * backend/service — this project does not implement extraction from
 * any third-party video platform.
 */
export async function POST(request: Request) {
  const { url } = (await request.json()) as { url?: string };

  // Simulate network latency so the loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!url || !url.trim()) {
    return NextResponse.json<AnalyzeResponse>({
      ok: false,
      code: "invalid_url",
      message: "Paste a video URL to get started.",
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return NextResponse.json<AnalyzeResponse>({
      ok: false,
      code: "invalid_url",
      message: "That doesn't look like a valid URL.",
    });
  }

  const host = parsed.hostname.replace(/^www\./, "");

  const errorByKeyword: Record<string, AnalyzeResponse> = {
    private: {
      ok: false,
      code: "private_video",
      message: "This video is private and can't be accessed.",
    },
    unavailable: {
      ok: false,
      code: "video_unavailable",
      message: "This video is unavailable or has been removed.",
    },
    timeout: {
      ok: false,
      code: "network_timeout",
      message: "The request timed out. Check your connection and try again.",
    },
    copyright: {
      ok: false,
      code: "copyright_restricted",
      message: "This content is restricted and can't be downloaded.",
    },
  };

  for (const [keyword, response] of Object.entries(errorByKeyword)) {
    if (url.toLowerCase().includes(keyword)) {
      return NextResponse.json(response);
    }
  }

  const supportedHosts = [
    "youtube.com",
    "youtu.be",
    "facebook.com",
    "instagram.com",
    "tiktok.com",
    "x.com",
    "twitter.com",
    "vimeo.com",
    "reddit.com",
    "twitch.tv",
    "dailymotion.com",
  ];

  const isSupported = supportedHosts.some((h) => host.endsWith(h));
  if (!isSupported) {
    return NextResponse.json<AnalyzeResponse>({
      ok: false,
      code: "unsupported_platform",
      message: `${host} isn't a supported platform yet.`,
    });
  }

  return NextResponse.json<AnalyzeResponse>({
    ok: true,
    video: {
      title: "Sample video title used for the UI demo",
      channel: "Demo Channel",
      platform: "YouTube",
      duration: "12:47",
      uploadDate: "Jun 3, 2026",
      views: "1.2M views",
      thumbnailLabel: "16:9",
      formats: [
        { id: "v2160", kind: "video", label: "2160p", container: "mp4", fileSize: "612 MB" },
        { id: "v1080", kind: "video", label: "1080p", container: "mp4", fileSize: "184 MB" },
        { id: "v720", kind: "video", label: "720p", container: "mp4", fileSize: "96 MB" },
        { id: "v480", kind: "video", label: "480p", container: "mp4", fileSize: "54 MB" },
        { id: "v144", kind: "video", label: "144p", container: "mp4", fileSize: "12 MB" },
        { id: "amp3", kind: "audio", label: "MP3", container: "mp3", fileSize: "11.6 MB" },
        { id: "am4a", kind: "audio", label: "M4A", container: "m4a", fileSize: "10.9 MB" },
        { id: "aaac", kind: "audio", label: "AAC", container: "aac", fileSize: "10.4 MB" },
        { id: "awav", kind: "audio", label: "WAV", container: "wav", fileSize: "68.2 MB" },
      ],
    },
  });
}

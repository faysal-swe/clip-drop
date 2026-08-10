import axios from "axios";
import type { AnalyzeResponse } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://clip-drop-backend.onrender.com/api";
// http://localhost:5000/api
export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends a pasted URL to the Node.js backend for analysis.
 */
export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  try {
    const { data } = await api.post<AnalyzeResponse>("/fetch-info", { url });
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data as AnalyzeResponse;
    }
    return {
      ok: false,
      code: "network_timeout",
      message: "Could not reach the extraction server. Make sure clip_drop_backend is running.",
    };
  }
}

/**
 * Returns proxy stream download URL for a given video/audio format
 */
export function getProxyStreamUrl(format: import("./types").VideoFormat, title: string): string {
  const params = new URLSearchParams();
  if (format.url) {
    params.set("streamUrl", format.url);
  }
  if (format.videoUrl) {
    params.set("videoUrl", format.videoUrl);
  }
  if (format.formatId) {
    params.set("formatId", format.formatId);
  }
  params.set("filename", title || "download");
  params.set("container", format.container || "mp4");
  params.set("kind", format.kind || "video");

  // Pass resolution so backend knows whether to merge video+audio (>360p) or direct download (≤360p)
  if (format.resolution) {
    params.set("resolution", String(format.resolution));
  } else if (format.kind === "video" && format.label) {
    const parsed = parseInt(format.label, 10);
    if (!isNaN(parsed)) {
      params.set("resolution", String(parsed));
    }
  }

  return `${BACKEND_URL}/proxy-stream?${params.toString()}`;
}

/**
 * Parses display file size strings like "14.5 MB", "500 KB" into byte count.
 */
export function parseFileSizeToBytes(sizeStr?: string): number | null {
  if (!sizeStr) return null;
  const cleaned = sizeStr.trim().toUpperCase();
  const match = cleaned.match(/^([\d\.]+)\s*([KMGT]?B)$/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit = match[2];
  if (isNaN(value)) return null;

  switch (unit) {
    case "KB":
      return Math.round(value * 1024);
    case "MB":
      return Math.round(value * 1024 * 1024);
    case "GB":
      return Math.round(value * 1024 * 1024 * 1024);
    case "TB":
      return Math.round(value * 1024 * 1024 * 1024 * 1024);
    case "B":
      return Math.round(value);
    default:
      return null;
  }
}

export type DownloadProgressState = {
  status: "connecting" | "downloading" | "completed" | "error";
  loadedBytes: number;
  totalBytes: number | null;
  percent: number;
  speed: string;
  eta: string;
  errorMessage?: string;
};

export type DownloadProgressCallback = (state: DownloadProgressState) => void;

/**
 * Streams media file from backend proxy and updates download progress in real time.
 */
export async function downloadProxyStream(
  format: import("./types").VideoFormat,
  title: string,
  onProgress: DownloadProgressCallback,
  signal: AbortSignal
): Promise<void> {
  const downloadUrl = getProxyStreamUrl(format, title);
  const estimatedTotal = parseFileSizeToBytes(format.fileSize);

  let startTime = Date.now();
  let lastLoaded = 0;
  let lastTime = startTime;
  let currentSpeedStr = "Connecting...";

  onProgress({
    loadedBytes: 0,
    totalBytes: estimatedTotal,
    percent: 0,
    speed: "Connecting...",
    eta: "Preparing...",
    status: "connecting",
  });

  try {
    const response = await axios.get(downloadUrl, {
      responseType: "blob",
      signal,
      onDownloadProgress: (progressEvent) => {
        const now = Date.now();
        const loaded = progressEvent.loaded;
        const total = progressEvent.total || estimatedTotal || null;

        const timeDiff = (now - lastTime) / 1000;
        if (timeDiff >= 0.3 || lastLoaded === 0) {
          const bytesDiff = loaded - lastLoaded;
          const bytesPerSec = timeDiff > 0 ? bytesDiff / timeDiff : 0;

          if (bytesPerSec >= 1024 * 1024) {
            currentSpeedStr = `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
          } else if (bytesPerSec >= 1024) {
            currentSpeedStr = `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
          } else if (bytesPerSec > 0) {
            currentSpeedStr = `${Math.round(bytesPerSec)} B/s`;
          }

          lastTime = now;
          lastLoaded = loaded;
        }

        let percent = 0;
        let etaStr = "Streaming...";

        if (total && total > 0) {
          percent = Math.min(99, Math.round((loaded * 100) / total));
          const overallTime = (now - startTime) / 1000;
          const overallSpeed = overallTime > 0 ? loaded / overallTime : 0;
          if (overallSpeed > 0 && loaded < total) {
            const remainingSecs = Math.round((total - loaded) / overallSpeed);
            const mins = Math.floor(remainingSecs / 60);
            const secs = remainingSecs % 60;
            etaStr = mins > 0 ? `${mins}m ${secs}s left` : `${secs}s left`;
          }
        } else {
          const elapsedSecs = (now - startTime) / 1000;
          percent = Math.min(90, Math.round(100 * (1 - Math.exp(-elapsedSecs / 12))));
          etaStr = "Streaming...";
        }

        onProgress({
          loadedBytes: loaded,
          totalBytes: total,
          percent,
          speed: currentSpeedStr,
          eta: etaStr,
          status: "downloading",
        });
      },
    });

    const safeContainer = format.container || "mp4";
    const cleanTitle = (title || "video").replace(/[^a-zA-Z0-9_\-\.\s]/g, "").trim() || "download";
    const filename = `${cleanTitle}.${safeContainer}`;

    onProgress({
      loadedBytes: response.data.size || lastLoaded,
      totalBytes: response.data.size || lastLoaded,
      percent: 100,
      speed: "Complete",
      eta: "0s left",
      status: "completed",
    });

    const contentTypeHeader = response.headers["content-type"];
    const mimeType = typeof contentTypeHeader === "string" ? contentTypeHeader : "application/octet-stream";
    const blob = new Blob([response.data], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  } catch (error: any) {
    if (axios.isCancel(error) || error.name === "CanceledError" || error.name === "AbortError") {
      console.log("Download stream aborted by user.");
      return;
    }

    console.warn("Direct blob stream failed, executing direct browser link fallback:", error);

    const safeContainer = format.container || "mp4";
    const cleanTitle = (title || "video").replace(/[^a-zA-Z0-9_\-\.\s]/g, "").trim() || "download";
    const filename = `${cleanTitle}.${safeContainer}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onProgress({
      loadedBytes: 0,
      totalBytes: estimatedTotal,
      percent: 100,
      speed: "Started",
      eta: "Browser Download",
      status: "completed",
    });
  }
}

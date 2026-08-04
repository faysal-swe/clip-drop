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

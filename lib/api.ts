import axios from "axios";
import type { AnalyzeResponse } from "./types";

export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends a pasted URL to the backend for analysis.
 *
 * NOTE: This calls this app's own /api/analyze route, which currently
 * returns mock data for UI/UX demonstration purposes (see
 * app/api/analyze/route.ts). Wire it up to a real backend service
 * before shipping — this project intentionally ships no logic for
 * extracting or downloading media from third-party platforms.
 */
export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const { data } = await api.post<AnalyzeResponse>("/analyze", { url });
  return data;
}

"use client";

import { useState } from "react";
import { analyzeUrl } from "@/lib/api";
import type { AnalyzeResponse, VideoFormat } from "@/lib/types";
import { SkeletonLoader } from "./SkeletonLoader";
import { ErrorCard } from "./ErrorCard";
import { VideoResult } from "./VideoResult";
import { ProgressBar } from "./ProgressBar";

type Status = "idle" | "loading" | "success" | "error";

export function HomeAnalyzer() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [download, setDownload] = useState<{ format: VideoFormat; percent: number } | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    setDownload(null);
    try {
      const response = await analyzeUrl(url);
      setResult(response);
      setStatus(response.ok ? "success" : "error");
    } catch {
      setResult({
        ok: false,
        code: "network_timeout",
        message: "Something went wrong reaching the server. Try again.",
      });
      setStatus("error");
    }
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      // Clipboard permission denied — user can paste manually.
    }
  }

  function handleDownload(format: VideoFormat) {
    // Demo only: represents progress instantly at a fixed midpoint.
    // Wire this up to your real download/queue system.
    setDownload({ format, percent: 42 });
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleAnalyze} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2.5">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a video link (YouTube, TikTok, Instagram…)"
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="flex-none rounded-sm px-2 py-1 text-xs font-semibold text-accent hover:bg-accent-soft"
          >
            Paste
          </button>
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-none rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "loading" ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {status === "loading" && <SkeletonLoader />}

      {status === "error" && result && !result.ok && <ErrorCard message={result.message} />}

      {status === "success" && result && result.ok && (
        <VideoResult video={result.video} onDownload={handleDownload} />
      )}

      {download && (
        <ProgressBar
          fileName={`video.${download.format.container}`}
          percent={download.percent}
          speed="6.4 MB/s"
          eta="0:08 left"
          onCancel={() => setDownload(null)}
        />
      )}
    </div>
  );
}

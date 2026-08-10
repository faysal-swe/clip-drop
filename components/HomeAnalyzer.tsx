"use client";

import { useState } from "react";
import { analyzeUrl, downloadProxyStream, type DownloadProgressState } from "@/lib/api";
import type { AnalyzeResponse, VideoFormat } from "@/lib/types";
import { SkeletonLoader } from "./SkeletonLoader";
import { ErrorCard } from "./ErrorCard";
import { VideoResult } from "./VideoResult";
import { DownloadModal } from "./DownloadModal";

type Status = "idle" | "loading" | "success" | "error";

export function HomeAnalyzer() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  const [activeDownload, setActiveDownload] = useState<{
    format: VideoFormat;
    title: string;
    progress: DownloadProgressState;
    controller: AbortController;
  } | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    if (activeDownload) {
      activeDownload.controller.abort();
      setActiveDownload(null);
    }
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

  function triggerAdNetworkEvent() {
    // Triggers Ad Network Event (Popunder / Display CPM) if window script function exists
    if (typeof window !== "undefined") {
      const win = window as any;
      if (typeof win.triggerPopunder === "function") {
        try {
          win.triggerPopunder();
        } catch (e) {
          console.warn("Ad network event trigger error:", e);
        }
      }
    }
  }

  function handleDownload(format: VideoFormat) {
    if (!result || !result.ok) return;

    // 1. Trigger Ad Network Event (Popunder / Display CPM)
    triggerAdNetworkEvent();

    // 2. Abort previous download if any
    if (activeDownload) {
      activeDownload.controller.abort();
    }

    // 3. Create AbortController & initial state
    const controller = new AbortController();
    const videoTitle = result.video.title;

    const initialProgress: DownloadProgressState = {
      status: "connecting",
      loadedBytes: 0,
      totalBytes: null,
      percent: 0,
      speed: "Connecting...",
      eta: "Preparing...",
    };

    setActiveDownload({
      format,
      title: videoTitle,
      progress: initialProgress,
      controller,
    });

    // 4. Start stream download
    downloadProxyStream(
      format,
      videoTitle,
      (updatedProgress) => {
        setActiveDownload((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            progress: updatedProgress,
          };
        });
      },
      controller.signal
    );
  }

  function handleCancelDownload() {
    if (activeDownload) {
      activeDownload.controller.abort();
      setActiveDownload(null);
    }
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

      {activeDownload && (
        <DownloadModal
          format={activeDownload.format}
          title={activeDownload.title}
          thumbnailUrl={result && result.ok ? result.video.thumbnailUrl : undefined}
          progress={activeDownload.progress}
          onCancel={handleCancelDownload}
        />
      )}
    </div>
  );
}

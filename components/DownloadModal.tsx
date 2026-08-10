"use client";

import React from "react";
import type { VideoFormat } from "@/lib/types";
import type { DownloadProgressState } from "@/lib/api";

type DownloadModalProps = {
  format: VideoFormat;
  title: string;
  thumbnailUrl?: string;
  progress: DownloadProgressState;
  onCancel: () => void;
};

export function DownloadModal({
  format,
  title,
  thumbnailUrl,
  progress,
  onCancel,
}: DownloadModalProps) {
  const { status, loadedBytes, totalBytes, percent, speed, eta, errorMessage } = progress;

  // Format bytes helper for human readable display
  function formatBytes(bytes: number): string {
    if (bytes <= 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const isCompleted = status === "completed";
  const isError = status === "error";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface/95 p-6 text-center shadow-2xl backdrop-blur-xl animate-modal-pop sm:p-8">
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-accent/25 blur-3xl animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl animate-pulse-glow" />

        {/* Top Header Badge */}
        <div className="mb-5 flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className={`absolute inline-flex h-full w-full rounded-full ${isCompleted ? 'bg-success' : 'bg-accent'} opacity-75 animate-ping`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${isCompleted ? 'bg-success' : 'bg-accent'}`} />
            </span>
            {isCompleted ? "Download Complete" : status === "connecting" ? "Preparing Download" : "Downloading from Server"}
          </div>
          <h3 className="line-clamp-1 text-sm font-semibold text-text-primary sm:text-base" title={title}>
            {title}
          </h3>
          <div className="flex items-center justify-center gap-2 text-xs text-text-secondary">
            <span className="font-semibold uppercase text-accent">{format.label}</span>
            <span>•</span>
            <span className="uppercase">{format.container}</span>
            {format.fileSize && (
              <>
                <span>•</span>
                <span>{format.fileSize}</span>
              </>
            )}
          </div>
        </div>

        {/* Centerpiece Spinning Dual Ring / Progress Badge */}
        <div className="my-6 flex justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center">
            {!isCompleted && !isError && (
              <>
                {/* Outer spinning ring */}
                <svg className="absolute inset-0 h-full w-full animate-spin text-accent" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeDasharray="200 80"
                    strokeLinecap="round"
                    className="opacity-80"
                  />
                </svg>

                {/* Inner counter-spinning ring */}
                <svg className="absolute inset-2 h-24 w-24 animate-spin-reverse text-indigo-400 opacity-60" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray="140 100"
                    strokeLinecap="round"
                  />
                </svg>
              </>
            )}

            {/* Inner Ring Content */}
            <div className={`flex h-20 w-20 items-center justify-center rounded-full border shadow-inner ${
              isCompleted ? "border-success/40 bg-success-soft text-success" : isError ? "border-error/40 bg-error-soft text-error" : "border-border/60 bg-surface-raised/80 text-text-primary"
            }`}>
              {isCompleted ? (
                <svg className="h-10 w-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : isError ? (
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : status === "connecting" ? (
                <svg className="h-9 w-9 text-accent animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              ) : (
                <span className="text-xl font-black tracking-tight text-accent">
                  {percent}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="mb-3 flex flex-col gap-2">
          <div className="relative h-3 w-full overflow-hidden rounded-full border border-border bg-surface-raised">
            <div
              className={`h-full transition-all duration-300 ${
                isCompleted ? "bg-success" : "bg-gradient-to-r from-indigo-500 via-accent to-purple-500"
              }`}
              style={{ width: `${Math.max(3, Math.min(100, percent))}%` }}
            />
            {!isCompleted && !isError && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            )}
          </div>

          {/* Realtime metric stats */}
          <div className="flex items-center justify-between text-xs font-medium text-text-secondary">
            <span>
              {formatBytes(loadedBytes)}
              {totalBytes && totalBytes > 0 ? ` / ${formatBytes(totalBytes)}` : ""}
            </span>
            <span>
              {!isCompleted && !isError ? `${speed} • ${eta}` : isCompleted ? "Ready in downloads" : "Error"}
            </span>
          </div>
        </div>

        {/* Error Message if any */}
        {isError && errorMessage && (
          <p className="mb-4 text-xs font-medium text-error">{errorMessage}</p>
        )}

        {/* Cancel Button */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              isCompleted
                ? "bg-accent text-white hover:bg-accent-hover"
                : "border border-border bg-surface-raised text-text-secondary hover:bg-error-soft hover:text-error hover:border-error/30"
            }`}
          >
            {isCompleted ? "Close" : "Cancel Download"}
          </button>
        </div>
      </div>
    </div>
  );
}

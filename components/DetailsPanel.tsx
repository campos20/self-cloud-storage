"use client";

import { useEffect, useState } from "react";
import { getFileKind } from "@/lib/file-types";
import { formatBytes, formatDate } from "@/lib/format";
import type { FileEntry } from "@/lib/types";

export default function DetailsPanel({
  bucket,
  file,
  name,
  onClose,
}: {
  bucket: string;
  file: FileEntry;
  name: string;
  onClose: () => void;
}) {
  const kind = getFileKind(name);
  const src = `/api/object?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(file.key)}`;
  const downloadSrc = `${src}&download=1`;
  // Text preview reads through our own server (not the presigned redirect):
  // the browser's fetch() would otherwise hit S3 cross-origin, which is
  // CORS-checked and blocked on buckets without a CORS policy.
  const textPreviewSrc = `/api/object-text?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(file.key)}`;
  const [text, setText] = useState<string | null>(null);
  const [textError, setTextError] = useState(false);

  useEffect(() => {
    if (kind !== "text") return;
    let cancelled = false;
    fetch(textPreviewSrc)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((t) => {
        if (!cancelled) setText(t);
      })
      .catch(() => {
        if (!cancelled) setTextError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [textPreviewSrc, kind]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="break-all text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {name}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={downloadSrc}
              className="rounded border border-zinc-300 px-2 py-1 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Download
            </a>
            <button
              onClick={onClose}
              className="rounded px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Close
            </button>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-2 border-b border-zinc-200 p-4 text-xs dark:border-zinc-800">
          <div>
            <dt className="text-zinc-500">Size</dt>
            <dd className="text-zinc-900 dark:text-zinc-100">{formatBytes(file.size)}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Last modified</dt>
            <dd className="text-zinc-900 dark:text-zinc-100">
              {file.lastModified ? formatDate(file.lastModified) : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Storage class</dt>
            <dd className="text-zinc-900 dark:text-zinc-100">
              {file.storageClass ?? "STANDARD"}
            </dd>
          </div>
        </dl>

        <div className="flex-1 overflow-auto p-4">
          {kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={name} className="mx-auto max-h-[60vh] rounded" />
          )}
          {kind === "pdf" && (
            <iframe src={src} title={name} className="h-[60vh] w-full rounded border-0" />
          )}
          {kind === "video" && (
            <video controls src={src} className="mx-auto max-h-[60vh] w-full rounded" />
          )}
          {kind === "audio" && <audio controls src={src} className="w-full" />}
          {kind === "text" &&
            (textError ? (
              <p className="text-sm text-zinc-500">Could not load preview.</p>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-xs text-zinc-800 dark:text-zinc-200">
                {text ?? "Loading…"}
              </pre>
            ))}
          {kind === "other" && (
            <p className="text-sm text-zinc-500">
              No inline preview for this file type — use the Download button above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

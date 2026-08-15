"use client";

import { useEffect, useState } from "react";
import { shellQuote } from "@/lib/shell";
import type { BrowserTarget } from "@/lib/types";

export default function DeleteCommandModal({
  bucket,
  target,
  onClose,
}: {
  bucket: string;
  target: BrowserTarget;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const uri =
    target.type === "file"
      ? `s3://${bucket}/${target.file.key}`
      : `s3://${bucket}/${target.fullPrefix}`;
  const command =
    target.type === "file"
      ? `aws s3 rm ${shellQuote(uri)}`
      : `aws s3 rm ${shellQuote(uri)} --recursive`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can be unavailable (e.g. non-secure context) — the
      // command is still visible and selectable, so this is non-fatal.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Delete via AWS CLI
          </h2>
          <button
            onClick={onClose}
            className="shrink-0 rounded px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          This app is read-only and never deletes anything itself. Copy this
          command and run it yourself with the AWS CLI if you want to delete{" "}
          {target.type === "folder" ? "this folder" : "this file"}.
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-md bg-zinc-100 p-3 dark:bg-zinc-900">
          <code className="flex-1 overflow-x-auto whitespace-pre text-xs text-zinc-800 dark:text-zinc-200">
            {command}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {target.type === "folder" && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            --recursive deletes every object under this prefix. Double-check
            the path before running it.
          </p>
        )}
      </div>
    </div>
  );
}

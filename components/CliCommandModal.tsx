"use client";

import { useEffect, useState } from "react";
import { shellQuote } from "@/lib/shell";
import { CheckIcon, CloseIcon, CopyIcon } from "./Icons";
import type { BrowserTarget } from "@/lib/types";

export type CliAction = "delete" | "download";

export default function CliCommandModal({
  action,
  bucket,
  target,
  onClose,
}: {
  action: CliAction;
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

  const isFolder = target.type === "folder";
  const uri = isFolder ? `s3://${bucket}/${target.fullPrefix}` : `s3://${bucket}/${target.file.key}`;
  const thing = isFolder ? "this folder" : "this file";

  const title = action === "delete" ? "Delete via AWS CLI" : "Download via AWS CLI";
  const description =
    action === "delete"
      ? `This app is read-only and never deletes anything itself. Copy this command and run it yourself with the AWS CLI if you want to delete ${thing}.`
      : `Large files can be slow or unreliable to pull through a browser. Copy this command and run it yourself with the AWS CLI to download ${thing} directly.`;

  const command =
    action === "delete"
      ? `aws s3 rm ${shellQuote(uri)}${isFolder ? " --recursive" : ""}`
      : `aws s3 cp ${shellQuote(uri)} ${shellQuote(`./${target.name}`)}${isFolder ? " --recursive" : ""}`;

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
        className="w-full max-w-4xl rounded-lg bg-white p-5 shadow-xl dark:bg-zinc-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="shrink-0 rounded p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-xs text-zinc-500">{description}</p>

        <div className="mt-3 flex items-center gap-2 rounded-md bg-zinc-100 p-3 dark:bg-zinc-900">
          <code className="flex-1 overflow-x-auto whitespace-pre text-xs text-zinc-800 dark:text-zinc-200">
            {command}
          </code>
          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy"}
            aria-label={copied ? "Copied" : "Copy"}
            className="shrink-0 rounded border border-zinc-300 p-1.5 text-zinc-700 hover:bg-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-500" />
            ) : (
              <CopyIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {action === "delete" && isFolder && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            --recursive deletes every object under this prefix. Double-check
            the path before running it.
          </p>
        )}
      </div>
    </div>
  );
}

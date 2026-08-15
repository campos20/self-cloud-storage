"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FileTile from "./FileTile";
import FileListRow from "./FileListRow";
import DetailsPanel from "./DetailsPanel";
import ContextMenu, { type ContextMenuItem } from "./ContextMenu";
import CliCommandModal, { type CliAction } from "./CliCommandModal";
import type { BrowserTarget, FileEntry } from "@/lib/types";

type ViewMode = "grid" | "list";

export default function ObjectBrowser({
  bucket,
  prefix,
  folders,
  files,
}: {
  bucket: string;
  prefix: string;
  folders: string[];
  files: FileEntry[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<{ file: FileEntry; name: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: BrowserTarget } | null>(
    null
  );
  const [cliCommand, setCliCommand] = useState<{ action: CliAction; target: BrowserTarget } | null>(null);

  const folderEntries = useMemo(
    () =>
      folders.map((full) => ({
        full,
        name: full.slice(prefix.length).replace(/\/$/, ""),
      })),
    [folders, prefix]
  );
  const fileEntries = useMemo(
    () => files.map((file) => ({ file, name: file.key.slice(prefix.length) })),
    [files, prefix]
  );

  const q = filter.trim().toLowerCase();
  const visibleFolders = q
    ? folderEntries.filter((f) => f.name.toLowerCase().includes(q))
    : folderEntries;
  const visibleFiles = q
    ? fileEntries.filter((f) => f.name.toLowerCase().includes(q))
    : fileEntries;
  const isEmpty = visibleFolders.length === 0 && visibleFiles.length === 0;

  function openFolderMenu(e: React.MouseEvent, folder: { full: string; name: string }) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: { type: "folder", fullPrefix: folder.full, name: folder.name },
    });
  }

  function openFileMenu(e: React.MouseEvent, entry: { file: FileEntry; name: string }) {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      target: { type: "file", file: entry.file, name: entry.name },
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  // The response behind this URL carries Content-Disposition: attachment
  // (see /api/object's download param), so navigating to it triggers a
  // save dialog rather than actually leaving the page.
  function triggerDownload(url: string) {
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function menuItemsFor(target: BrowserTarget): ContextMenuItem[] {
    const uri =
      target.type === "file" ? `s3://${bucket}/${target.file.key}` : `s3://${bucket}/${target.fullPrefix}`;

    const items: ContextMenuItem[] = [];
    if (target.type === "folder") {
      items.push({
        label: "Open folder",
        onClick: () =>
          router.push(`/?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(target.fullPrefix)}`),
      });
    } else {
      items.push({ label: "Preview", onClick: () => setSelected({ file: target.file, name: target.name }) });
      items.push({
        label: "Download",
        onClick: () =>
          triggerDownload(
            `/api/object?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(target.file.key)}&download=1`
          ),
      });
    }
    items.push({ label: "Copy S3 URI", onClick: () => copyToClipboard(uri) });
    items.push({
      label: "Show download command…",
      onClick: () => setCliCommand({ action: "download", target }),
    });
    items.push({
      label: "Show delete command…",
      onClick: () => setCliCommand({ action: "delete", target }),
      danger: true,
    });
    return items;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter this folder…"
          className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
        />
        <div className="flex shrink-0 rounded-md border border-zinc-300 p-0.5 dark:border-zinc-700">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            title="Grid view"
            className={`rounded px-2 py-1 text-sm ${
              viewMode === "grid"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            ⊞
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
            title="List view"
            className={`rounded px-2 py-1 text-sm ${
              viewMode === "list"
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {isEmpty && (
        <p className="mt-8 text-sm text-zinc-500">
          {folders.length === 0 && files.length === 0
            ? "This folder is empty."
            : "No items match your filter."}
        </p>
      )}

      {!isEmpty && viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {visibleFolders.map((f) => (
            <Link
              key={f.full}
              href={`/?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(f.full)}`}
              onContextMenu={(e) => openFolderMenu(e, f)}
              className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-3 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              <div className="flex h-24 w-full items-center justify-center rounded bg-zinc-100 text-3xl dark:bg-zinc-800">
                📁
              </div>
              <div className="w-full truncate text-sm text-zinc-800 dark:text-zinc-200" title={f.name}>
                {f.name}
              </div>
            </Link>
          ))}
          {visibleFiles.map((f) => (
            <FileTile
              key={f.file.key}
              bucket={bucket}
              file={f.file}
              name={f.name}
              onSelect={() => setSelected(f)}
              onContextMenu={(e) => openFileMenu(e, f)}
            />
          ))}
        </div>
      )}

      {!isEmpty && viewMode === "list" && (
        <div className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {visibleFolders.map((f) => (
            <Link
              key={f.full}
              href={`/?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(f.full)}`}
              onContextMenu={(e) => openFolderMenu(e, f)}
              className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              <span className="text-lg">📁</span>
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-800 dark:text-zinc-200" title={f.name}>
                {f.name}
              </span>
            </Link>
          ))}
          {visibleFiles.map((f) => (
            <FileListRow
              key={f.file.key}
              file={f.file}
              name={f.name}
              onSelect={() => setSelected(f)}
              onContextMenu={(e) => openFileMenu(e, f)}
            />
          ))}
        </div>
      )}

      {selected && (
        <DetailsPanel
          bucket={bucket}
          file={selected.file}
          name={selected.name}
          onClose={() => setSelected(null)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItemsFor(contextMenu.target)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {cliCommand && (
        <CliCommandModal
          action={cliCommand.action}
          bucket={bucket}
          target={cliCommand.target}
          onClose={() => setCliCommand(null)}
        />
      )}
    </div>
  );
}

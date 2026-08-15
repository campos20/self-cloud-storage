"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FileTile from "./FileTile";
import DetailsPanel from "./DetailsPanel";
import type { FileEntry } from "@/lib/types";

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
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<{ file: FileEntry; name: string } | null>(null);

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

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter this folder…"
        className="mb-4 w-full max-w-sm rounded-md border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500"
      />

      {isEmpty && (
        <p className="mt-8 text-sm text-zinc-500">
          {folders.length === 0 && files.length === 0
            ? "This folder is empty."
            : "No items match your filter."}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {visibleFolders.map((f) => (
          <Link
            key={f.full}
            href={`/?bucket=${encodeURIComponent(bucket)}&prefix=${encodeURIComponent(f.full)}`}
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
          />
        ))}
      </div>

      {selected && (
        <DetailsPanel
          bucket={bucket}
          file={selected.file}
          name={selected.name}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

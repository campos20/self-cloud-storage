"use client";

import { FILE_KIND_ICON, getFileKind } from "@/lib/file-types";
import { formatBytes, formatDate } from "@/lib/format";
import type { FileEntry } from "@/lib/types";

export default function FileListRow({
  file,
  name,
  onSelect,
  onContextMenu,
}: {
  file: FileEntry;
  name: string;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const kind = getFileKind(name);

  return (
    <button
      onClick={onSelect}
      onContextMenu={onContextMenu}
      className="flex w-full items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
    >
      <span className="text-lg">{FILE_KIND_ICON[kind]}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-zinc-800 dark:text-zinc-200" title={name}>
        {name}
      </span>
      <span className="w-20 shrink-0 text-right text-xs text-zinc-500">
        {formatBytes(file.size)}
      </span>
      <span className="hidden w-40 shrink-0 text-right text-xs text-zinc-500 sm:block">
        {file.lastModified ? formatDate(file.lastModified) : "—"}
      </span>
    </button>
  );
}

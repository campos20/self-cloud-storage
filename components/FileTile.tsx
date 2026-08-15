"use client";

import { useEffect, useRef, useState } from "react";
import { FILE_KIND_ICON, getFileKind } from "@/lib/file-types";
import { formatBytes } from "@/lib/format";
import type { FileEntry } from "@/lib/types";

export default function FileTile({
  bucket,
  file,
  name,
  onSelect,
  onContextMenu,
}: {
  bucket: string;
  file: FileEntry;
  name: string;
  onSelect: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const kind = getFileKind(name);

  useEffect(() => {
    if (kind !== "image" || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [kind]);

  const src = `/api/object?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(file.key)}`;

  return (
    <button
      ref={ref}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-3 text-left transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
    >
      <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded bg-zinc-100 dark:bg-zinc-800">
        {kind === "image" && visible ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl">{FILE_KIND_ICON[kind]}</span>
        )}
      </div>
      <div className="w-full">
        <div className="truncate text-sm text-zinc-800 dark:text-zinc-200" title={name}>
          {name}
        </div>
        <div className="text-xs text-zinc-500">{formatBytes(file.size)}</div>
      </div>
    </button>
  );
}

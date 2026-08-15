"use client";

import { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export default function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  // Keep the menu on-screen regardless of where the click landed.
  const estimatedHeight = items.length * 32 + 8;
  const left = Math.max(8, Math.min(x, window.innerWidth - 200));
  const top = Math.max(8, Math.min(y, window.innerHeight - estimatedHeight));

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Context menu"
      style={{ left, top }}
      className="fixed z-50 min-w-[190px] rounded-md border border-zinc-200 bg-white py-1 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      {items.map((item) => (
        <button
          role="menuitem"
          key={item.label}
          onClick={() => {
            onClose();
            item.onClick();
          }}
          className={`block w-full px-3 py-1.5 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
            item.danger ? "text-red-600 dark:text-red-400" : "text-zinc-800 dark:text-zinc-200"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

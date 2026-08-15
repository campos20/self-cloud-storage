"use client";

import { useEffect, useRef, useState } from "react";
import { UserIcon } from "./Icons";

interface Identity {
  account: string;
  arn: string;
  userId: string;
  region: string | null;
}

const ARN_KIND_LABEL: Record<string, string> = {
  user: "IAM User",
  role: "IAM Role",
  "assumed-role": "Assumed Role",
  "federated-user": "Federated User",
};

// arn:aws:iam::123456789012:user/alice
// arn:aws:sts::123456789012:assumed-role/MyRole/session-name
// arn:aws:iam::123456789012:root
function describeArn(arn: string): { kind: string; name: string } {
  const resource = arn.split(":").slice(5).join(":");
  if (resource === "root") return { kind: "Root account", name: "root" };
  const [type, ...rest] = resource.split("/");
  return { kind: ARN_KIND_LABEL[type] ?? type, name: rest.join("/") || type };
}

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function toggle() {
    setOpen((wasOpen) => {
      const nowOpen = !wasOpen;
      if (nowOpen && !identity && !error && !loading) {
        setLoading(true);
        fetch("/api/whoami")
          .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
          .then(({ ok, body }) => {
            if (!ok) throw new Error(body.error || "Failed to load account info");
            setIdentity(body);
          })
          .catch((err) => setError(err instanceof Error ? err.message : String(err)))
          .finally(() => setLoading(false));
      }
      return nowOpen;
    });
  }

  const info = identity ? describeArn(identity.arn) : null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        title="AWS account"
        aria-label="AWS account"
        aria-expanded={open}
        className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      >
        <UserIcon className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-md border border-zinc-200 bg-white p-4 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          {loading && <p className="text-zinc-500">Loading…</p>}
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          {info && identity && (
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-zinc-500">Signed in as</dt>
                <dd className="break-all font-medium text-zinc-900 dark:text-zinc-100">
                  {info.name}
                </dd>
                <dd className="text-xs text-zinc-500">{info.kind}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Account ID</dt>
                <dd className="text-zinc-800 dark:text-zinc-200">{identity.account}</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Region</dt>
                <dd className="text-zinc-800 dark:text-zinc-200">
                  {identity.region ?? "SDK default"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">ARN</dt>
                <dd className="break-all text-xs text-zinc-600 dark:text-zinc-400">
                  {identity.arn}
                </dd>
              </div>
            </dl>
          )}
        </div>
      )}
    </div>
  );
}

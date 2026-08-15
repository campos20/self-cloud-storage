import Link from "next/link";
import type { BucketEntry } from "@/lib/types";

export default function BucketPicker({ buckets }: { buckets: BucketEntry[] }) {
  if (buckets.length === 0) {
    return (
      <div className="mx-auto mt-16 max-w-lg text-center text-zinc-500">
        No buckets visible to this AWS account.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Select a bucket
      </h1>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {buckets.map((b) => (
          <li key={b.name}>
            <Link
              href={`/?bucket=${encodeURIComponent(b.name)}`}
              className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                {b.name}
              </div>
              {b.creationDate && (
                <div className="mt-1 text-xs text-zinc-500">
                  Created {new Date(b.creationDate).toLocaleDateString()}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

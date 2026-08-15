import type { Metadata } from "next";
import Link from "next/link";
import packageJson from "@/package.json";

export const metadata: Metadata = {
  title: "About — Self Cloud Storage",
};

const REPO_URL = "https://github.com/campos20/self-cloud-storage";

export default function AboutPage() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">About</h1>
        <p className="mt-1 text-xs text-zinc-500">Version {packageJson.version}</p>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Self Cloud Storage is a local, read-only file browser and viewer
          for exploring your S3 buckets — think &ldquo;Google Drive UI for
          S3.&rdquo; It runs entirely on your own machine using your
          existing AWS credentials, the same way the AWS CLI does. It is
          never deployed anywhere, holds no state beyond the URL, and never
          writes, deletes, or uploads anything.
        </p>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          It&apos;s open source, licensed under the{" "}
          <a
            href="https://www.gnu.org/licenses/gpl-3.0.html"
            className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
          >
            GNU General Public License v3.0 or later
          </a>
          .
        </p>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          <a
            href={REPO_URL}
            className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400"
          >
            View source on GitHub
          </a>
        </p>

        <p className="mt-8">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back
          </Link>
        </p>
      </div>
    </main>
  );
}

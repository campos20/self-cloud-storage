export default function SetupNeeded() {
  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        No bucket configured
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Your AWS credentials don&apos;t have{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
          s3:ListAllMyBuckets
        </code>{" "}
        permission, so this app can&apos;t show a bucket picker.
      </p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Set the{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">
          S3_BUCKET
        </code>{" "}
        environment variable to the bucket you want to browse, then restart
        the dev server.
      </p>
    </div>
  );
}

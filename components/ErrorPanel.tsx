import { errorMessage, isCredentialsError, isRegionMissingError } from "@/lib/errors";

export default function ErrorPanel({ error }: { error: unknown }) {
  const message = errorMessage(error);

  if (isCredentialsError(error)) {
    return (
      <div className="mx-auto mt-16 max-w-lg rounded-lg border border-amber-300 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
          AWS credentials not found or expired
        </h2>
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
          This app reads your local AWS credentials the same way the AWS CLI
          does — nothing is stored here.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-300">
          <li>
            Using AWS SSO? Run{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">
              aws sso login
            </code>{" "}
            and reload this page.
          </li>
          <li>
            Otherwise, confirm{" "}
            <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">
              aws sts get-caller-identity
            </code>{" "}
            works in your terminal.
          </li>
        </ul>
        <p className="mt-3 truncate text-xs text-amber-700/70 dark:text-amber-400/70">
          {message}
        </p>
      </div>
    );
  }

  if (isRegionMissingError(error)) {
    return (
      <div className="mx-auto mt-16 max-w-lg rounded-lg border border-amber-300 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
        <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">
          No AWS region configured
        </h2>
        <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
          Your credentials look fine, but the SDK couldn&apos;t resolve a
          region. Either add{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">
            region = us-east-1
          </code>{" "}
          (or wherever your bucket lives) to your AWS profile, or set the{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900">
            AWS_REGION
          </code>{" "}
          environment variable before starting this app.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-16 max-w-lg rounded-lg border border-red-300 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <h2 className="text-lg font-semibold text-red-900 dark:text-red-200">
        Something went wrong talking to S3
      </h2>
      <p className="mt-2 text-sm text-red-800 dark:text-red-300">{message}</p>
    </div>
  );
}

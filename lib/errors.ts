interface AwsErrorLike {
  name?: string;
  message?: string;
}

function toAwsError(err: unknown): AwsErrorLike | null {
  if (err && typeof err === "object") return err as AwsErrorLike;
  return null;
}

export function isAccessDeniedError(err: unknown): boolean {
  const e = toAwsError(err);
  return e?.name === "AccessDenied" || e?.name === "AccessDeniedException";
}

// Covers missing/expired local credentials: no provider found, expired SSO
// session, expired STS token, etc. These are the cases where the fix is
// "run `aws sso login`" or "configure the AWS CLI", not a code bug.
export function isCredentialsError(err: unknown): boolean {
  const e = toAwsError(err);
  if (!e) return false;
  const name = e.name ?? "";
  const message = e.message ?? "";
  return (
    name === "CredentialsProviderError" ||
    name.includes("ExpiredToken") ||
    name === "UnrecognizedClientException" ||
    name === "InvalidClientTokenId" ||
    /sso session/i.test(message) ||
    /could not load credentials/i.test(message)
  );
}

// A very common local setup gotcha: credentials are fine but no default
// region is configured (no AWS_REGION env var, no `region` in the AWS
// profile). The SDK throws a plain Error for this, not a named exception.
export function isRegionMissingError(err: unknown): boolean {
  const e = toAwsError(err);
  return !!e && /region is missing/i.test(e.message ?? "");
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

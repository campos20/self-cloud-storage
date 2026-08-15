import {
  GetObjectCommand,
  HeadBucketCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  type S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "./aws";
import { isAccessDeniedError } from "./errors";
import type { BucketEntry, FileEntry } from "./types";

const bucketRegionCache = new Map<string, string>();

// Buckets can live in any region, but a client only talks to the region
// it's configured for — addressing the wrong one is exactly the
// "must be addressed using the specified endpoint" (PermanentRedirect)
// error. HeadBucket can be sent to any regional endpoint, but when that
// endpoint is wrong it *throws* a 301 rather than returning `BucketRegion`
// on the typed output — the real region only shows up in the raw
// `x-amz-bucket-region` response header, still attached to the thrown
// exception's `$response`. We discover it once per bucket and reuse a
// correctly-configured client from then on.
async function getClientForBucket(bucket: string): Promise<S3Client> {
  const cachedRegion = bucketRegionCache.get(bucket);
  if (cachedRegion) return getS3Client(cachedRegion);

  let region: string | undefined;
  try {
    const res = await getS3Client().send(new HeadBucketCommand({ Bucket: bucket }));
    region = res.BucketRegion;
  } catch (err) {
    region = extractBucketRegionFromError(err);
  }

  if (!region) return getS3Client();
  bucketRegionCache.set(bucket, region);
  return getS3Client(region);
}

function extractBucketRegionFromError(err: unknown): string | undefined {
  if (!err || typeof err !== "object" || !("$response" in err)) return undefined;
  const response = (err as { $response?: { headers?: Record<string, string> } }).$response;
  return response?.headers?.["x-amz-bucket-region"];
}

// Returns null (rather than throwing) when ListBuckets is denied, so the
// caller can fall back to an env-configured bucket instead of erroring out.
export async function listBuckets(): Promise<BucketEntry[] | null> {
  const client = getS3Client();
  try {
    const res = await client.send(new ListBucketsCommand({}));
    return (res.Buckets ?? [])
      .filter((b) => b.Name)
      .map((b) => ({
        name: b.Name!,
        creationDate: b.CreationDate ? b.CreationDate.toISOString() : null,
      }));
  } catch (err) {
    if (isAccessDeniedError(err)) return null;
    throw err;
  }
}

export async function listObjects(
  bucket: string,
  prefix: string
): Promise<{ folders: string[]; files: FileEntry[] }> {
  const client = await getClientForBucket(bucket);
  const folders = new Set<string>();
  const files: FileEntry[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        Delimiter: "/",
        ContinuationToken: continuationToken,
      })
    );

    for (const cp of res.CommonPrefixes ?? []) {
      if (cp.Prefix) folders.add(cp.Prefix);
    }
    for (const obj of res.Contents ?? []) {
      // Skip the zero-byte "folder marker" object S3 sometimes returns for
      // the prefix itself.
      if (!obj.Key || obj.Key === prefix) continue;
      files.push({
        key: obj.Key,
        size: obj.Size ?? 0,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : null,
        storageClass: obj.StorageClass ?? null,
      });
    }

    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return { folders: Array.from(folders).sort(), files };
}

export async function getPresignedGetUrl(
  bucket: string,
  key: string,
  options: { expiresInSeconds?: number; download?: boolean } = {}
): Promise<string> {
  const { expiresInSeconds = 300, download = false } = options;
  const client = await getClientForBucket(bucket);
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    // With this set, S3's own response carries Content-Disposition, so a
    // plain link triggers a real download instead of an inline view — no
    // client-side download-attribute trickery needed, and it survives the
    // cross-origin redirect from /api/object to S3.
    ...(download ? { ResponseContentDisposition: buildContentDisposition(key) } : {}),
  });
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

function buildContentDisposition(key: string): string {
  const filename = key.split("/").pop() || "download";
  const asciiFallback = filename.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'");
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

// Text preview is the one case that can't use the redirect-to-presigned-URL
// approach: the browser follows that redirect with `fetch()`, which is a
// CORS-checked request, and personal buckets rarely have a CORS policy
// allowing this app's origin. Requiring one would break the "if the AWS CLI
// works, this works" promise, so this reads a small range server-side
// instead — bytes never leave Node's process for anything else.
export async function getObjectTextPreview(
  bucket: string,
  key: string,
  maxBytes = 50_000
): Promise<string> {
  const client = await getClientForBucket(bucket);
  const res = await client.send(
    new GetObjectCommand({ Bucket: bucket, Key: key, Range: `bytes=0-${maxBytes - 1}` })
  );
  if (!res.Body) return "";
  return res.Body.transformToString("utf-8");
}
